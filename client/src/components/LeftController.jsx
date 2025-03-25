import React, { useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa6";
import CircleControl from "./CircleControll";

const LeftController = () => {
  const [blueLight, setBlueLight] = useState(0);
  const [redLight, setRedLight] = useState(0);
  const [userTemp, setUserTemp] = useState(25);
  const [machineTemp, setMachineTemp] = useState(24);
  const [maxUserTemp, setMaxUserTemp] = useState(50);
  const [maxMachineTemp, setMaxMachineTemp] = useState(50);

  // Handlers for Max User Temp
  const increaseUserTemp = () => setMaxUserTemp((prev) => Math.min(prev + 1, 50));
  const decreaseUserTemp = () => setMaxUserTemp((prev) => Math.max(prev - 1, 0));

  // Handlers for Max Machine Temp
  const increaseMachineTemp = () => setMaxMachineTemp((prev) => Math.min(prev + 1, 50));
  const decreaseMachineTemp = () => setMaxMachineTemp((prev) => Math.max(prev - 1, 0));

  // Calculate fill percentages
  const userTempPercentage = maxUserTemp === 0 ? 0 : (userTemp / maxUserTemp) * 100;
  const machineTempPercentage = maxMachineTemp === 0 ? 0 : (machineTemp / maxMachineTemp) * 100;

  // Circle circumference for stroke-dasharray (radius = 60px, so circumference = 2 * π * 60 ≈ 376.99)
  const circumference = 376.99;

  return (
    <div className="flex justify-center items-center h-full w-full">
      <div className="grid grid-cols-2 gap-x-8 gap-y-6 w-full">
        {/* Blue Light and Red Light remain unchanged */}
        <CircleControl label="Blue Light" color="blue" value={blueLight} setValue={setBlueLight} max={100} unit="%" knobEnabled={true} />
        <CircleControl label="Red Light" color="red" value={redLight} setValue={setRedLight} max={100} unit="%" knobEnabled={true} />

        {/* User Temp with Border Fill */}
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 relative flex items-center justify-center">
            <svg className="absolute w-full h-full" viewBox="0 0 128 128">
              {/* Background circle (full border) */}
              <circle
                cx="64"
                cy="64"
                r="60"
                fill="none"
                stroke="#e5e7eb" // Gray background for unfilled portion
                strokeWidth="8"
              />
              {/* Foreground circle (filled portion) */}
              <circle
                cx="64"
                cy="64"
                r="60"
                fill="none"
                stroke="green"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - (userTempPercentage / 100) * circumference}
                transform="rotate(-90 64 64)" // Start from top
              />
            </svg>
            <p className="text-xl font-bold text-green-500 z-10">{userTemp}°C</p>
          </div>
          <p className="mt-2 text-green-500 font-bold">User Temp</p>
          <div className="flex gap-2 mt-2 text-white">
            <button onClick={decreaseUserTemp} className="px-3 py-1 rounded">
              <FaMinus />
            </button>
            <p>{maxUserTemp}</p>
            <button onClick={increaseUserTemp} className="px-3 py-1 rounded">
              <FaPlus />
            </button>
          </div>
        </div>

        {/* Machine Temp with Border Fill */}
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 relative flex items-center justify-center">
            <svg className="absolute w-full h-full" viewBox="0 0 128 128">
              {/* Background circle (full border) */}
              <circle
                cx="64"
                cy="64"
                r="60"
                fill="none"
                stroke="#e5e7eb" // Gray background for unfilled portion
                strokeWidth="8"
              />
              {/* Foreground circle (filled portion) */}
              <circle
                cx="64"
                cy="64"
                r="60"
                fill="none"
                stroke="orange"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - (machineTempPercentage / 100) * circumference}
                transform="rotate(-90 64 64)" // Start from top
              />
            </svg>
            <p className="text-xl font-bold text-orange-500 z-10">{machineTemp}°C</p>
          </div>
          <p className="mt-2 text-orange-500 font-bold">Machine Temp</p>
          <div className="flex gap-2 mt-2 text-white">
            <button onClick={decreaseMachineTemp} className="px-3 py-1 rounded">
              <FaMinus />
            </button>
            <p>{maxMachineTemp}</p>
            <button onClick={increaseMachineTemp} className="px-3 py-1 rounded">
              <FaPlus />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftController;