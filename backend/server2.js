import express from 'express';
import cors from 'cors';
import { WebSocketServer, WebSocket } from 'ws';
import { SerialPort } from 'serialport';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import deviceRouter from './routes/deviceRoute.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API Working');
});

app.use('/api/device', deviceRouter);

const server = app.listen(port, () => {
  console.log(`🟢 Mock server running at http://localhost:${port}`);
});

const wss = new WebSocketServer({ server });

// In-memory mock state
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

// ===== SerialPort Setup (ESP32 UART) =====
let esp32Connected = false;
let espSerial;

try {
  espSerial = new SerialPort({ path: '/dev/ttyUSB0', baudRate: 9600 }); // Adjust port if needed

  espSerial.on('open', () => {
    console.log('🔌 Connected to ESP32');
    esp32Connected = true;
    currentState.HARDWARE_STATUS = "Detected";
  });

  espSerial.on('data', (data) => {
    const lines = data.toString().split('\n');
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

  espSerial.on('close', () => {
    console.warn('❌ ESP32 connection closed');
    esp32Connected = false;
    currentState.HARDWARE_STATUS = "Not Detected";
  });

  espSerial.on('error', (err) => {
    console.error('ESP32 serial error:', err.message);
    esp32Connected = false;
    currentState.HARDWARE_STATUS = "Not Detected";
  });

} catch (err) {
  console.warn('⚠️ ESP32 not connected or port not found');
}

// ===== Mock TEMP_USER + TEMP_MACHINE update if ESP32 not connected =====
setInterval(() => {
  if (!esp32Connected) {
    currentState.TEMP_USER = Number((20 + Math.random() * 5).toFixed(2));
    currentState.TEMP_MACHINE = Number((21 + Math.random() * 4).toFixed(2));

    const tempUserMsg = `TEMP_USER=${currentState.TEMP_USER}`;
    const tempMachineMsg = `TEMP_MACHINE=${currentState.TEMP_MACHINE}`;

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(tempUserMsg);
        client.send(tempMachineMsg);
      }
    });
  }
}, 1000);

// ===== WebSocket Communication =====
wss.on('connection', (ws) => {
  console.log('🖥️ Frontend connected');

  for (const [key, value] of Object.entries(currentState)) {
    ws.send(`${key}=${value}`);
  }

  ws.on('message', (msg) => {
    const message = msg.toString();
    console.log(`📩 Frontend → Server: ${message}`);

    // Forward to ESP32 if connected
    if (esp32Connected && espSerial?.writable) {
      espSerial.write(message + '\n');
    } else {
      // Fallback: Update mock state
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
