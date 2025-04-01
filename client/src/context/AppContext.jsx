// AppContextProvider.js
import { createContext, useState } from "react";

export const AppContext = createContext();

const AppContextProvider = (props) => {

  // dark them logic
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem("darkMode");
    return savedTheme ? JSON.parse(savedTheme) : false;
  });
  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newValue = !prev;
      localStorage.setItem("darkMode", JSON.stringify(newValue));
      return newValue;
    });
  };

  // stats data
  const [totalSession,setTotalSession] = useState(0);
  const [totalRunningHours,setTotalRunnningHours] = useState(0);
  const [powerUsage, setPowerUsage] = useState(0);

  // Home 
  const [blueLight, setBlueLight] = useState(0);
  const [redLight, setRedLight] = useState(0);
  const [userTemp, setUserTemp] = useState(25);
  const [machineTemp, setMachineTemp] = useState(24);
  const [maxUserTemp, setMaxUserTemp] = useState(50);
  const [maxMachineTemp, setMaxMachineTemp] = useState(50);

  

  const value = {
    isDarkMode,
    toggleDarkMode,
    totalSession,setTotalSession,
    totalRunningHours,setTotalRunnningHours,
    powerUsage,setPowerUsage,
    blueLight, setBlueLight,
    redLight, setRedLight,
    userTemp, setUserTemp,
    machineTemp, setMachineTemp,
    maxUserTemp, setMaxUserTemp,
    maxMachineTemp, setMaxMachineTemp,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;