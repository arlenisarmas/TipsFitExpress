import { mkdirSync, writeFileSync } from "node:fs";
import { get } from "node:http";
import { spawn } from "node:child_process";
import { resolve } from "node:path";

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const port = 5500;
const cdpPort = 9444;
const root = resolve(".");

const viewports = [
  { width: 360, height: 640, label: "mobile-360x640", mobile: true },
  { width: 375, height: 667, label: "mobile-375x667", mobile: true },
  { width: 390, height: 844, label: "iphone-12-pro-390x844", mobile: true },
  { width: 412, height: 915, label: "galaxy-s20-ultra-412x915", mobile: true },
  { width: 430, height: 932, label: "iphone-14-pro-max-430x932", mobile: true },
  { width: 768, height: 1024, label: "tablet-768x1024", mobile: true },
  { width: 820, height: 1180, label: "tablet-820x1180", mobile: true },
  { width: 1024, height: 1366, label: "tablet-1024x1366", mobile: false },
  { width: 1280, height: 720, label: "desktop-1280x720", mobile: false },
  { width: 1366, height: 768, label: "desktop-1366x768", mobile: false },
  { width: 1440, height: 900, label: "desktop-1440x900", mobile: false },
  { width: 1920, height: 1080, label: "desktop-1920x1080", mobile: false },
  { width: 2560, height: 1440, label: "desktop-2560x1440", mobile: false },
];

const scrollPercents = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 100];
const requiredShots = new Map([
  ["galaxy-s20-ultra-412x915", ["bonus-03", "after-bonus", "faq", "footer", "bottom"]],
  ["iphone-12-pro-390x844", ["bonus-03", "footer", "bottom"]],
  ["iphone-14-pro-max-430x932", ["bonus-03", "footer", "bottom"]],
]);

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
        get(`http://localhost:${port}/index.html`, (response) => {
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
          const images = [...document.images].filter((image) => !image.complete);
          if (!images.length) {
            resolve();
            return;
          }
          let pending = images.length;
          const done = () => {
            pending -= 1;
            if (pending <= 0) resolve();
          };
          images.forEach((image) => {
            image.addEventListener("load", done, { once: true });
            image.addEventListener("error", done, { once: true });
          });
        }),
      ]),
      new Promise((resolve) => setTimeout(resolve, 3500)),
    ]).then(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))))`,
  });
}

async function scrollAndMeasure(client, targetY, viewport) {
  await client.send("Runtime.evaluate", {
    awaitPromise: true,
    expression: `new Promise((resolve) => {
      window.scrollTo({ top: ${Math.max(0, Math.round(targetY))}, behavior: "instant" });
      requestAnimationFrame(() => requestAnimationFrame(resolve));
    })`,
  });
  await wait(450);
  const evaluation = await client.send("Runtime.evaluate", {
    returnByValue: true,
    expression: `(() => {
      function rectanglesOverlap(a, b) {
        return !(
          a.right <= b.left ||
          a.left >= b.right ||
          a.bottom <= b.top ||
          a.top >= b.bottom
        );
      }

      const root = document.documentElement;
      const body = document.body;
      const footer = document.querySelector(".footer");
      const legal = document.querySelector(".footer-legal");
      const floating = document.querySelector(".floating-actions");
      const floatingStyle = getComputedStyle(floating);
      const floatingRect = floating.getBoundingClientRect();
      const footerRect = footer.getBoundingClientRect();
      const legalRect = legal.getBoundingClientRect();
      const floatingHidden = floatingStyle.display === "none" ||
        (floatingStyle.visibility === "hidden" && floatingStyle.pointerEvents === "none");
      const floatingVisible = !floatingHidden &&
        floatingRect.width > 0 &&
        floatingRect.height > 0 &&
        floatingRect.bottom > 0 &&
        floatingRect.top < window.innerHeight;

      const visibleContent = [
        ...document.querySelectorAll(
          "main img, main h1, main h2, main h3, main p, main li, main a, main button, main article, footer a, footer p, footer nav, footer .footer-brand"
        )
      ].filter((element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return (
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          rect.width > 0 &&
          rect.height > 0 &&
          rect.bottom > 0 &&
          rect.top < window.innerHeight
        );
      });

      const collisions = floatingVisible
        ? visibleContent
            .map((element) => {
              const rect = element.getBoundingClientRect();
              return {
                selector: element.tagName.toLowerCase() +
                  (element.id ? "#" + element.id : "") +
                  (element.className ? "." + String(element.className).trim().replace(/\\s+/g, ".") : ""),
                text: (element.textContent || element.alt || "").trim().slice(0, 80),
                overlap: rectanglesOverlap(floatingRect, rect),
              };
            })
            .filter((item) => item.overlap)
        : [];

      const clickSelectors = [
        ".price-row .button",
        ".bonus-grid article a",
        ".final-cta__button",
        ".footer-button",
        ".faq summary",
        ".footer-social a",
      ];
      const clickIssues = [];
      document.querySelectorAll(clickSelectors.join(",")).forEach((element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        if (
          style.display === "none" ||
          style.visibility === "hidden" ||
          rect.width <= 0 ||
          rect.height <= 0 ||
          rect.bottom <= 0 ||
          rect.top >= window.innerHeight
        ) {
          return;
        }
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        if (centerX < 0 || centerX > window.innerWidth || centerY < 0 || centerY > window.innerHeight) {
          return;
        }
        const topElement = document.elementFromPoint(centerX, centerY);
        const valid = topElement === element || element.contains(topElement);
        if (!valid) {
          clickIssues.push({
            selector: element.tagName.toLowerCase() +
              (element.className ? "." + String(element.className).trim().replace(/\\s+/g, ".") : ""),
            blocker: topElement
              ? topElement.tagName.toLowerCase() +
                (topElement.className ? "." + String(topElement.className).trim().replace(/\\s+/g, ".") : "")
              : null,
          });
        }
      });

      const maxScrollY = Math.max(root.scrollHeight, body.scrollHeight) - window.innerHeight;
      const footerResult = {
        atAbsoluteBottom: Math.abs(window.scrollY - maxScrollY) <= 2,
        footerFullyReachable: footerRect.bottom <= window.innerHeight + 2,
        legalFullyVisible: legalRect.top >= 0 && legalRect.bottom <= window.innerHeight,
        legalInsideFooter: legalRect.top >= footerRect.top && legalRect.bottom <= footerRect.bottom,
        footerNotClipped: footer.scrollHeight <= footer.clientHeight + 1,
        noHorizontalOverflow: root.scrollWidth <= root.clientWidth,
        floatingHidden,
        floatingDoesNotTouchFooter: floatingHidden ||
          floatingStyle.visibility === "hidden" ||
          !rectanglesOverlap(floatingRect, footerRect),
      };

      return {
        viewport: ${JSON.stringify(viewport.label)},
        width: window.innerWidth,
        height: window.innerHeight,
        scrollY: window.scrollY,
        maxScrollY,
        scrollPercent: maxScrollY > 0 ? Math.round((window.scrollY / maxScrollY) * 1000) / 10 : 100,
        floatingDisplay: floatingStyle.display,
        floatingVisibility: floatingStyle.visibility,
        floatingPointerEvents: floatingStyle.pointerEvents,
        floatingOpacity: floatingStyle.opacity,
        floatingVisible,
        mobileFloatingHidden: ${viewport.width <= 767} ? floatingHidden : true,
        collisions,
        clickIssues,
        footerResult,
        pass:
          (${viewport.width <= 767} ? floatingHidden : true) &&
          collisions.length === 0 &&
          clickIssues.length === 0 &&
          root.scrollWidth <= root.clientWidth,
      };
    })()`,
  });
  return evaluation.result.value;
}

async function captureAtSelector(client, selector, fileName) {
  await client.send("Runtime.evaluate", {
    awaitPromise: true,
    expression: `new Promise((resolve) => {
      const element = document.querySelector(${JSON.stringify(selector)});
      if (element) element.scrollIntoView({ block: "center" });
      requestAnimationFrame(() => requestAnimationFrame(resolve));
    })`,
  });
  await wait(450);
  const screenshot = await client.send("Page.captureScreenshot", {
    format: "png",
    fromSurface: true,
  });
  writeFileSync(`docs/${fileName}.png`, Buffer.from(screenshot.data, "base64"));
}

async function captureAtBottom(client, fileName) {
  await client.send("Runtime.evaluate", {
    awaitPromise: true,
    expression: `new Promise((resolve) => {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" });
      requestAnimationFrame(() => requestAnimationFrame(resolve));
    })`,
  });
  await wait(450);
  const screenshot = await client.send("Page.captureScreenshot", {
    format: "png",
    fromSurface: true,
  });
  writeFileSync(`docs/${fileName}.png`, Buffer.from(screenshot.data, "base64"));
}

mkdirSync("docs", { recursive: true });

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
  `--user-data-dir=${resolve(root, ".tmp-qa-chrome-overlap")}`,
  `http://localhost:${port}/index.html`,
], {
  stdio: "ignore",
});

try {
  await waitForCdp();
  const targets = await getJson(`http://127.0.0.1:${cdpPort}/json/list`);
  const pageTarget = targets.find((target) => target.type === "page");
  if (!pageTarget?.webSocketDebuggerUrl) {
    throw new Error("Chrome page target was not available");
  }
  const client = await createCdpClient(pageTarget.webSocketDebuggerUrl);
  await client.send("Page.enable");
  await client.send("Runtime.enable");

  const viewportResults = [];
  const allMeasurements = [];

  for (const viewport of viewports) {
    await client.send("Emulation.setDeviceMetricsOverride", {
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 1,
      mobile: viewport.mobile,
    });
    await client.send("Page.navigate", { url: `http://localhost:${port}/index.html` });
    await waitForStableLayout(client);

    const maxScroll = await client.send("Runtime.evaluate", {
      returnByValue: true,
      expression: "Math.max(document.documentElement.scrollHeight, document.body.scrollHeight) - window.innerHeight",
    });
    const maxScrollY = maxScroll.result.value;
    const positions = scrollPercents.map((percent) => ({
      label: `${percent}%`,
      y: Math.round(maxScrollY * (percent / 100)),
    }));

    const selectorPositions = [
      { label: "bonus-01", selector: ".bonus-grid article:nth-of-type(1)" },
      { label: "bonus-02", selector: ".bonus-grid article:nth-of-type(2)" },
      { label: "bonus-03", selector: ".bonus-grid article:nth-of-type(3)" },
      { label: "after-bonus", selector: ".testimonials" },
      { label: "testimonials", selector: ".testimonials" },
      { label: "final-cta", selector: ".final-cta" },
      { label: "faq", selector: ".faq" },
      { label: "footer-entry", selector: ".footer" },
    ];

    for (const position of positions) {
      allMeasurements.push(await scrollAndMeasure(client, position.y, viewport));
    }

    for (const position of selectorPositions) {
      const yResult = await client.send("Runtime.evaluate", {
        returnByValue: true,
        expression: `(() => {
          const element = document.querySelector(${JSON.stringify(position.selector)});
          if (!element) return null;
          const rect = element.getBoundingClientRect();
          return Math.max(0, window.scrollY + rect.top - Math.round(window.innerHeight * 0.28));
        })()`,
      });
      if (typeof yResult.result.value === "number") {
        const measurement = await scrollAndMeasure(client, yResult.result.value, viewport);
        measurement.positionLabel = position.label;
        allMeasurements.push(measurement);
      }
    }

    const bottom = await scrollAndMeasure(client, maxScrollY, viewport);
    bottom.positionLabel = "bottom";
    allMeasurements.push(bottom);

    const viewportMeasurements = allMeasurements.filter((item) => item.viewport === viewport.label);
    const collisions = viewportMeasurements.flatMap((item) => item.collisions);
    const clickIssues = viewportMeasurements.flatMap((item) => item.clickIssues);
    const mobileHiddenPass = viewport.width <= 767
      ? viewportMeasurements.every((item) => item.mobileFloatingHidden)
      : true;
    const footerPass = bottom.footerResult.atAbsoluteBottom &&
      bottom.footerResult.footerFullyReachable &&
      bottom.footerResult.legalFullyVisible &&
      bottom.footerResult.legalInsideFooter &&
      bottom.footerResult.footerNotClipped &&
      bottom.footerResult.noHorizontalOverflow &&
      bottom.footerResult.floatingHidden &&
      bottom.footerResult.floatingDoesNotTouchFooter;
    const pass = collisions.length === 0 &&
      clickIssues.length === 0 &&
      mobileHiddenPass &&
      footerPass &&
      viewportMeasurements.every((item) => item.pass);

    viewportResults.push({
      viewport: viewport.label,
      width: viewport.width,
      height: viewport.height,
      positionsTested: viewportMeasurements.length,
      floatingMode: viewport.width <= 767 ? "hidden on mobile" : bottom.floatingDisplay,
      collisions: collisions.length,
      clickIssues: clickIssues.length,
      footer: bottom.footerResult,
      pass,
    });

    if (requiredShots.has(viewport.label)) {
      const shots = requiredShots.get(viewport.label);
      for (const shot of shots) {
        if (shot === "bottom") {
          await captureAtBottom(client, `qa-overlap-${viewport.label}-bottom`);
        } else {
          const selector = shot === "bonus-03"
            ? ".bonus-grid article:nth-of-type(3)"
            : shot === "after-bonus"
              ? ".testimonials"
              : shot === "faq"
                ? ".faq"
                : ".footer";
          await captureAtSelector(client, selector, `qa-overlap-${viewport.label}-${shot}`);
        }
      }
    }
  }

  const totalCollisions = viewportResults.reduce((sum, item) => sum + item.collisions, 0);
  const totalClickIssues = viewportResults.reduce((sum, item) => sum + item.clickIssues, 0);
  const report = {
    generatedAt: new Date().toISOString(),
    command: "node scripts/qa-responsive-overlap.mjs",
    totalViewports: viewports.length,
    totalPositionsTested: allMeasurements.length,
    totalCollisions,
    totalClickIssues,
    pass: viewportResults.every((item) => item.pass),
    viewports: viewportResults,
    measurements: allMeasurements,
  };

  writeFileSync("docs/QA_OVERLAP_RESULTS.json", `${JSON.stringify(report, null, 2)}\n`);
  const markdown = [
    "# QA overlap responsive - TipsFitExpress",
    "",
    `Command: \`node scripts/qa-responsive-overlap.mjs\``,
    `Total viewports: ${report.totalViewports}`,
    `Total positions tested: ${report.totalPositionsTested}`,
    `Total collisions: ${report.totalCollisions}`,
    `Total click issues: ${report.totalClickIssues}`,
    `Result: ${report.pass ? "PASS" : "FAIL"}`,
    "",
    "| Viewport | Positions | Floating | Collisions | Click issues | Footer legal | PASS |",
    "|---|---:|---|---:|---:|---|---|",
    ...viewportResults.map((item) => `| ${item.viewport} | ${item.positionsTested} | ${item.floatingMode} | ${item.collisions} | ${item.clickIssues} | ${item.footer.legalFullyVisible ? "visible" : "hidden"} | ${item.pass ? "PASS" : "FAIL"} |`),
    "",
    "Required captures:",
    "",
    "- docs/qa-overlap-galaxy-s20-ultra-412x915-bonus-03.png",
    "- docs/qa-overlap-galaxy-s20-ultra-412x915-after-bonus.png",
    "- docs/qa-overlap-galaxy-s20-ultra-412x915-faq.png",
    "- docs/qa-overlap-galaxy-s20-ultra-412x915-footer.png",
    "- docs/qa-overlap-galaxy-s20-ultra-412x915-bottom.png",
    "- docs/qa-overlap-iphone-12-pro-390x844-bonus-03.png",
    "- docs/qa-overlap-iphone-12-pro-390x844-footer.png",
    "- docs/qa-overlap-iphone-12-pro-390x844-bottom.png",
    "- docs/qa-overlap-iphone-14-pro-max-430x932-bonus-03.png",
    "- docs/qa-overlap-iphone-14-pro-max-430x932-footer.png",
    "- docs/qa-overlap-iphone-14-pro-max-430x932-bottom.png",
  ].join("\n");
  writeFileSync("docs/QA_OVERLAP_RESULTS.md", `${markdown}\n`);
  console.log(JSON.stringify({
    pass: report.pass,
    totalViewports: report.totalViewports,
    totalPositionsTested: report.totalPositionsTested,
    totalCollisions: report.totalCollisions,
    totalClickIssues: report.totalClickIssues,
    viewports: viewportResults.map((item) => ({
      viewport: item.viewport,
      positionsTested: item.positionsTested,
      collisions: item.collisions,
      clickIssues: item.clickIssues,
      pass: item.pass,
    })),
  }, null, 2));
  await client.close();
  if (!report.pass) {
    process.exitCode = 1;
  }
} finally {
  chrome.kill();
  server.kill();
}
