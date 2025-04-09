import express from 'express';
import cors from 'cors';
import { WebSocketServer, WebSocket } from 'ws';
import { SerialPort } from 'serialport';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import deviceRouter from './routes/deviceRoute.js';
import * as deviceController from './controller/deviceController.js';

// Get __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// App setup
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Endpoint check
app.get('/', (req, res) => {
  res.send('API Working');
});

// =====================
// Shared ESP32 state
// =====================
const espState = {
  serial: null,
  connected: false,
};

// Pass shared state to controller
deviceController.setESPConnection(espState);

// API Routes
app.use('/api/device', deviceRouter);

// Start server
const server = app.listen(port, () => {
  console.log(`🟢 Mock server running at http://localhost:${port}`);
});

// WebSocket setup
const wss = new WebSocketServer({ server });

// Mock initial data
let currentState = {
  HEARTBEAT: 1,
  TEMP_USER: 22.5,
  TEMP_MACHINE: 23.2,
  BLUE_INTENSITY: 40,
  RED_INTENSITY: 90,
  FAN_USER: 1,
  FAN_MACHINE: 1,
  SESSION_TIME: 15,
  TOTAL_SESSIONS: 42,
  TOTAL_HOURS: 32.5,
  POWER_USAGE: 28.9,
  WEEKLY_SESSIONS: 5,
  WEEKLY_POWER: 11.3,
  HARDWARE_STATUS: "Not Detected"
};

// ==========================
// Serial Port Setup for ESP32
// ==========================
try {
  espState.serial = new SerialPort({ path: '/dev/ttyUSB0', baudRate: 9600 });

  espState.serial.on('open', () => {
    console.log('🔌 Connected to ESP32');
    espState.connected = true;
    currentState.HARDWARE_STATUS = "Detected";
  });

  espState.serial.on('data', (data) => {
    const raw = data.toString().trim();
    if (!raw) return;

    // ✅ Log everything coming from ESP32
    console.log("📬 From ESP32:", raw);

    const lines = raw.split('\n');
    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed.includes('=')) return;

      const [key, value] = trimmed.split('=');
      if (key && value !== undefined) {
        currentState[key] = isNaN(value) ? value : parseFloat(value);
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(`${key}=${value}`);
          }
        });
      }
    });
  });

  espState.serial.on('close', () => {
    console.warn('❌ ESP32 connection closed');
    espState.connected = false;
    currentState.HARDWARE_STATUS = "Not Detected";
  });

  espState.serial.on('error', (err) => {
    console.error('ESP32 serial error:', err.message);
    espState.connected = false;
    currentState.HARDWARE_STATUS = "Not Detected";
  });

} catch (err) {
  console.warn('⚠️ ESP32 not connected or port not found');
}

// ================================
// Mock TEMP updates if no ESP32
// ================================
setInterval(() => {
  if (!espState.connected) {
    currentState.TEMP_USER = Number((20 + Math.random() * 5).toFixed(2));
    currentState.TEMP_MACHINE = Number((21 + Math.random() * 4).toFixed(2));

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(`TEMP_USER=${currentState.TEMP_USER}`);
        client.send(`TEMP_MACHINE=${currentState.TEMP_MACHINE}`);
      }
    });
  }
}, 1000);

// =====================
// WebSocket Handling
// =====================
wss.on('connection', (ws) => {
  console.log('🖥️ Frontend connected');

  // Send full state on connect
  for (const [key, value] of Object.entries(currentState)) {
    ws.send(`${key}=${value}`);
  }

  ws.on('message', (msg) => {
    const message = msg.toString();
    console.log(`📩 Frontend → Server: ${message}`);

    if (espState.connected && espState.serial?.writable) {
      espState.serial.write(message + '\n');
    } else {
      const [key, value] = message.split('=');
      if (key && value !== undefined && Object.prototype.hasOwnProperty.call(currentState, key)) {
        currentState[key] = isNaN(value) ? value : parseFloat(value);
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(`${key}=${value}`);
          }
        });
      }
    }
  });

  ws.on('close', () => console.log('🔌 Frontend disconnected'));
  ws.on('error', (err) => console.error('WebSocket error:', err));
});

// Error handler
server.on('error', (error) => {
  console.error('❗ Server error:', error);
});
