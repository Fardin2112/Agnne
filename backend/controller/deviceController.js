let espState = null;

const sendToESP = (cmd) => {
  console.log("🛰️ Command:", cmd);
  if (espState?.connected && espState?.serial?.writable) {
    espState.serial.write(cmd + "\n");
  } else {
    console.warn("⚠️ ESP32 not connected. (Mock mode)");
  }
};

// unknow for now
export const setSessionTime = (req, res) => {
  const { time } = req.body;
  if (!time) return res.status(400).send("Missing session time");
  sendToESP(`SESSION_TIME=${time}`);
  res.send("Session time set");
};

// start session logic
export const startSession = (req, res) => {
  const { sessionTime } = req.body;
  sendToESP(`SESSION_TIME=${sessionTime}`);
  res.send("Session started");
};

// stop session logic
export const stopSession = (req, res) => {
  sendToESP("SESSION_STOP");
  res.send("Session stopped");
};


// logic to pause session time
export const pauseSessionTime = (req, res) => {
  try {
    sendToESP("SESSION_PAUSE");
    res.json({ success: true, message: "session pause" });
  } catch (error) {
    console.log("Error in pause from server");
    res.json({ success: false, message: "Error in pause from server" });
  }
};

// logic to resume session time
export const resumeSessionTime = (req, res) => {
  try {
    sendToESP("SESSION_RESUME");
    res.json({ success: true, message: "session resume" });
  } catch (error) {
    console.log("Error in resume from server");
    res.json({ success: false, message: "Error in resume from server" });
  }
};


// set user fan logic
export const setUserFan = (req, res) => {
  const { value } = req.body;
  if (value === undefined) return res.status(400).send("Missing fan value");
  sendToESP(`FAN_USER=${value}`);
  res.send("User fan updated");
};

// set fan user logic
export const setMachineFan = (req, res) => {
  const { value } = req.body;
  if (value === undefined) return res.status(400).send("Missing fan value");
  sendToESP(`FAN_MACHINE=${value}`);
  return res.send("Machine fan updated");
};

// max user temp set logic
export const setMaxUserTemp = (req, res) => {
  const { value } = req.body;
  try {
  if (value === undefined)
    return res.status(400).send("Missing max user temp value");
  sendToESP(`SET_TEMP_USER=${value}`);
  return res.send(`User max temp set = ${value}`);
  } catch (error) {
    console.log("Error in setMaxUserTemp");
    return res.json({success:false, message :"Error in setMaxUserTemp"})
  }
};

// max machine temp set logic
export const setMaxMachineTemp = (req, res) => {
  try {
    const { value } = req.body;
    if (value === undefined)
      return res.status(400).send("Missing max Machine temp value");
    sendToESP(`SET_TEMP_MACHINE=${value}`);
    return res.send(`Machine max temp set = ${value}`);
  } catch (error) {
    console.log("Error in setMaxMachinetemp from server")
    return res.json({success:false, message:"Error in setMaxMachinetemp from server"})
  }
};

// start sanitation logic
export const startSanitation = (req, res) => {
  const { time } = req.body;

  try {
    if (time === undefined) {
      return res.status(400).json({ success: false, message: "Missing sanitation time" });
    }

    sendToESP(`SANITATION_TIME=${time}`);
    return res.json({ success: true, message: "Sanitation started" });

  } catch (error) {
    console.log("Error in starting sanitation", error.message);
    return res.status(500).json({ success: false, message: "Error in starting sanitation" });
  }
};


// resume sanitation logic
export const resumeSanitation = (req,res) => {
  
  try {
    sendToESP("SANITATION_RESUME");
    return res.json({ success: true, message: "Sanitation resume" });
  } catch (error) {
    console.log("Error in resume sanitation from server");
    return res.json({ success: false, message: "Error in resume sanitation from server" });
  }
}

// Pause sanitation logic
export const pauseSanitation = (req,res) => {
  
  try {
    sendToESP("SANITATION_PAUSE");
    return res.json({ success: true, message: "Sanitation Pause" });
  } catch (error) {
    console.log("Error in Pause sanitation from server");
    return res.json({ success: false, message: "Error in Pause sanitation from server" });
  }
}

export const stopSanitation = (req,res) => {
  
  try {
    sendToESP("SANITATION_STOP");
    return res.json({ success: true, message: "Sanitation Stop" });
  } catch (error) {
    console.log("Error in Stop sanitation from server");
    return res.json({ success: false, message: "Error in Stop sanitation from server" });
  }
}

// export light history logic
export const exportLightHistory = (req, res) => {
  sendToESP("EXPORT_LIGHT_HISTORY");
  res.send("Exporting light history...");
};

// resest all stats logic
export const resetStats = (req, res) => {
  sendToESP("RESET_STATS");
  res.send("Stats reset");
};

// Shared connection setter
export const setESPConnection = (sharedState) => {
  espState = sharedState;
};
