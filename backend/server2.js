// server2.js

const express = require('express');
const WebSocket = require('ws');
const path = require('path');

// Create Express App
const app = express();
const port = 3000;

// Serve static files from "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Create HTTP server
const server = app.listen(port, () => {
  console.log(`Mock server running at http://localhost:${port}`);
});

// WebSocket Server
const wss = new WebSocket.Server({ server });

let currentState = {
  HEARTBEAT: 1,
  TEMP_USER: 22.5,
  TEMP_MACHINE: 23.2,
  BLUE_INTENSITY: 60,
  RED_INTENSITY: 80,
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

// Broadcast dummy data every 1 second
setInterval(() => {
  // Update some fields randomly
  currentState.TEMP_USER = (20 + Math.random() * 5).toFixed(2);
  currentState.TEMP_MACHINE = (21 + Math.random() * 4).toFixed(2);
  currentState.POWER_USAGE = (25 + Math.random() * 5).toFixed(2);
  currentState.HEARTBEAT = 1;

  // Broadcast to all connected clients
  for (const [key, value] of Object.entries(currentState)) {
    const message = `${key}=${value}`;
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
}, 1000);

// Handle frontend connections and messages
wss.on('connection', (ws) => {
  console.log('Frontend connected (mock mode)');

  // Send initial state on connection
  for (const [key, value] of Object.entries(currentState)) {
    ws.send(`${key}=${value}`);
  }

  // Handle messages from frontend
  ws.on('message', (msg) => {
    console.log(`Frontend sent: ${msg}`);

    const [key, value] = msg.toString().split('=');
    if (key && value !== undefined) {
      currentState[key] = isNaN(value) ? value : parseFloat(value);

      // Echo the updated value back to all clients
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
});
