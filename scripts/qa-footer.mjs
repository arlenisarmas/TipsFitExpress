import { mkdirSync, writeFileSync } from "node:fs";
import { get } from "node:http";
import { spawn } from "node:child_process";
import { resolve } from "node:path";

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const port = 5500;
const cdpPort = 9333;
const root = resolve(".");
const sizes = [
  [360, 640, true, "mobile-360x640"],
  [375, 667, true, "mobile-375x667"],
  [390, 844, true, "mobile-390x844"],
  [412, 915, true, "mobile-412x915"],
  [430, 932, true, "mobile-430x932"],
  [768, 1024, true, "tablet-768x1024"],
  [1366, 768, false, "desktop-1366x768"],
  [1920, 1080, false, "desktop-1920x1080"],
];

function wait(ms) {
  return new Promise((resolveWait) => setTimeout(resolveWait, ms));
}

function getJson(url) {
  return new Promise((resolveJson, reject) => {
    get(url, (response) => {
      let data = "";
      response.on("data", (chunk) => {
        data += chunk;
      });
      response.on("end", () => {
        try {
          resolveJson(JSON.parse(data));
        } catch (error) {
          reject(error);
        }
      });
    }).on("error", reject);
  });
}

function createCdpClient(wsUrl) {
  const socket = new WebSocket(wsUrl);
  let id = 0;
  const pending = new Map();

  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const { resolveCommand, rejectCommand } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) {
        rejectCommand(new Error(message.error.message));
      } else {
        resolveCommand(message.result);
      }
    }
  });

  return new Promise((resolveClient, reject) => {
    socket.addEventListener("open", () => {
      resolveClient({
        send(method, params = {}) {
          const commandId = ++id;
          socket.send(JSON.stringify({ id: commandId, method, params }));
          return new Promise((resolveCommand, rejectCommand) => {
            pending.set(commandId, { resolveCommand, rejectCommand });
          });
        },
        close() {
          socket.close();
        },
      });
    });
    socket.addEventListener("error", reject);
  });
}

async function waitForServer() {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      await new Promise((resolveServer, reject) => {
        get(`http://localhost:${port}`, (response) => {
          response.resume();
          response.statusCode === 200 ? resolveServer() : reject(new Error("Not ready"));
        }).on("error", reject);
      });
      return;
    } catch {
      await wait(250);
    }
  }
  throw new Error("Local server did not start");
}

async function waitForCdp() {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      return await getJson(`http://127.0.0.1:${cdpPort}/json/version`);
    } catch {
      await wait(250);
    }
  }
  throw new Error("Chrome CDP did not start");
}

async function waitForStableLayout(client) {
  await client.send("Runtime.evaluate", {
    awaitPromise: true,
    expression: `Promise.race([
      Promise.all([
        document.fonts?.ready || Promise.resolve(),
        new Promise((resolve) => {
          const images = [...document.images];
          if (images.every((image) => image.complete)) {
            resolve();
            return;
          }
          let pending = images.filter((image) => !image.complete).length;
          const done = () => {
            pending -= 1;
            if (pending <= 0) resolve();
          };
          images.forEach((image) => {
            if (image.complete) return;
            image.addEventListener("load", done, { once: true });
            image.addEventListener("error", done, { once: true });
          });
        }),
      ]),
      new Promise((resolve) => setTimeout(resolve, 3500)),
    ]).then(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))))`,
  });
}

async function waitForInitialPageLoad(client) {
  await client.send("Runtime.evaluate", {
    awaitPromise: true,
    expression: `Promise.race([
      new Promise((resolve) => {
        if (document.readyState === "complete") {
          resolve();
          return;
        }
        window.addEventListener("load", resolve, { once: true });
      }),
      new Promise((resolve) => setTimeout(resolve, 3500)),
    ])`,
  });
}

async function scrollToAbsoluteBottom(client) {
  await client.send("Runtime.evaluate", {
    awaitPromise: true,
    expression: `new Promise((resolve) => {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" });
      requestAnimationFrame(() => requestAnimationFrame(resolve));
    })`,
  });
  await client.send("Runtime.evaluate", {
    awaitPromise: true,
    expression: `new Promise((resolve) => {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" });
      requestAnimationFrame(() => requestAnimationFrame(resolve));
    })`,
  });
  await wait(450);
}

async function evaluateFooter(client, phase) {
  const evaluation = await client.send("Runtime.evaluate", {
    returnByValue: true,
    expression: `(() => {
      const footer = document.querySelector(".footer");
      const legal = document.querySelector(".footer-legal");
      const actions = document.querySelector(".floating-actions");
      const doc = document.documentElement;
      const body = document.body;
      const rect = footer.getBoundingClientRect();
      const legalRect = legal.getBoundingClientRect();
      const actionsRect = actions.getBoundingClientRect();
      const probe = document.elementFromPoint(Math.floor(window.innerWidth / 2), window.innerHeight - 2);
      const footerStyle = getComputedStyle(footer);
      const legalStyle = getComputedStyle(legal);
      const actionsStyle = getComputedStyle(actions);
      const container = document.querySelector(".landing-container");
      const main = document.querySelector("main");
      const containerStyle = getComputedStyle(container);
      const mainStyle = getComputedStyle(main);
      const bodyStyle = getComputedStyle(body);
      const htmlStyle = getComputedStyle(doc);
      const ancestors = [];
      let element = legal;
      while (element) {
        const styles = getComputedStyle(element);
        ancestors.push({
          selector: element === doc ? "html" : element === body ? "body" : element.tagName.toLowerCase() + (element.id ? "#" + element.id : "") + (element.className ? "." + String(element.className).trim().replace(/\\s+/g, ".") : ""),
          overflow: styles.overflow,
          overflowY: styles.overflowY,
          height: styles.height,
          maxHeight: styles.maxHeight,
          position: styles.position,
          transform: styles.transform,
          contain: styles.contain,
        });
        element = element.parentElement;
      }
      const scrollContainers = [doc, body, container, main].map((node) => {
        const styles = getComputedStyle(node);
        return {
          selector: node === doc ? "html" : node === body ? "body" : node.tagName.toLowerCase() + (node.className ? "." + String(node.className).trim().replace(/\\s+/g, ".") : ""),
          overflowY: styles.overflowY,
          scrollHeight: node.scrollHeight,
          clientHeight: node.clientHeight,
          scrollTop: node.scrollTop || 0,
          controlsScroll: node.scrollHeight > node.clientHeight && /(auto|scroll)/.test(styles.overflowY),
        };
      });
      return {
        phase: ${JSON.stringify(phase)},
        width: window.innerWidth,
        height: window.innerHeight,
        scrollHeight: doc.scrollHeight,
        scrollWidth: doc.scrollWidth,
        bodyScrollHeight: body.scrollHeight,
        scrollY: window.scrollY,
        maxScrollY: doc.scrollHeight - window.innerHeight,
        atAbsoluteBottom: Math.abs(window.scrollY - (doc.scrollHeight - window.innerHeight)) <= 2,
        footerTop: rect.top,
        footerBottom: rect.bottom,
        footerHeight: rect.height,
        footerScrollHeight: footer.scrollHeight,
        footerClientHeight: footer.clientHeight,
        footerFitsOwnContent: footer.scrollHeight === footer.clientHeight,
        footerOverflow: footerStyle.overflow,
        footerPosition: footerStyle.position,
        footerTransform: footerStyle.transform,
        footerMarginBottom: footerStyle.marginBottom,
        footerPaddingBottom: footerStyle.paddingBottom,
        legalTop: legalRect.top,
        legalBottom: legalRect.bottom,
        legalHeight: legalRect.height,
        legalFullyVisible: legalRect.top >= 0 && legalRect.bottom <= window.innerHeight,
        legalOverflow: legalStyle.overflow,
        legalPosition: legalStyle.position,
        legalTransform: legalStyle.transform,
        legalMarginBottom: legalStyle.marginBottom,
        legalWhiteSpace: legalStyle.whiteSpace,
        legalLineHeight: legalStyle.lineHeight,
        containerHeight: containerStyle.height,
        containerMinHeight: containerStyle.minHeight,
        containerOverflow: containerStyle.overflow,
        containerOverflowY: containerStyle.overflowY,
        mainHeight: mainStyle.height,
        mainOverflow: mainStyle.overflow,
        mainOverflowY: mainStyle.overflowY,
        bodyHeight: bodyStyle.height,
        bodyOverflow: bodyStyle.overflow,
        bodyOverflowY: bodyStyle.overflowY,
        htmlHeight: htmlStyle.height,
        htmlOverflow: htmlStyle.overflow,
        htmlOverflowY: htmlStyle.overflowY,
        actionsPosition: actionsStyle.position,
        actionsDisplay: actionsStyle.display,
        actionsVisibility: actionsStyle.visibility,
        actionsOpacity: actionsStyle.opacity,
        actionsTop: actionsRect.top,
        actionsBottom: actionsRect.bottom,
        probeTag: probe?.tagName || null,
        probeClass: probe?.className || null,
        probeBg: probe ? getComputedStyle(probe).backgroundColor : null,
        horizontalOverflow: doc.scrollWidth > doc.clientWidth,
        footerEndsDocument: Math.abs(rect.bottom - window.innerHeight) <= 1,
        responsiveRule: window.innerWidth <= 767
          ? "@media (max-width: 767px)"
          : window.innerWidth <= 1023
            ? "base/tablet range"
            : "@media (min-width: 1024px)",
        ancestors,
        scrollContainers,
      };
    })()`,
  });
  return evaluation.result.value;
}

const server = spawn(process.execPath, ["scripts/dev-server.mjs"], {
  cwd: root,
  stdio: "ignore",
});

await waitForServer();

const chrome = spawn(chromePath, [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  `--remote-debugging-port=${cdpPort}`,
  `--user-data-dir=${resolve(root, ".tmp-qa-chrome-footer")}`,
  `http://localhost:${port}`,
], {
  stdio: "ignore",
});

await waitForCdp();
const targets = await getJson(`http://127.0.0.1:${cdpPort}/json/list`);
const pageTarget = targets.find((target) => target.type === "page");
if (!pageTarget?.webSocketDebuggerUrl) {
  throw new Error("Chrome page target was not available");
}
const client = await createCdpClient(pageTarget.webSocketDebuggerUrl);
await client.send("Page.enable");
await client.send("Runtime.enable");
mkdirSync("docs", { recursive: true });

const results = [];

for (const [width, height, mobile, label] of sizes) {
  await client.send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile,
  });
  await client.send("Page.navigate", { url: `http://localhost:${port}/` });
  await waitForInitialPageLoad(client);
  await waitForStableLayout(client);
  const beforeScroll = await evaluateFooter(client, "before-scroll");
  await scrollToAbsoluteBottom(client);
  const result = await evaluateFooter(client, "after-scroll");

  if (!result.atAbsoluteBottom) {
    throw new Error(`Capture blocked for ${label}: scrollY ${result.scrollY} does not match maxScrollY ${result.maxScrollY}`);
  }

  result.beforeScrollY = beforeScroll.scrollY;
  result.beforeMaxScrollY = beforeScroll.maxScrollY;
  result.beforeAtAbsoluteBottom = beforeScroll.atAbsoluteBottom;
  results.push(result);

  if (width === 390 || width === 412 || width === 430) {
    const screenshot = await client.send("Page.captureScreenshot", {
      format: "png",
      fromSurface: true,
    });
    writeFileSync(`docs/qa-footer-${label}-${width}x${height}.png`, Buffer.from(screenshot.data, "base64"));
  }
}

await client.close();
chrome.kill();
server.kill();

writeFileSync("docs/qa-footer-results.json", `${JSON.stringify(results, null, 2)}\n`);
console.log(JSON.stringify(results, null, 2));
