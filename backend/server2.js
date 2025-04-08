import express from 'express';
import cors from 'cors';
import { WebSocketServer, WebSocket } from 'ws'; // ✅ Correct import
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import userRouter from './routes/userRoute.js';

// Resolve __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Express
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.send('API Working');
});

// API endpoint
app.use('/api/user', userRouter);

// Start HTTP server
const server = app.listen(port, () => {
  console.log(`Mock server running at http://localhost:${port}`);
});

// ✅ Initialize WebSocket server
const wss = new WebSocketServer({ server });

// Mock state object
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

// Periodic TEMP_USER and TEMP_MACHINE update every 4s
setInterval(() => {
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
}, 1000);

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('Frontend connected (mock mode)');

  // Send initial state
  for (const [key, value] of Object.entries(currentState)) {
    ws.send(`${key}=${value}`);
  }

  ws.on('message', (msg) => {
    console.log(`Frontend sent: ${msg}`);
    const message = msg.toString();

    if (!message.includes('=')) return;

    const [key, value] = message.split('=');
    if (key && value !== undefined && Object.prototype.hasOwnProperty.call(currentState, key)) {
      currentState[key] = isNaN(value) ? value : parseFloat(value);
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(`${key}=${value}`);
        }
      });
    }
  });

  ws.on('close', () => {
    console.log('Frontend disconnected');
  });

  ws.on('error', (error) => {
    console.log('WebSocket error:', error);
  });
});

// Handle server errors
server.on('error', (error) => {
  console.error('Server error:', error);
});
