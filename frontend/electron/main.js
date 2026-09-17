import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let mainWindow;
let backendProcess;

function startBackend() {
  console.log('🚀 Starting backend server...');
  // Goes up from frontend/electron to frontend, then to backend
  const backendPath = path.join(__dirname, '../../backend/server.js');
  
  backendProcess = spawn('node', [backendPath], {
    stdio: 'inherit',
    env: { ...process.env, PORT: '5000', NODE_ENV: 'development' }
  });

  backendProcess.on('error', (err) => console.error('❌ Backend failed to start:', err));
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    title: 'Travel Booking Management System',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const viteDevServerUrl = process.env.VITE_DEV_SERVER_URL;
  
  if (viteDevServerUrl) {
    mainWindow.loadURL(viteDevServerUrl);
    // mainWindow.webContents.openDevTools(); // Uncomment to open DevTools
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  startBackend();
  // Wait 2 seconds for backend to initialize before loading frontend
  setTimeout(createWindow, 2000); 

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  console.log('🛑 Closing app and backend...');
  if (backendProcess) backendProcess.kill();
  if (process.platform !== 'darwin') app.quit();
});