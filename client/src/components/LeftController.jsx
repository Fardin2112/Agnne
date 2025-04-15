import React, { useContext } from "react";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { AppContext } from "../context/AppContext";
import { HiOutlineLightBulb } from "react-icons/hi";
import axios from "axios";

const LeftController = () => {
  const {
    isDarkMode,
    blueLight,
    setBlueLight,
    redLight,
    setRedLight,
    userTemp,
    machineTemp,
    maxUserTemp,
    setMaxUserTemp,
    maxMachineTemp,
    setMaxMachineTemp,
    sendWsMessage, // ✅ From context
  } = useContext(AppContext);

  // 🔵 Handle blue light slider change
  const handleBlueLightChange = (e) => {
    const newValue = Number(e.target.value);
    setBlueLight(newValue); // update UI
    sendWsMessage(`BLUE_INTENSITY=${newValue}`); // send to server
  };

  // 🔴 Handle red light slider change
  const handleRedLightChange = (e) => {
    const newValue = Number(e.target.value);
    setRedLight(newValue); // update UI
    sendWsMessage(`RED_INTENSITY=${newValue}`); // send to server
  };

  // 🔼 Increase max user temp and sync with backend
  const increaseUserTemp = async () => {
    const value = maxUserTemp + 1;
    await MaxUserTempFun(value);
    setMaxUserTemp((prev) => Math.min(prev + 1, 60));
  };

  // 🔽 Decrease max user temp and sync with backend
  const decreaseUserTemp = async () => {
    const value = maxUserTemp - 1;
    await MaxUserTempFun(value);
    setMaxUserTemp((prev) => Math.max(prev - 1, 0));
  };

  // ⬆️⬇️ Send max user temp update to server
  const MaxUserTempFun = async (value) => {
    try {
      await axios.post("http://localhost:3000/api/device/user-maxtemp", { value });
      console.log("✅ Max User Temp Set:", value);
    } catch (error) {
      console.log(error.message);
    }
  };

  // 🔼 Increase max machine temp and sync with backend
  const increaseMachineTemp = async () => {
    const value = maxMachineTemp + 1;
    await MaxMachineTempFun(value);
    setMaxMachineTemp((prev) => Math.min(prev + 1, 75));
  };

  // 🔽 Decrease max machine temp and sync with backend
  const decreaseMachineTemp = async () => {
    const value = maxMachineTemp - 1;
    await MaxMachineTempFun(value);
    setMaxMachineTemp((prev) => Math.max(prev - 1, 0));
  };

  // ⬆️⬇️ Send max machine temp update to server
  const MaxMachineTempFun = async (value) => {
    try {
      await axios.post("http://localhost:3000/api/device/machine-maxtemp", { value });
      console.log("✅ Max Machine Temp Set:", value);
    } catch (error) {
      console.log(error.message);
    }
  };

  // Calculate percentage for circle progress
  const userTempPercentage = maxUserTemp === 0 ? 0 : (userTemp / maxUserTemp) * 100;
  const machineTempPercentage = maxMachineTemp === 0 ? 0 : (machineTemp / maxMachineTemp) * 100;
  const circumference = 376.99;

  return (
    <div className="flex flex-col justify-center items-center h-full w-full pt-10">
      <div className="flex flex-col w-[90%] h-[40%] items-center p-2">
        {/* 🔵 Blue Light Slider */}
        <div className="flex flex-col w-full items-center ">
          <div className="flex justify-between items-center w-full px-5 pt-1 text-xl font-bold text-blue-500">
            <div className="flex gap-2">
            <HiOutlineLightBulb className="text-blue-400 text-2xl" />
            <p>Blue light</p>
            </div>
            <p>{blueLight}%</p>
          </div>
          <div className="flex flex-col w-full h-full items-center">
            <input
              type="range"
              min="0"
              max="100"
              value={blueLight}
              onChange={handleBlueLightChange}
              style={{
                background: `linear-gradient(to right, #3b82f6 ${blueLight}%, #e5e7eb ${blueLight}%)`,
              }}
              className="w-[100%] h-5 appearance-none bg-gray-300 rounded-full outline-none transform origin-center cursor-pointer
                [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-blue-400 [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer"
            />
          </div>
          
        </div>

        {/* 🔴 Red Light Slider */}
        <div className="flex flex-col pb-10 w-full pt-8 items-center">
        <div className="flex justify-between px-5 w-full items-center pt-1 text-xl font-bold text-red-500">
          <div className="flex gap-2">
          <HiOutlineLightBulb className="text-red-400 text-2xl" />
          <p>Red light</p>
          </div>   
            <p>{redLight}%</p>
          </div>
          <div className="flex flex-col h-full w-full items-center">
            <input
              type="range"
              min="0"
              max="100"
              value={redLight}
              onChange={handleRedLightChange}
              style={{
                background: `linear-gradient(to right, #ef4444 ${redLight}%, #e5e7eb ${redLight}%)`,
              }}
              className="w-[100%] h-5 appearance-none bg-gray-300 rounded-full outline-none transform origin-center cursor-pointer
                [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-red-400 [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer"
            />
          </div>
          
        </div>

      </div>

      {/* below part  user and machine temp */}
      <div className="flex h-[60%] justify-evenly w-full pb-3">
        {/* 🌡️ User Temp Control */}
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 relative flex items-center justify-center">
            <svg className="absolute w-full h-full" viewBox="0 0 128 128">
              <circle cx="64" cy="64" r="60" fill="none" stroke="#e5e7eb" strokeWidth="8" />
              <circle
                cx="64"
                cy="64"
                r="60"
                fill="none"
                stroke="green"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - (userTempPercentage / 100) * circumference}
                transform="rotate(-90 64 64)"
              />
            </svg>
            <p className="text-xl font-bold text-green-500 z-10">{userTemp}°C</p>
          </div>
          <p className="mt-2 text-green-500 font-bold">User Temp</p>
          <div className={`flex gap-2 mt-2 ${isDarkMode ? "bg-black text-white" : "bg-white text-black"}`}>
            <button onClick={decreaseUserTemp} className="px-2 py-2 rounded">
              <FaMinus className="text-2xl"/>
            </button>
            <p className="px-2 py-2 text-xl">{maxUserTemp}</p>
            <button onClick={increaseUserTemp} className="px-2 py-2 rounded">
              <FaPlus className="text-2xl"/>
            </button>
          </div>
        </div>

        {/* ⚙️ Machine Temp Control */}
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 relative flex items-center justify-center">
            <svg className="absolute w-full h-full" viewBox="0 0 128 128">
              <circle cx="64" cy="64" r="60" fill="none" stroke="#e5e7eb" strokeWidth="8" />
              <circle
                cx="64"
                cy="64"
                r="60"
                fill="none"
                stroke="orange"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - (machineTempPercentage / 100) * circumference}
                transform="rotate(-90 64 64)"
              />
            </svg>
            <p className="text-xl font-bold text-orange-500 z-10">{machineTemp}°C</p>
          </div>
          <p className="mt-2 text-orange-500 font-bold">Machine Temp</p>
          <div className={`flex gap-2 mt-2 ${isDarkMode ? "bg-black text-white" : "bg-white text-black"}`}>
            <button onClick={decreaseMachineTemp} className="px-2 py-2 rounded">
              <FaMinus className="text-2xl"/>
            </button>
            <p className="px-2 py-2 text-xl">{maxMachineTemp}</p>
            <button onClick={increaseMachineTemp} className="px-2 py-2 rounded">
              <FaPlus className="text-2xl"/>
            </button>
          </div>
        </div>
        </div>
    </div>
  );
};

export default LeftController;
