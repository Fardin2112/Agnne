import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { FaPlay, FaPause, FaStop, FaMinus, FaPlus } from "react-icons/fa6";
import { UserContext } from "../context/UserContext";

function RightController() {
  const { isDarkMode, isRunning, setIsRunning } = useContext(UserContext);

  const [sessionTime, setSessionTime] = useState(15);
  const [timeLeft, setTimeLeft] = useState(sessionTime * 60);

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

  // Dynamic stroke color for timer based on timeLeft
  const getTimerStrokeColor = () => {
    const percentage = (timeLeft / (sessionTime * 60)) * 100;
    if (percentage > 50) return "#00C2FF"; // ocen for >50%
    if (percentage > 20) return "#f59e0b"; // Yellow for 20-50%
    return "#ef4444"; // Red for <20%
  };

  // ========== UI ==========
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      {/* Timer Section */}
      <div className="bg-white w-[90%] h-[450px] flex flex-col items-center shadow-md rounded-lg p-6">
        <p className={`font-semibold text-lg ${isDarkMode ? "text-white" : "text-gray-700"}`}>
          Session Time
        </p>

        {/* Timer Circle */}
        <div className="relative flex flex-col items-center mt-6">
          <svg width="180" height="180" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="transparent"
              stroke="#e5e7eb" // Static gray background
              strokeWidth="7"
            />
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="transparent"
              stroke={getTimerStrokeColor()} // Dynamic stroke color
              strokeWidth="3"
              strokeDasharray="314"
              strokeDashoffset={314 - (timeLeft / (sessionTime * 60)) * 314}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
            />
          </svg>
          <span
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold rounded-full${
              isDarkMode ? "text-white" : "text-gray-700"
            }`}
          >
            {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
          </span>
        </div>

        {/* Time Controls */}
        <div className="flex justify-between mt-[-8px] w-[190px]">
          <button
            onClick={handleDecreaseTimeChange}
            className={`p-2 rounded-full border-1 border-[#00C2FF] shadow-md text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-700"}`}
          >
            <FaMinus className="text-2xl text-[#00C2FF]" />
          </button>
          <button
            onClick={handleIncreaseTimeChange}
            className={`p-2 rounded-full border-1 border-[#00C2FF] shadow-md text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-700"}`}
          >
            <FaPlus className="text-2xl text-[#00C2FF]" />
          </button>
        </div>

        {/* Control Buttons */}
        <div className="mt-6 flex gap-3 font-semibold">
          {isRunning ? (
            <div className="flex items-center w-[100px] justify-evenly px-2 py-2 border-1 text-[#00C2FF] border-[#00C2FF] shadow-md text-xl font-bold rounded-4xl">
              <button
                onClick={handlePause}
                className=""
              >
                <FaPause />
                
              </button>
              <button
                onClick={handleStop}
                className=""
              >
                <FaStop />
                
              </button>
            </div>
          ) : (
            <>
              {isInitialState ? (
                <button
                  onClick={handleStart}
                  className="p-2 rounded-full border-1 text-[#00C2FF] border-[#00C2FF] shadow-md text-xl font-bold"
                >
                  <FaPlay />
                  
                </button>
              ) : (
                <div className="flex items-center w-[100px] justify-evenly px-2 py-2 border-1 text-[#00C2FF] border-[#00C2FF] shadow-md text-xl font-bold rounded-4xl">
                
                  <button
                    onClick={handleResume}
                    className=""
                  >
                    <FaPlay />
                    
                  </button>
                  <button
                    onClick={handleStop}
                    className=""
                  >
                    <FaStop />
                   
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default RightController;