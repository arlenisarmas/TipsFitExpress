import { mkdirSync, writeFileSync } from "node:fs";
import { get } from "node:http";
import { spawn } from "node:child_process";
import { resolve } from "node:path";

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const port = 5500;
const cdpPort = 9335;
const root = resolve(".");
const sizes = [
  [360, 640, "mobile-360x640"],
  [390, 844, "mobile-390x844"],
  [412, 915, "mobile-412x915"],
  [430, 932, "mobile-430x932"],
  [768, 1024, "tablet-768x1024"],
  [1366, 768, "desktop-1366x768"],
  [1920, 1080, "desktop-1920x1080"],
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
      response.on("end", () => resolveJson(JSON.parse(data)));
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
      message.error ? rejectCommand(new Error(message.error.message)) : resolveCommand(message.result);
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
      await getJson(`http://127.0.0.1:${cdpPort}/json/version`);
      return;
    } catch {
      await wait(250);
    }
  }
  throw new Error("Chrome CDP did not start");
}

const server = spawn(process.execPath, ["scripts/dev-server.mjs"], { cwd: root, stdio: "ignore" });
await waitForServer();

const chrome = spawn(chromePath, [
  "--disable-gpu",
  "--hide-scrollbars",
  `--remote-debugging-port=${cdpPort}`,
  `--user-data-dir=${resolve(root, ".tmp-qa-chrome-lists")}`,
  `http://localhost:${port}`,
], { stdio: "ignore" });

await waitForCdp();
const targets = await getJson(`http://127.0.0.1:${cdpPort}/json/list`);
const pageTarget = targets.find((target) => target.type === "page");
const client = await createCdpClient(pageTarget.webSocketDebuggerUrl);
await client.send("Page.enable");
await client.send("Runtime.enable");
mkdirSync("docs", { recursive: true });

const results = [];

for (const [width, height, label] of sizes) {
  await client.send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: label.startsWith("mobile"),
  });
  await client.send("Page.navigate", { url: `http://localhost:${port}/` });
  await wait(900);

  const evaluation = await client.send("Runtime.evaluate", {
    returnByValue: true,
    expression: `(() => {
      const lists = [...document.querySelectorAll("main ul")];
      const nakedLists = lists.filter((list) => !list.classList.contains("check-list")).length;
      const items = [...document.querySelectorAll(".check-list > li")].map((item) => {
        const before = getComputedStyle(item, "::before");
        const style = getComputedStyle(item);
        return {
          text: item.textContent.trim(),
          display: style.display,
          columns: style.gridTemplateColumns,
          marker: before.content,
          markerBg: before.backgroundColor,
          markerColor: before.color,
          listStyle: style.listStyleType
        };
      });
      return {
        width: window.innerWidth,
        height: window.innerHeight,
        checkListCount: document.querySelectorAll(".check-list").length,
        checkItemCount: items.length,
        nakedLists,
        horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
        allItemsGrid: items.every((item) => item.display === "grid"),
        allMarkersChecks: items.every((item) => item.marker.includes("✓")),
        allListStyleNone: items.every((item) => item.listStyle === "none"),
        sampleItems: items.slice(0, 6)
      };
    })()`,
  });
  results.push({ label, ...evaluation.result.value });

  await client.send("Runtime.evaluate", {
    expression: label.startsWith("mobile")
      ? "document.querySelector('.bonus-checks').scrollIntoView({ block: 'center' })"
      : "document.querySelector('.hero').scrollIntoView({ block: 'start' })",
  });
  await wait(350);
  const screenshot = await client.send("Page.captureScreenshot", { format: "png", fromSurface: true });
  writeFileSync(`docs/qa-check-list-${label}-${width}x${height}.png`, Buffer.from(screenshot.data, "base64"));
}

client.close();
chrome.kill();
server.kill();

writeFileSync("docs/qa-check-list-results.json", `${JSON.stringify(results, null, 2)}\n`);
console.log(JSON.stringify(results, null, 2));
