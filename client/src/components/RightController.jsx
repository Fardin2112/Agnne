import React, { useState } from "react";
import { FaPlay, FaPause, FaFan, FaDroplet, FaPowerOff } from "react-icons/fa6";

function RightController() {
  const [sessionTime, setSessionTime] = useState(15);
  const [isRunning, setIsRunning] = useState(false);
  const [userFanSpeed, setUserFanSpeed] = useState(50);
  const [machineFanSpeed, setMachineFanSpeed] = useState(50);

  // Change Session Time
  const handleTimeChange = (change) => {
    setSessionTime((prev) => Math.max(1, prev + change)); // Prevent negative time
  };

  // Start/Stop Button
  const handleStart = () => {
    setIsRunning((prev) => !prev);
  };

  return (
    <div className="text-white flex flex-col justify-center item-center w-full h-full">

      <div className="flex flex-col items-center">
        {/* Session Time - Circular Timer */}
        <div className="relative flex flex-col items-center">
  <svg width="120" height="120" viewBox="0 0 120 120">
    {/* Background Circle */}
    <circle
      cx="60"
      cy="60"
      r="50"
      fill="transparent"
      stroke="gray"
      strokeWidth="10"
    />
    {/* Progress Circle */}
    <circle
      cx="60"
      cy="60"
      r="50"
      fill="transparent"
      stroke="purple"
      strokeWidth="5"
      strokeDasharray="314"
      strokeDashoffset={314 - (sessionTime / 60) * 314}
      strokeLinecap="round"
      transform="rotate(-90 60 60)"  // Rotates to start from top
    />
  </svg>
  {/* Centered Timer Text */}
  <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl font-bold">
    {sessionTime}:00
  </span>
</div>


        {/* Increase/Decrease Session Time */}
        <div className="flex gap-4 mt-3">
          <button
            onClick={() => handleTimeChange(-1)}
            className="px-3 text-xl font-bold"
          >
            -
          </button>
          <button
            onClick={() => handleTimeChange(1)}
            className="px-3 text-xl font-bold"
          >
            +
          </button>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStart}
          className={`mt-4 px-6 py-2 rounded-full flex items-center gap-2 ${
            isRunning ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {isRunning ? <FaPause /> : <FaPlay />}
          {isRunning ? "Stop" : "Start"}
        </button>

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
                onChange={(e) => setUserFanSpeed(e.target.value)}
                className="w-full"
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
                    onChange={(e) => setMachineFanSpeed(e.target.value)}
                    className="w-full"
                    />
                </div>  
          </div>
        </div>
      </div>
    </div>
  );
}

export default RightController;
