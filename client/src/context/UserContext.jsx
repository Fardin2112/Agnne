import { createContext, useEffect, useRef, useState } from "react";

export const UserContext = createContext();

const UserContextProvider = (props) => {
  // 🌙 Theme: Load from localStorage or default to light mode
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("darkMode");
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  // 🌙 Toggle between light and dark mode, and save to localStorage
  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newValue = !prev;
      localStorage.setItem("darkMode", JSON.stringify(newValue));
      return newValue;
    });
  };

  // 📊 UI states for specific ESP32 stats
  
  const [isRunning, setIsRunning] = useState(false); // is session running

  const [blueLight, setBlueLight] = useState(0);                  // Blue light intensity
  const [redLight, setRedLight] = useState(0);                    // Red light intensity

  const [userTemp, setUserTemp] = useState(0);                   // Current user sensor temp
  const [machineTemp, setMachineTemp] = useState(0);             // Current machine sensor temp

  const [maxUserTemp, setMaxUserTemp] = useState(40);             // Target user temp
  const [maxMachineTemp, setMaxMachineTemp] = useState(60);       // Target machine temp

  const [userFanSpeed, setUserFanSpeed] = useState(0);             // user fan value
  const [machineFanSpeed, setMachineFanSpeed] = useState(0);     // machine fan value

  

  const [totalSession, setTotalSession] = useState(0);            // Total completed sessions
  const [totalRunningHours, setTotalRunnningHours] = useState(0); // Total run time in hours
  const [powerUsage, setPowerUsage] = useState(0);                // Total energy usage (Wh)
  const [temp_env, setTemp_env] = useState();
  const [weeklySession, setWeeklySession] = useState(0);
  const [WeeklyPower, setWeeklyPower] = useState(0);
  const [sanitationTime, setSanitationTime] = useState(0);
  const [sanitationStatus, setSanitationStatus] = useState(0);



  const [espData, setEspData] = useState({});                     // Raw ESP32 key=value data
  const [connected, setConnected] = useState(false);              // ESP32 connection status

  // Additional Message (Not periodic stats)
  const [emergencyError, setEmergencyError] = useState();
  const [overheatError, setOverheatError] = useState();
  const [emergencyStop, setEmergencyStop] = useState(false);



  // const modes = ['custom', 'relax', 'intense'];        
  // const [modeIndex, setModeIndex] = useState(0);

  const [usercustomValue, setUsercustomValue] = useState(33);
  const [machinecustomValue, setMachinecustomValue] = useState(44)
  const [userRelaxValue, setUserRelaxValue] = useState(35);                     // modes for max temp
  const [userIntenseValue, setUserIntenseValue] = useState(45)   
  
  const [machineRelaxValue, setMachineRelaxValue] = useState(40);
  const [machineIntenseValue, setMachineIntenseValue] = useState(50);
  

  const wsRef = useRef(null); // 🔌 Store WebSocket reference

  // 🧠 Setup WebSocket connection once on mount
  useEffect(() => {
    let ws;
    let reconnectInterval;

    const connectWebSocket = () => {
    ws  = new WebSocket("ws://localhost:3000");
    wsRef.current = ws;

    // ✅ Called when WebSocket connects successfully
    ws.onopen = () => {
      console.log("✅ WebSocket connected");
      setConnected(true);
      clearTimeout(reconnectInterval);
    };

    // 🔄 Handle incoming data and sync it with state
    ws.onmessage = (event) => {
      const [key, value] = event.data.split("=");
      const parsedValue = isNaN(value) ? value : parseFloat(value);

      // Track connection status
      if (key === "ESP_CONNECTED") {
        setConnected(parsedValue === true || parsedValue === "true");
      } else {
        // Store all raw data
        setEspData(prev => ({
          ...prev,
          [key]: parsedValue,
        }));

        // Update specific fields if present
        switch (key) {
          case "TEMP_USER":
            setUserTemp(parsedValue);
            break;
          case "TEMP_MACHINE":
            setMachineTemp(parsedValue);
            break;
          case "TARGET_USER_TEMP":
            setMaxUserTemp(parsedValue);
            break;
          case "TARGET_MACHINE_TEMP":
            setMaxMachineTemp(parsedValue);
            break;
          case "SET_BLUE_INTENSITY":
            setBlueLight(parsedValue);
            break;
          case "SET_RED_INTENSITY":
            setRedLight(parsedValue);
            break;
          case "TOTAL_SESSIONS":
            setTotalSession(parsedValue);
            break;
          case "TOTAL_HOURS":
            setTotalRunnningHours(parsedValue);
            break;
          case "POWER_USAGE":
            setPowerUsage(parsedValue);
            break;
          case "ERROR=EMERGENCY_STOP":
            setEmergencyStop(true);
            break;
          case "ERROR=OVERHEAT":
            setOverheatError(true);
            console.log("Overheat from frontend")
            break;
          case "FAN_USER" :
            setUserFanSpeed(parsedValue);
            break;
          case "FAN_MACHINE" :
            setMachineFanSpeed(parsedValue);
            break;      
          default:
            break; // Other values are stored in espData
        }
      }
    };

    // ❌ Called when WebSocket disconnects
    ws.onclose = () => {
      console.warn("❌ WebSocket disconnected");
      setConnected(false);
      reconnectInterval = setTimeout(connectWebSocket,5000); // Retry in 5 second
    };

    // ⚠️ Handle unexpected error and close the connection
      ws.onerror = (err) => {
        console.error("WebSocket error:", err.message);
        ws.close(); // This triggers `onclose` and retry
      };
    };  

    connectWebSocket();  // Intitial call

    // 🧹 Clean up WebSocket on component unmount
    return () => {
      if (ws) ws.close();
      clearTimeout(reconnectInterval); // clean up retry timeout
    };

  }, []);

  // 📤 Function to send command to server (and then ESP32)
  const sendWsMessage = (msg) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(msg); // Example: "BLUE_INTENSITY=70"
      console.log("📤 Sent to server:", msg);
    } else {
      console.warn("⚠️ WebSocket not connected, message not sent:", msg);
    }
  };

  // 🌐 Expose global values to app
  const value = {
    isDarkMode,
    toggleDarkMode,

    totalSession, setTotalSession,
    totalRunningHours, setTotalRunnningHours,
    powerUsage, setPowerUsage,

    blueLight, setBlueLight,
    redLight, setRedLight,

    userTemp, setUserTemp,
    machineTemp, setMachineTemp,

    maxUserTemp, setMaxUserTemp,
    maxMachineTemp, setMaxMachineTemp,

    userFanSpeed, setUserFanSpeed,
    machineFanSpeed, setMachineFanSpeed, 

    emergencyStop,setEmergencyStop,   // Errors
    overheatError, setOverheatError,

    isRunning, setIsRunning , // session is runing

    usercustomValue, setUsercustomValue,
    machinecustomValue, setMachinecustomValue,
    userRelaxValue, setUserRelaxValue,                // for mode changes in user max temp
    userIntenseValue, setUserIntenseValue,  

    machineRelaxValue, setMachineRelaxValue,
    machineIntenseValue, setMachineIntenseValue,

    espData,
    connected,
    sendWsMessage, // 👈 Send commands from any component
  };

  return (
    <UserContext.Provider value={value}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
  