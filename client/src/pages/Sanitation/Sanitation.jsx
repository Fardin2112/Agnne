import React, { useContext, useState, useEffect } from "react";
import { FaFan, FaPlus, FaMinus } from "react-icons/fa6";
import { HiOutlineLightBulb } from "react-icons/hi";
import axios from "axios";
import "./Sanitation.css"; // Import the CSS file
import { AppContext } from "../../context/AppContext";

function Sanitation() {
  const { isDarkMode } = useContext(AppContext);
  const [minutes, setMinutes] = useState(3);
  const [timeLeft, setTimeLeft] = useState(minutes * 60);
  const [sanitationMode, setSanitationMode] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  // Update timeLeft when minutes change (only if not running)
  useEffect(() => {
    if (!sanitationMode && !isPaused) {
      setTimeLeft(minutes * 60);
    }
  }, [minutes]);

  // Load previous session
  useEffect(() => {
    const storedStartTime = localStorage.getItem("sanitationStartTime");
    const storedMinutes = localStorage.getItem("sanitationMinutes");

    if (storedStartTime && storedMinutes) {
      const elapsed = Math.floor((Date.now() - storedStartTime) / 1000);
      const savedTime = Number(storedMinutes) * 60;

      if (elapsed < savedTime) {
        setSanitationMode(true);
        setMinutes(Number(storedMinutes));
        setTimeLeft(savedTime - elapsed);
      } else {
        localStorage.removeItem("sanitationStartTime");
        localStorage.removeItem("sanitationMinutes");
      }
    }
  }, []);

  // Timer countdown logic
  useEffect(() => {
    let interval;
    if (sanitationMode && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setSanitationMode(false);
            setIsPaused(false);
            localStorage.removeItem("sanitationStartTime");
            localStorage.removeItem("sanitationMinutes");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sanitationMode, isPaused, timeLeft]);

  // Progress bar update
  useEffect(() => {
    setProgress(((minutes * 60 - timeLeft) / (minutes * 60)) * 100);
  }, [timeLeft, minutes]);

  // API Functions
  const handleStart = async () => {
    try {
      const res = await axios.post("http://localhost:3000/api/device/sanitation/start", { time: minutes });
      if (res.data.success) {
        const now = Date.now();
        localStorage.setItem("sanitationStartTime", now);
        localStorage.setItem("sanitationMinutes", minutes);
        setSanitationMode(true);
        setIsPaused(false);
        setTimeLeft(minutes * 60);
        setProgress(0);
      }
    } catch (err) {
      alert("❌ Failed to start sanitation");
    }
  };

  const handlePause = async () => {
    try {
      await axios.post("http://localhost:3000/api/device/sanitation/pause");
      setIsPaused(true);
    } catch {
      alert("❌ Failed to pause sanitation");
    }
  };

  const handleResume = async () => {
    try {
      await axios.post("http://localhost:3000/api/device/sanitation/resume");
      setIsPaused(false);
    } catch {
      alert("❌ Failed to resume sanitation");
    }
  };

  const handleStop = async () => {
    try {
      await axios.post("http://localhost:3000/api/device/sanitation/stop");
      setSanitationMode(false);
      setIsPaused(false);
      setTimeLeft(minutes * 60);
      localStorage.removeItem("sanitationStartTime");
      localStorage.removeItem("sanitationMinutes");
    } catch (error) {
      console.log(error.message, "Error in stop sanitation from frontend");
    }
  };

  return (
    <div
      className={`h-full flex items-center justify-center transition-all duration-500 ${
        isDarkMode ? "bg-gradient-to-br from-gray-900 to-black text-white" : "bg-gradient-to-br from-gray-100 to-white text-black"
      }`}
    >
      <div className="relative p-6 rounded-3xl shadow-2xl bg-opacity-80 backdrop-blur-lg border border-opacity-20 border-gray-500 w-[90%] max-w-[900px]">
        {/* Title */}
        <h3 className="text-3xl font-extrabold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Sanitation Mode
        </h3>

        {/* Time Controls */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <button
            className={`p-2 rounded-full shadow-lg transition-transform duration-200 transform hover:scale-110 ${
              isDarkMode ? "bg-gray-700" : "bg-gray-300"
            } ${sanitationMode ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => setMinutes((prev) => Math.max(prev - 1, 1))}
            disabled={sanitationMode}
          >
            <FaMinus className="text-lg" />
          </button>
          <p className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            {minutes} min
          </p>
          <button
            className={`p-2 rounded-full shadow-lg transition-transform duration-200 transform hover:scale-110 ${
              isDarkMode ? "bg-gray-700" : "bg-gray-300"
            } ${sanitationMode ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => setMinutes((prev) => Math.min(prev + 1, 15))}
            disabled={sanitationMode}
          >
            <FaPlus className="text-lg" />
          </button>
        </div>

        {/* Timer Display */}
        <p className="text-center text-2xl font-bold mb-4">
          Time Left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
        </p>

        {/* Horizontal Progress Bar */}
        <div className="w-full h-1 bg-gray-300 rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Info */}
        <div className="text-center mb-6">
          <p className="flex items-center justify-center gap-2 text-lg font-semibold">
            <HiOutlineLightBulb
              className={`text-blue-400 text-2xl ${sanitationMode && !isPaused ? "animate-blink" : ""}`}
            />
            Blue Light: 100%
          </p>
          <p className="flex items-center justify-center gap-2 text-lg font-semibold">
            <FaFan
              className={`text-yellow-400 ${sanitationMode && !isPaused ? "animate-spin" : ""}`}
            />
            Fans Max: {minutes} min
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          {!sanitationMode && !isPaused && (
            <button
              onClick={handleStart}
              className="relative px-6 py-2 text-lg font-semibold text-white rounded-xl bg-gradient-to-r from-green-500 to-green-700 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95"
            >
              Start
              <div className="absolute inset-0 rounded-xl bg-green-400 opacity-0 hover:opacity-20 transition-opacity"></div>
            </button>
          )}

          {sanitationMode && !isPaused && (
            <>
              <button
                onClick={handlePause}
                className="relative px-6 py-2 text-lg font-semibold text-white rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-700 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95"
              >
                Pause
                <div className="absolute inset-0 rounded-xl bg-yellow-400 opacity-0 hover:opacity-20 transition-opacity"></div>
              </button>
              <button
                onClick={handleStop}
                className="relative px-6 py-2 text-lg font-semibold text-white rounded-xl bg-gradient-to-r from-red-500 to-red-700 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95"
              >
                Stop
                <div className="absolute inset-0 rounded-xl bg-red-400 opacity-0 hover:opacity-20 transition-opacity"></div>
              </button>
            </>
          )}

          {sanitationMode && isPaused && (
            <button
              onClick={handleResume}
              className="relative px-6 py-2 text-lg font-semibold text-white rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95"
            >
              Resume
              <div className="absolute inset-0 rounded-xl bg-blue-400 opacity-0 hover:opacity-20 transition-opacity"></div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sanitation;