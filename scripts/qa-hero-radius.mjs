import { mkdirSync, writeFileSync } from "node:fs";
import { get } from "node:http";
import { spawn } from "node:child_process";
import { resolve } from "node:path";

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const port = 5500;
const cdpPort = 9666;
const root = resolve(".");
const outDir = resolve("docs");
const profileDir = resolve(`.tmp-qa-chrome-hero-radius-${Date.now()}`);
const sizes = [
  [390, 844, true, "hero-radius-390x844"],
  [412, 915, true, "hero-radius-412x915"],
  [430, 932, true, "hero-radius-430x932"],
  [360, 640, true, "hero-radius-360x640"],
  [375, 667, true, "hero-radius-375x667"],
  [768, 1024, true, "hero-radius-768x1024"],
  [1366, 768, false, "hero-radius-1366x768"],
  [1920, 1080, false, "hero-radius-1920x1080"],
];

function wait(ms) {
  return new Promise((resolveWait) => setTimeout(resolveWait, ms));
}

function getJson(url) {
  return new Promise((resolveJson, reject) => {
    const request = get(url, (response) => {
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
    request.setTimeout(500, () => {
      request.destroy(new Error(`Timeout loading ${url}`));
    });
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
      if (message.error) rejectCommand(new Error(message.error.message));
      else resolveCommand(message.result);
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

async function waitForChrome() {
  for (let i = 0; i < 40; i += 1) {
    try {
      const version = await getJson(`http://127.0.0.1:${cdpPort}/json/version`);
      if (version.webSocketDebuggerUrl) return version.webSocketDebuggerUrl;
    } catch {
      await wait(250);
    }
  }
  throw new Error("Chrome CDP did not start");
}

async function run() {
  console.log("Running hero radius QA");
  mkdirSync(outDir, { recursive: true });
  const chrome = spawn(chromePath, [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-dev-shm-usage",
    `--remote-debugging-port=${cdpPort}`,
    `--user-data-dir=${profileDir}`,
    `http://localhost:${port}/`,
  ], { stdio: "ignore" });

  await waitForChrome();
  const targets = await getJson(`http://127.0.0.1:${cdpPort}/json/list`);
  const target = targets.find((item) => item.type === "page");
  if (!target?.webSocketDebuggerUrl) throw new Error("Chrome page target was not available");
  const page = await createCdpClient(target.webSocketDebuggerUrl);
  await page.send("Page.enable");
  await page.send("Runtime.enable");
  const results = [];

  try {
    for (const [width, height, mobile, label] of sizes) {
      await page.send("Emulation.setDeviceMetricsOverride", {
        width,
        height,
        deviceScaleFactor: 1,
        mobile,
      });
      await page.send("Page.navigate", { url: `http://localhost:${port}/` });
      await wait(900);
      await page.send("Runtime.evaluate", {
        expression: `document.querySelector(".hero-visual").scrollIntoView({ block: "center" })`,
      });
      await wait(350);

      const evalResult = await page.send("Runtime.evaluate", {
        returnByValue: true,
        expression: `(() => {
          const image = document.querySelector(".hero-visual > img");
          const wrapper = image.closest(".hero-visual");
          const imageRect = image.getBoundingClientRect();
          const wrapperRect = wrapper.getBoundingClientRect();
          return {
            label: ${JSON.stringify(label)},
            selectorImage: ".hero-visual > img",
            selectorWrapper: ".hero-visual",
            imageBorderRadius: getComputedStyle(image).borderRadius,
            imageDisplay: getComputedStyle(image).display,
            imageWidth: Math.round(imageRect.width),
            imageHeight: Math.round(imageRect.height),
            wrapperBorderRadius: getComputedStyle(wrapper).borderRadius,
            wrapperOverflow: getComputedStyle(wrapper).overflow,
            wrapperWidth: Math.round(wrapperRect.width),
            wrapperHeight: Math.round(wrapperRect.height),
            horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
            imageAspectRatio: Number((imageRect.width / imageRect.height).toFixed(3))
          };
        })()`,
      });
      const data = evalResult.result.value;
      results.push(data);

      const clipEval = await page.send("Runtime.evaluate", {
        returnByValue: true,
        expression: `(() => {
          const rect = document.querySelector(".hero-visual").getBoundingClientRect();
          const pad = 18;
          return {
            x: Math.max(0, Math.floor(rect.left + window.scrollX - pad)),
            y: Math.max(0, Math.floor(rect.top + window.scrollY - pad)),
            width: Math.min(window.innerWidth, Math.ceil(rect.width + pad * 2)),
            height: Math.min(window.innerHeight, Math.ceil(rect.height + pad * 2)),
            scale: 1
          };
        })()`,
      });
      const screenshot = await page.send("Page.captureScreenshot", {
        format: "png",
        fromSurface: true,
        clip: clipEval.result.value,
      });
      writeFileSync(resolve(outDir, `${label}.png`), Buffer.from(screenshot.data, "base64"));
    }

    writeFileSync(resolve(outDir, "qa-hero-radius-results.json"), JSON.stringify(results, null, 2));
    console.log(JSON.stringify(results, null, 2));
  } finally {
    page.close();
    chrome.kill();
  }
}

try {
  await run();
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
