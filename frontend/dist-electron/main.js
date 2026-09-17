import { app, BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
const __dirname$1 = path.dirname(fileURLToPath(import.meta.url));
let mainWindow;
let backendProcess;
function startBackend() {
  console.log("Starting backend server...");
  const backendServerPath = path.join(__dirname$1, "../../backend/server.js");
  console.log("Backend path:", backendServerPath);
  backendProcess = spawn("node", [backendServerPath], {
    stdio: "inherit",
    env: {
      ...process.env,
      PORT: "5000",
      NODE_ENV: "development"
    }
  });
  backendProcess.on("error", (err) => {
    console.error("Failed to start backend:", err);
  });
  backendProcess.on("close", (code) => {
    console.log(`Backend process exited with code ${code}`);
  });
}
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    title: "Travel Booking Management System",
    webPreferences: {
      preload: path.join(__dirname$1, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true
    }
  });
  const viteDevServerUrl = process.env.VITE_DEV_SERVER_URL;
  if (viteDevServerUrl) {
    mainWindow.loadURL(viteDevServerUrl);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname$1, "../dist/index.html"));
  }
}
app.whenReady().then(() => {
  setTimeout(() => {
    startBackend();
    createWindow();
  }, 1e3);
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
app.on("window-all-closed", () => {
  console.log("Closing app...");
  if (backendProcess) {
    backendProcess.kill();
  }
  if (process.platform !== "darwin") {
    app.quit();
  }
});
app.on("quit", () => {
  if (backendProcess) {
    backendProcess.kill();
  }
});
