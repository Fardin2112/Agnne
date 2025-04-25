import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { FaPlay, FaPause, FaStop, FaMinus, FaPlus } from "react-icons/fa6";
import { UserContext } from "../context/UserContext";
import { AppContext } from "../context/AppContext";

function RightController() {
  const { isDarkMode, isRunning, setIsRunning } = useContext(UserContext);
  const { sessionComlpletePopup, setSessionCompletePopup } =
    useContext(AppContext);

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
        setSessionTime(15);
        return 0;
      });
    }, 1000);
  };

  // Calculate knob position
  const getKnobPosition = () => {
    const radius = 50; // Same as the progress circle's radius
    const circumference = 2 * Math.PI * radius; // Full circle circumference
    const progress = timeLeft / (sessionTime * 60); // Progress ratio (0 to 1)
    const angle = (progress * 360 - 90) * (Math.PI / 180); // Convert to radians, adjust for -90° rotation
    const x = 60 + radius * Math.cos(angle); // Center (60, 60)
    const y = 60 + radius * Math.sin(angle);
    return { x, y };
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
      await axios.post("http://localhost:3000/api/device/session/start", {
        sessionTime,
      });
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
    setSessionCompletePopup(true);
    clearInterval(timerRef.current);
  };

  const handleIncreaseTimeChange = () =>
    setSessionTime((prev) => Math.min(60, prev + 1));
  const handleDecreaseTimeChange = () =>
    setSessionTime((prev) => Math.max(1, prev - 1));

  // Dynamic stroke color for timer based on timeLeft
  const getTimerStrokeColor = () => {
    const percentage = (timeLeft / (sessionTime * 60)) * 100;
    if (percentage > 50) return "#00C2FF"; // ocen for >50%
    if (percentage > 20) return "#f59e0b"; // Yellow for 20-50%
    return "#ef4444"; // Red for <20%
  };

  // ========== UI ==========
  return (
    <div className="w-full h-full">
      
      <div className="flex flex-col items-center justify-center w-full h-full pb-5 pt-20 px-5">
        {/* Timer Section */}
        <div className="bg-[#F4F7FB] w-full h-full flex flex-col items-center justify-center shadow-md rounded-lg p-6">
          <p
            className={`relative font-['Playfair'] font-semibold text-4xl ${
              isDarkMode ? "text-[#00C2FF]" : "text-[#00C2FF]"
            } pb-2 after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:w-60 after:h-[1px] after:bg-gray-400 after:shadow-[0_2px_4px_rgba(0,0,0,0.2)]`}
          >
            Session Time
          </p>
          {/* Timer Circle */}
          <div className="relative flex justify-evenly items-center mt-6 w-full">
            <div>
              <button
                onClick={handleDecreaseTimeChange}
                className={`p-4 rounded-full shadow-md text-xl font-bold ${
                  isDarkMode ? "text-white" : "text-gray-700"
                }`}
              >
                <FaMinus className="text-4xl text-[#00C2FF]" />
              </button>
            </div>
            <svg width="300" height="300" viewBox="0 0 120 120">
              {/* Background Circle */}
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="transparent"
                stroke="lightgray"
                strokeWidth="2"
              />
              {/* Progress Bar */}
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="transparent"
                stroke={getTimerStrokeColor()}
                strokeWidth="2"
                strokeDasharray="314"
                strokeDashoffset={314 - (timeLeft / (sessionTime * 60)) * 314}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
              />
              {/* Knob */}
              <circle
                cx={getKnobPosition().x}
                cy={getKnobPosition().y}
                r="3" // Knob size
                fill="#ffffff" // White fill for visibility
                stroke={getTimerStrokeColor()} // Match progress bar color
                strokeWidth="2"
              />
            </svg>
            <button
              onClick={handleIncreaseTimeChange}
              className={`p-4 rounded-full shadow-md text-xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-700"
              }`}
            >
              <FaPlus className="text-4xl text-[#00C2FF]" />
            </button>

            <span
              className={`absolute font-['playfair'] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-5xl rounded-full ${
                isDarkMode ? "text-white" : "text-gray-700"
              }`}
            >
              <p className="text-gray-700">
                {Math.floor(timeLeft / 60)}:
                {String(timeLeft % 60).padStart(2, "0")}
              </p>
            </span>
            <p className="absolute top-[55%] text-gray-400 font-['playfair'] text-2xl mt-5">
              Minutes
            </p>
          </div>

          {/* Time Controls */}
          <div className="flex justify-between mt-[-8px] w-[190px]"></div>

          {/* Control Buttons */}
          <div className="mt-6 flex h-[100px] w-full">
            <div className="flex items-center justify-center w-full">
              {isRunning ? (
                <div className="flex items-center gap-10 justify-evenly px-6 py-6 text-[#00C2FF] border-[#00C2FF] text-xl font-bold">
                  <button
                    onClick={handlePause}
                    className="shadow-lg rounded-4xl px-3 py-3 transition-all duration-300 ease-in-out hover:scale-95"
                  >
                    <FaPause className="text-4xl" />
                  </button>
                  <button
                    onClick={handleStop}
                    className="shadow-lg rounded-4xl px-3 py-3 transition-all duration-300 ease-in-out hover:scale-95"
                  >
                    <FaStop className="text-4xl" />
                  </button>
                </div>
              ) : (
                <>
                  {isInitialState ? (
                    <button
                      onClick={handleStart}
                      className="font-['Playfair'] bg-[#00C2FF] text-white relative px-10 py-2 rounded-full text-4xl transition-all duration-300 ease-in-out hover:scale-95"
                    >
                      START
                    </button>
                  ) : (
                    <div className="flex items-center gap-10 justify-evenly px-6 py-6 text-[#00C2FF] border-[#00C2FF] text-xl font-bold">
                      <button
                        onClick={handleResume}
                        className="shadow-lg rounded-4xl px-3 py-3 transition-all duration-300 ease-in-out hover:scale-95"
                      >
                        <FaPlay className="text-4xl" />
                      </button>
                      <button
                        onClick={handleStop}
                        className="shadow-lg rounded-4xl px-3 py-3 transition-all duration-300 ease-in-out hover:scale-95"
                      >
                        <FaStop className="text-4xl" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RightController;
