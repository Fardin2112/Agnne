import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { FaFan, FaPlus, FaMinus } from "react-icons/fa6";
import { HiOutlineLightBulb } from "react-icons/hi";
import axios from "axios";

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

  // ========================
  // API Functions (inline)
  // ========================
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
      await axios.post("http://localhost:3000/api/device/sanitation/stop")
      setSanitationMode(false);
      setIsPaused(false);
      setTimeLeft(minutes * 60);
      localStorage.removeItem("sanitationStartTime");
      localStorage.removeItem("sanitationMinutes");
    } catch (error) {
        console.log(error.message,"Error in stop sanitation from frontend")
    }
  };

  return (
    <div className={`pt-32 h-full transition-all ${isDarkMode ? "bg-black text-white" : "bg-white text-black"}`}>
      <div className="flex flex-col justify-center items-center">
        <h3 className="text-3xl font-bold mb-4">Sanitation Mode</h3>

        {/* Time Controls */}
        <div className="flex items-center gap-3 mb-4">
          <button
            className="px-2 py-1 text-xl rounded bg-gray-300 dark:bg-gray-700"
            onClick={() => setMinutes((prev) => Math.max(prev - 1, 1))}
            disabled={sanitationMode}
          >
            <FaMinus />
          </button>
          <p className="text-xl font-bold">{minutes} min</p>
          <button
            className="px-2 py-1 text-xl rounded bg-gray-300 dark:bg-gray-700"
            onClick={() => setMinutes((prev) => Math.min(prev + 1, 15))}
            disabled={sanitationMode}
          >
            <FaPlus />
          </button>
        </div>

        {/* Timer Display */}
        <p className="text-lg font-semibold mb-3">
          Time Left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
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

        {/* Info */}
        <div className="py-3 text-lg font-semibold">
          <p className="flex items-center gap-1">
            <HiOutlineLightBulb className="text-blue-400 text-2xl" /> Blue Light: 100%
          </p>
          <p className="flex items-center gap-2">
            <FaFan className="text-yellow-400" /> Fans Max: {minutes} min
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex gap-3">
          {!sanitationMode && !isPaused && (
            <button
              onClick={handleStart}
              className="px-5 py-2 text-white text-lg font-semibold rounded-xl shadow-lg bg-green-600 hover:bg-green-700 active:scale-95 transition-all"
            >
              Start
            </button>
          )}

          {sanitationMode && !isPaused && (
            <>
              <button
                onClick={handlePause}
                className="px-5 py-2 text-white text-lg font-semibold rounded-xl shadow-lg bg-yellow-500 hover:bg-yellow-600 active:scale-95 transition-all"
              >
                Pause
              </button>
              <button
                onClick={handleStop}
                className="px-5 py-2 text-white text-lg font-semibold rounded-xl shadow-lg bg-red-500 hover:bg-red-600 active:scale-95 transition-all"
              >
                Stop
              </button>
            </>
          )}

          {sanitationMode && isPaused && (
            <button
              onClick={handleResume}
              className="px-5 py-2 text-white text-lg font-semibold rounded-xl shadow-lg bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all"
            >
              Resume
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sanitation;
