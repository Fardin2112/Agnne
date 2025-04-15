import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { FaPlay, FaPause, FaFan, FaStop, FaMinus, FaPlus } from "react-icons/fa6";
import { AppContext } from "../context/AppContext";

function RightController() {
  const { isDarkMode, userFanSpeed,machineFanSpeed, setUserFanSpeed, setMachineFanSpeed } = useContext(AppContext);

  const [sessionTime, setSessionTime] = useState(15);
  const [timeLeft, setTimeLeft] = useState(sessionTime * 60);
  const [isRunning, setIsRunning] = useState(false);
  
  const timerRef = useRef(null); // 🧠 Stores the timer id

  const isInitialState = timeLeft === sessionTime * 60;

  // 🕒 Function to handle timer countdown
  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev > 0) return prev - 1;
        clearInterval(timerRef.current);
        stopSession();
        setIsRunning(false);
        return 0;
      });
    }, 1000);
  };

  // 🧠 useEffect to clean up interval on unmount or stop
  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (isRunning) {
      startTimer();
    } else {
      clearInterval(timerRef.current);
    }
  }, [isRunning]);

  useEffect(() => {
    setTimeLeft(sessionTime * 60);
  }, [sessionTime]);

  // ========== API Calls ==========
  const sendSessionTime = async () => {
    try {
      await axios.post("http://localhost:3000/api/device/session", {
        time: sessionTime,
      });
      console.log("✅ Session time set", sessionTime);
    } catch (error) {
      console.error("❌ Failed to set session time", error);
    }
  };

  const handleStart = async () => {
    try {
      await sendSessionTime();
      setIsRunning(true);
      await axios.post("http://localhost:3000/api/device/session/start", { sessionTime });
      console.log("✅ Session started");
    } catch (error) {
      console.error("❌ Start session failed", error);
    }
  };

  const stopSession = async () => {
    try {
      await axios.post("http://localhost:3000/api/device/session/stop");
      console.log("⛔ Session stopped");
    } catch (error) {
      console.error("❌ Stop session failed", error);
    }
  };

  const sendFanSpeed = async (type, value) => {
    try {
      await axios.post(`http://localhost:3000/api/device/fan/${type}`, { value });
      console.log(`✅ Fan ${type} updated: ${value}`);
    } catch (error) {
      console.error(`❌ Fan ${type} update failed`, error);
    }
  };

  // ========== Event Handlers ==========
  const handleResume = async () => {
    try {
      await axios.post("http://localhost:3000/api/device/resume");
      console.log("Session is Resumed");
      setIsRunning(true);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handlePause = async () => {
    try {
      await axios.post("http://localhost:3000/api/device/pause");
      console.log("⏸️ Session paused");
      setIsRunning(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleStop = () => {
    stopSession();
    setIsRunning(false);
    setTimeLeft(sessionTime * 60);
    clearInterval(timerRef.current);
  };

  const handleIncreaseTimeChange = () => setSessionTime((prev) => Math.min(60, prev + 1));
  const handleDecreaseTimeChange = () => setSessionTime((prev) => Math.max(1, prev - 1));

  const handleUserfan = (e) => {
    const value = Number(e.target.value);
    setUserFanSpeed(value);
    sendFanSpeed("user", value);
  };

  const handleMachinefan = (e) => {
    const value = Number(e.target.value);
    setMachineFanSpeed(value);
    sendFanSpeed("machine", value);
  };

  // ========== UI ==========
  return (
    <div className="text-white flex flex-col items-center w-full h-full">
      <p className={`${isDarkMode ? "text-white" : "text-black"} font-semibold text-lg`}>
        Session Time
      </p>

      {/* Timer Circle */}
      <div className="relative flex flex-col items-center">
        <svg width="180" height="180" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="50" fill="transparent" stroke="gray" strokeWidth="10" />
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
        <span className={`${isDarkMode ? "text-white" : "text-black"} absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold`}>
          {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
        </span>
      </div>

      {/* Time Controls */}
      <div className="flex gap-4">
        <button onClick={handleDecreaseTimeChange} className={`px-3 py-1 text-xl font-bold ${isDarkMode ? "text-white" : "text-black"}`}>
          <FaMinus className="text-2xl"/>
        </button>
        <button onClick={handleIncreaseTimeChange} className={`px-3 text-xl font-bold ${isDarkMode ? "text-white" : "text-black"}`}>
          <FaPlus className="text-2xl"/>
        </button>
      </div>

      {/* Control Buttons */}
      <div className="mt-1 flex gap-3 font-semibold">
        {isRunning ? (
          <>
            <button onClick={handlePause} className="px-6 py-2 rounded-full flex items-center gap-2 bg-yellow-500">
              <FaPause />
              Pause
            </button>
            <button onClick={handleStop} className="px-6 py-2 rounded-full flex items-center gap-2 bg-red-500">
              <FaStop />
              Stop
            </button>
          </>
        ) : (
          <>
            {isInitialState ? (
              <button onClick={handleStart} className="px-6 py-2 rounded-full flex items-center gap-2 bg-green-500">
                <FaPlay />
                Start
              </button>
            ) : (
              <>
                <button onClick={handleResume} className="px-6 py-2 rounded-full flex items-center gap-2 bg-green-500">
                  <FaPlay />
                  Resume
                </button>
                <button onClick={handleStop} className="px-6 py-2 rounded-full flex items-center gap-2 bg-red-500">
                  <FaStop />
                  Stop
                </button>
              </>
            )}
          </>
        )}
      </div>

      {/* Fan Sliders */}
      <div className="w-full mt-6 space-y-2">
        {/* User Fan */}
        <div className="w-full">
          <p className="text-center">User Fan</p>
          <div className="flex items-center gap-3 ">
            <FaFan className="text-blue-400 text-2xl" />
            <input
              type="range"
              min="0"
              max="100"
              value={userFanSpeed}
              onChange={handleUserfan}
              style={{ background: `linear-gradient(to right, blue ${userFanSpeed}%, #ddd ${userFanSpeed}%)` }}
              className="w-full appearance-none h-2 rounded-lg transition-all"
            />
             <p className="text-xl pr-1">{userFanSpeed}</p>
          </div>
        </div>

        {/* Machine Fan */}
        <div className="w-full">
          <p className="text-center">Machine Fan</p>
          <div className="flex items-center gap-3">
            <FaFan className="text-yellow-400 text-2xl" />
            <input
              type="range"
              min="0"
              max="100"
              value={machineFanSpeed}
              onChange={handleMachinefan}
              style={{ background: `linear-gradient(to right, yellow ${machineFanSpeed}%, #ddd ${machineFanSpeed}%)` }}
              className="w-full appearance-none h-2 rounded-lg transition-all"
            />
            <p className="text-xl pr-1">{machineFanSpeed}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RightController;
