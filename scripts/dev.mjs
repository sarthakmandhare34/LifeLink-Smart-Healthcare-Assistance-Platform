import { exec, spawn } from "node:child_process";
import os from "node:os";
import process from "node:process";

const PORT = Number(process.env.PORT || 3000);
const URL = process.env.LOCAL_DEV_URL || `http://localhost:${PORT}`;
const command = "cross-env NODE_ENV=development tsx watch backend/_core/index.ts";

let child;
let restarting = false;

export function helpText() {
  return [
    "\nLifeLink development shortcuts",
    "  o + Enter  Open the local app in your browser",
    "  h + Enter  Show this help",
    "  r + Enter  Restart the development server",
    "  u + Enter  Show local and network URLs",
    "  c + Enter  Clear the terminal screen",
    "  q + Enter  Stop the development server",
    "  Ctrl+C     Stop the development server",
    "",
  ].join("\n");
}

export function openBrowser(url = URL) {
  if (process.platform === "win32") {
    exec(`start "" ${JSON.stringify(url)}`);
    return;
  }
  const opener = process.platform === "darwin" ? "open" : "xdg-open";
  exec(`${opener} ${JSON.stringify(url)}`);
}

export function urlText(port = PORT) {
  const addresses = Object.values(os.networkInterfaces())
    .flatMap((interfaces) => interfaces ?? [])
    .filter((network) => network.family === "IPv4" && !network.internal)
    .map((network) => `  Network: http://${network.address}:${port}`);
  return [`  Local:   http://localhost:${port}`, ...addresses].join("\\n");
}

function startServer() {
  child = spawn(command, {
    cwd: process.cwd(),
    env: process.env,
    shell: true,
    stdio: "inherit",
  });

  child.once("exit", (code, signal) => {
    if (!restarting && code !== 0 && signal !== "SIGTERM") {
      console.error(`\nLifeLink development server exited with code ${code ?? "unknown"}.`);
    }
  });
}

function stopServer() {
  if (!child || child.killed) return;
  if (process.platform === "win32") {
    exec(`taskkill /pid ${child.pid} /T /F`);
  } else {
    child.kill("SIGTERM");
  }
}

function restartServer() {
  if (restarting) return;
  restarting = true;

  if (!child || child.killed) {
    restarting = false;
    startServer();
    return;
  }

  const previousChild = child;
  const startReplacement = () => {
    if (child !== previousChild && !restarting) return;
    restarting = false;
    startServer();
  };

  if (process.platform === "win32") {
    exec(`taskkill /pid ${previousChild.pid} /T /F`, () => {
      setTimeout(startReplacement, 250);
    });
  } else {
    previousChild.once("exit", () => setTimeout(startReplacement, 250));
    previousChild.kill("SIGTERM");
  }
}

function handleShortcut(key) {
  switch (key.trim().toLowerCase()) {
    case "o":
      openBrowser();
      break;
    case "h":
      console.log(helpText());
      break;
    case "u":
      console.log(`\\n${urlText()}\\n`);
      break;
    case "c":
      console.clear();
      console.log(helpText());
      break;
    case "r":
      console.log("\nRestarting the LifeLink development server...\n");
      restartServer();
      break;
    case "q":
      stopServer();
      process.exit(0);
      break;
    default:
      if (key.trim()) console.log("Unknown shortcut. Press h + Enter for help.");
  }
}

if (process.stdin.isTTY) {
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (input) => handleShortcut(input));
}

console.log(helpText());
startServer();

process.once("SIGINT", () => {
  stopServer();
  process.exit(0);
});
