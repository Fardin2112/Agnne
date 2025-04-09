let espSerial;          // Will be passed from server
let esp32Connected;     // Flag also passed from server

const sendToESP = (cmd) => {
  console.log("🛰️ Command:", cmd);
  if (esp32Connected && espSerial?.writable) {
    espSerial.write(cmd + '\n');
  } else {
    console.warn("⚠️ ESP32 not connected. (Mock mode)");
  }
};

// Controller functions
export const setSessionTime = (req, res) => {
  const { time } = req.body;
  if (!time) return res.status(400).send("Missing session time");
  sendToESP(`SESSION_TIME=${time}`);
  res.send("Session time set");
};

export const startSession = (req, res) => {
  sendToESP("SESSION_TIME=900");
  res.send("Session started");
};

export const startSanitation = (req, res) => {
  sendToESP("SANITATION");
  res.send("Sanitation started");
};

export const setUserFan = (req, res) => {
  const { value } = req.body;
  if (value === undefined) return res.status(400).send("Missing fan value");
  sendToESP(`FAN_USER=${value}`);
  res.send("User fan updated");
};

export const setMachineFan = (req, res) => {
  const { value } = req.body;
  if (value === undefined) return res.status(400).send("Missing fan value");
  sendToESP(`FAN_MACHINE=${value}`);
  res.send("Machine fan updated");
};

export const exportLightHistory = (req, res) => {
  sendToESP("EXPORT_LIGHT_HISTORY");
  res.send("Exporting light history...");
};

export const resetStats = (req, res) => {
  sendToESP("RESET_STATS");
  res.send("Stats reset");
};

// 👇 Method to set shared serial instance from server2.js
export const setESPConnection = (serial, connectedFlag) => {
  espSerial = serial;
  esp32Connected = connectedFlag;
};
