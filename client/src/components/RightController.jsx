import React, { useState, useEffect, useContext } from "react";
import { FaPlay, FaPause, FaFan, FaStop } from "react-icons/fa6";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { AppContext } from "../context/AppContext";

function RightController() {
  const {isDarkMode} = useContext(AppContext);

  
  const [sessionTime, setSessionTime] = useState(15); // In minutes
  const [timeLeft, setTimeLeft] = useState(sessionTime * 60); // Convert to seconds
  const [isRunning, setIsRunning] = useState(false);
  const [userFanSpeed, setUserFanSpeed] = useState(50);
  const [machineFanSpeed, setMachineFanSpeed] = useState(50);

  // Timer Effect
  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      console.log("Session Ended"); // Replace with an API call
      setIsRunning(false);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  // Update time when sessionTime changes
  useEffect(() => {
    // if (!isRunning) 
      setTimeLeft(sessionTime * 60);
  }, [sessionTime]);

  // Change Session Time
  const handleIncreaseTimeChange = (change) => {
    setSessionTime((prev) => Math.max(1, prev + change)); // Prevent negative time
    console.log(sessionTime,"increase time ")
  };
  // Change Session Time
  const handleDecreaseTimeChange = (change) => {
    setSessionTime((prev) => Math.max(1, prev + change)); // Prevent negative time
    console.log(sessionTime,"decrease time ")
  };

 // Start or Resume Session
 const handleStartResume = () => {
  if (!isRunning) {
    if (timeLeft === sessionTime * 60) {
      console.log("Session Started"); // Simulate API call for start
    } else {
      console.log("Session Resumed"); // Simulate API call for resume
    }
    setIsRunning(true);
  }
};

// Pause Session
const handlePause = () => {
  if (isRunning) {
    console.log("Session Paused"); // Simulate API call
    setIsRunning(false);
  }
};

// Stop Session
const handleStop = () => {
  console.log("Session Stopped"); // Simulate API call
  setIsRunning(false);
  setTimeLeft(sessionTime * 60); // Reset to initial session time
  // Optionally reset other states if needed
  // setUserFanSpeed(50);
  // setMachineFanSpeed(50);
};

  // Determine if the session is in initial state (for "Start" vs "Resume")
  const isInitialState = timeLeft === sessionTime * 60;


  // User fan logic
  const handleUserfan = (e) => {
    setUserFanSpeed(e.target.value);
    console.log("User fan speed : ",userFanSpeed);
    
  }

  const handleMachinefan = (e) => {
    setMachineFanSpeed(e.target.value);
    console.log("handle machine speed :",machineFanSpeed);
    
  }
  
  return (
    <div className="text-white flex flex-col items-center w-full h-full">
      {/* Timer UI */}
      <p className={` ${isDarkMode ? "text-white" : "text-black"} font-semibold text-lg`}>Session Time</p>
      <div className="relative flex flex-col items-center">
        <svg width="180" height="180" viewBox="0 0 120 120">
          {/* Background Circle */}
          <circle cx="60" cy="60" r="50" fill="transparent" stroke="gray" strokeWidth="10" />
          {/* Progress Circle */}
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="transparent"
            stroke="purple"
            strokeWidth="7"
            strokeDasharray="314"
            strokeDashoffset={314 - (timeLeft / (sessionTime * 60)) * 314}
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
          />
        </svg>
        {/* Centered Timer Text */}
        <span className={` ${isDarkMode ? "text-white" : "text-black"} absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold`}>
          {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
        </span>
      </div>

      {/* Increase/Decrease Session Time */}
      <div className="flex gap-4 mt-3">
        <button onClick={() => handleDecreaseTimeChange(-1)} className={`px-3 text-xl font-bold ${isDarkMode ? "text-white" : "text-black"}`}>
          <FaMinus />
        </button>
        <button onClick={() => handleIncreaseTimeChange(1)} className={`px-3 text-xl font-bold ${isDarkMode ? "text-white" : "text-black"}`}>
          <FaPlus />
        </button>
      </div>

      {/* Start/Pause/Stop Buttons */}
     {/* Start/Resume/Pause/Stop Buttons */}
     <div className="mt-4 flex gap-3">
        {isRunning ? (
          <>
            {/* Pause Button */}
            <button
              onClick={handlePause}
              className="px-6 py-2 rounded-full flex items-center gap-2 bg-yellow-500"
            >
              <FaPause />
              Pause
            </button>
            {/* Stop Button */}
            <button
              onClick={handleStop}
              className="px-6 py-2 rounded-full flex items-center gap-2 bg-red-500"
            >
              <FaStop />
              Stop
            </button>
          </>
        ) : (
          <>
            {/* Start or Resume Button */}
            <button
              onClick={handleStartResume}
              className="px-6 py-2 rounded-full flex items-center gap-2 bg-green-500"
            >
              <FaPlay />
              {isInitialState ? "Start" : "Resume"}
            </button>
            {/* Show Stop button only if not in initial state */}
            {!isInitialState && (
              <button
                onClick={handleStop}
                className="px-6 py-2 rounded-full flex items-center gap-2 bg-red-500"
              >
                <FaStop />
                Stop
              </button>
            )}
          </>
        )}
      </div>

      {/* Fan Sliders */}
      <div className="w-[80%] mt-6 space-y-4">
        {/* User Fan */}
        <div>
          <p className="text-center">User Fan</p>
          <div className="flex items-center gap-3">
            <FaFan className="text-blue-400" />
            <input
              type="range"
              min="0"
              max="100"
              value={userFanSpeed}
              onChange={(e) => handleUserfan(e)}
              style={{
                background: `linear-gradient(to right, blue ${userFanSpeed}%, #ddd ${userFanSpeed}%)`,
              }}
              className="w-full appearance-none h-2 rounded-lg transition-all 
                         [&::-webkit-slider-runnable-track]:rounded-lg 
                         [&::-webkit-slider-thumb]:appearance-none 
                         [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
                         [&::-webkit-slider-thumb]:bg-blue-400 [&::-webkit-slider-thumb]:rounded-full 
                         [&::-webkit-slider-thumb]:cursor-pointer 
                         [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 
                         [&::-moz-range-thumb]:bg-blue-400 [&::-moz-range-thumb]:rounded-full 
                         [&::-moz-range-thumb]:cursor-pointer"
            />
          </div>
        </div>

        {/* Machine Fan */}
        <div>
          <p className="text-center">Machine Fan</p>
          <div className="flex items-center gap-3">
            <FaFan className="text-yellow-400" />
            <input
              type="range"
              min="0"
              max="100"
              value={machineFanSpeed}
              onChange={(e) => handleMachinefan(e)}
              style={{
                background: `linear-gradient(to right, yellow ${machineFanSpeed}%, #ddd ${machineFanSpeed}%)`,
              }}
              className="w-full appearance-none h-2 rounded-lg transition-all 
                         [&::-webkit-slider-runnable-track]:rounded-lg 
                         [&::-webkit-slider-thumb]:appearance-none 
                         [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
                         [&::-webkit-slider-thumb]:bg-yellow-500 [&::-webkit-slider-thumb]:rounded-full 
                         [&::-webkit-slider-thumb]:cursor-pointer 
                         [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 
                         [&::-moz-range-thumb]:bg-yellow-500 [&::-moz-range-thumb]:rounded-full 
                         [&::-moz-range-thumb]:cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default RightController;