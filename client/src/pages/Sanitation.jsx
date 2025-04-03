import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { FaFan } from "react-icons/fa6";
import { HiOutlineLightBulb } from "react-icons/hi";

function Sanitation() {
  const { isDarkMode } = useContext(AppContext);
  const totalTime = 180; // 3 minutes (in seconds)
  const [sanitationMode, setSanitationMode] = useState(false); // Tracks if sanitation is active
  const [isPaused, setIsPaused] = useState(false); // Tracks pause state
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [progress, setProgress] = useState(0);

  // Load previous session from localStorage
  useEffect(() => {
    const storedStartTime = localStorage.getItem("sanitationStartTime");
    if (storedStartTime) {
      const elapsedTime = Math.floor((Date.now() - storedStartTime) / 1000);
      if (elapsedTime < totalTime) {
        setSanitationMode(true);
        setTimeLeft(totalTime - elapsedTime);
      } else {
        localStorage.removeItem("sanitationStartTime");
      }
    }
  }, []);

  // Handle Start
  const handleStart = () => {
    console.log("Sanitation Started"); // Simulate API call
    const startTime = Date.now();
    localStorage.setItem("sanitationStartTime", startTime);
    setSanitationMode(true);
    setIsPaused(false);
    setTimeLeft(totalTime);
    setProgress(0);
  };

  // Handle Pause
  const handlePause = () => {
    console.log("Sanitation Paused"); // Simulate API call
    setIsPaused(true);
  };

  // Handle Resume
  const handleResume = () => {
    console.log("Sanitation Resumed"); // Simulate API call
    setIsPaused(false);
  };

  // Timer Logic
  useEffect(() => {
    let interval;
    if (sanitationMode && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            console.log("Sanitation Completed"); // Simulate API call
            setSanitationMode(false);
            setIsPaused(false);
            localStorage.removeItem("sanitationStartTime");
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sanitationMode, isPaused, timeLeft]);

  // Update progress bar
  useEffect(() => {
    setProgress(((totalTime - timeLeft) / totalTime) * 100);
  }, [timeLeft]);

  // Check if in initial state (for "Start" vs "Resume")
  const isInitialState = timeLeft === totalTime && !sanitationMode;

  return (
    <div
      className={`pt-32 h-full transition-all ${
        isDarkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <div className="flex flex-col justify-center items-center">
        <h3 className="text-3xl font-bold mb-2">Sanitation Mode</h3>

        {/* Timer Display */}
        <p className="text-lg font-semibold mb-3">
          Time Left: {Math.floor(timeLeft / 60)}:
          {String(timeLeft % 60).padStart(2, "0")}
        </p>

        {/* Progress Bar */}
        <div className="w-72 h-4 bg-gray-300 rounded-full overflow-hidden my-4">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              sanitationMode && !isPaused ? "bg-blue-500" : "bg-gray-500"
            }`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="py-3 text-lg font-semibold">
          <p className="flex items-center gap-1">
            <HiOutlineLightBulb className="text-blue-400 text-2xl" /> Blue Light: 100%
          </p>
          <p className="flex items-center gap-2">
            <FaFan className="text-yellow-400" /> Fans Max: 3 min
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-4 flex gap-3">
          {sanitationMode && !isPaused ? (
            <button
              onClick={handlePause}
              className="px-5 py-2 text-white text-lg font-semibold rounded-xl shadow-lg bg-yellow-500 hover:bg-yellow-600 active:scale-95 transition-all"
            >
              Pause
            </button>
          ) : (
            <button
              onClick={isInitialState ? handleStart : handleResume}
              disabled={sanitationMode && isPaused && timeLeft === 0}
              className={`px-5 py-2 text-white text-lg font-semibold rounded-xl shadow-lg transition-all ${
                sanitationMode && isPaused && timeLeft === 0
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 active:scale-95"
              }`}
            >
              {isInitialState ? "Start" : "Resume"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sanitation;