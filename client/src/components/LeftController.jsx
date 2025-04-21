import React, { useContext, useState } from "react";
import { FaMinus, FaPlus, FaFan } from "react-icons/fa6";
import { UserContext } from "../context/UserContext";
import { HiOutlineLightBulb } from "react-icons/hi";
import { TbTemperatureSnow } from "react-icons/tb";
import axios from "axios";
import { PiFanFill } from "react-icons/pi";
import { HiLightBulb } from "react-icons/hi";
import { LiaTemperatureLowSolid } from "react-icons/lia";
import { IoReturnUpBackOutline } from "react-icons/io5";
import { AppContext } from "../context/AppContext";

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
    userFanSpeed,
    setUserFanSpeed,
    machineFanSpeed,
    setMachineFanSpeed,
    sendWsMessage,
  } = useContext(UserContext);

    const { toggleHome,setToggleHome } = useContext(AppContext);
    const [activeSection, setActiveSection] = useState("light"); // Default to light

  // 🔵 Handle blue light slider change
  const handleBlueLightChange = (e) => {
    const newValue = Number(e.target.value);
    setBlueLight(newValue);
    sendWsMessage(`BLUE_INTENSITY=${newValue}`);
  };

  // 🔴 Handle red light slider change
  const handleRedLightChange = (e) => {
    const newValue = Number(e.target.value);
    setRedLight(newValue);
    sendWsMessage(`RED_INTENSITY=${newValue}`);
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

  // 🌬️ Send fan speed to server
  const sendFanSpeed = async (type, value) => {
    try {
      await axios.post(`http://localhost:3000/api/device/fan/${type}`, { value });
      console.log(`✅ Fan ${type} updated: ${value}`);
    } catch (error) {
      console.error(`❌ Fan ${type} update failed`, error);
    }
  };

  // 🌬️ Handle user fan speed change
  const handleUserfan = (e) => {
    const value = Number(e.target.value);
    setUserFanSpeed(value);
    sendFanSpeed("user", value);
  };

  // 🌬️ Handle machine fan speed change
  const handleMachinefan = (e) => {
    const value = Number(e.target.value);
    setMachineFanSpeed(value);
    sendFanSpeed("machine", value);
  };

  // Calculate percentage for circle progress
  const userTempPercentage = maxUserTemp === 0 ? 0 : (userTemp / maxUserTemp) * 100;
  const machineTempPercentage = maxMachineTemp === 0 ? 0 : (machineTemp / maxMachineTemp) * 100;
  const circumference = 376.99;

  return (
    <div className="flex justify-center items-center h-full w-full ">
      {/* Buttons */}
      <div className="flex flex-col justify-between h-full w-24 bg-opacity-20">
        <button onClick={()=>setToggleHome(false)} className="px-4 py-4 text-4xl rounded-br-2xl bg-[#FFFFFF] shadow-md hover:bg-gray-100 hover:scale-105">
          <IoReturnUpBackOutline />
        </button>
        <div className="flex flex-col items-center bg-white gap-y-2 rounded-r-full py-10 shadow-md">
          <button
            onClick={() => setActiveSection("fan")}
            className={`p-3 rounded-tr-3xl transition-colors ${
              activeSection === "fan" ? "bg-gray-100 shadow-md" : "hover:bg-gray-100 hover:rounded-tr-3xl hover:scale-110"
            }`}
          >
            <PiFanFill className={`text-5xl text-[#000000]/70 ${activeSection === "fan" ? "text-[#000000]" : ""}`} />
          </button>
          <button
            onClick={() => setActiveSection("light")}
            className={`p-3 rounded-lg transition-colors ${
              activeSection === "light" ? "bg-gray-100 shadow-md" : "hover:bg-gray-100 hover:scale-110"
            }`}
          >
            <HiLightBulb className="text-5xl text-[#000000]/70" />
          </button>
          <button
            onClick={() => setActiveSection("temp")}
            className={`p-3 rounded-br-3xl transition-colors ${
              activeSection === "temp" ? "bg-gray-100" : "hover:bg-gray-100 hover:rounded-br-3xl hover:scale-110"
            }`}
          >
            <LiaTemperatureLowSolid className="text-5xl text-[#000000]/70" />
          </button>
        </div>
        <div></div>
      </div>

      {/* Content Area */}
      <div className="flex justify-center pt-20 pb-5 px-5 items-center flex-1 w-full h-full">
        {activeSection === "fan" && (
          <div className="flex w-full h-full items-center justify-center bg-white rounded-lg shadow-md">
            {/* 🌬️ User Fan Slider */}
            <div className="flex w-[250px] flex-col items-center h-full">
              <p className="text-[#22c55e] font-semibold pt-4">User Fan</p>
              <input
                type="range"
                min="0"
                max="100"
                value={userFanSpeed}
                onChange={handleUserfan}
                className="w-[440px] h-3 bg-gray-200 rounded-full appearance-none cursor-pointer transform -rotate-90 mt-60
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
                  [&::-webkit-slider-thumb]:bg-[#22c55e] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md
                  [&::-webkit-slider-thumb]:hover:bg-[#22c55e] [&::-webkit-slider-thumb]:transition-colors
                  [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:bg-[#22c55e]
                  [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:hover:bg-[#22c55e]
                  [&::-moz-range-thumb]:transition-colors"
                style={{
                  background: `linear-gradient(to right, #22c55e ${userFanSpeed}%, #e5e7eb ${userFanSpeed}%)`,
                }}
              />
              <div className="mt-56 gap-2 flex items-center justify-center w-full px-4 text-[#22c55e]">
                <FaFan className="text-[#22c55e] text-3xl" />
                <span className="pr-5 font-bold">{userFanSpeed}%</span>
              </div>
            </div>

            {/* 🌬️ Machine Fan Slider */}
            <div className="flex w-[250px] flex-col items-center justify-center h-full">
              <p className="text-[#ffa500] font-semibold">Machine Fan</p>
              <input
                type="range"
                min="0"
                max="100"
                value={machineFanSpeed}
                onChange={handleMachinefan}
                className="w-[440px] h-3 bg-gray-200 rounded-full appearance-none cursor-pointer transform -rotate-90 mt-60
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
                  [&::-webkit-slider-thumb]:bg-[#ffa500] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md
                  [&::-webkit-slider-thumb]:hover:bg-[#ffa500] [&::-webkit-slider-thumb]:transition-colors
                  [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:bg-[#ffa500]
                  [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:hover:bg-[#ffa500]
                  [&::-moz-range-thumb]:transition-colors"
                style={{
                  background: `linear-gradient(to right, #ffa500 ${machineFanSpeed}%, #e5e7eb ${machineFanSpeed}%)`,
                }}
              />
              <div className="mt-56 gap-2 flex items-center justify-center w-full px-4 bg-white text-[#ffa500]">
                <FaFan className="text-[#ffa500] text-3xl" />
                <span className="pr-5 font-bold">{machineFanSpeed}%</span>
              </div>
            </div>
          </div>
        )}

        {activeSection === "light" && (
          <div className="flex w-full h-full items-center justify-center bg-white rounded-lg shadow-md">
            {/* 🔵 Blue Light Slider */}
            <div className="flex w-[250px] flex-col items-center pt-4 h-full">
              <p className="text-[#8291ff] font-semibold">Blue Light</p>
              <input
                type="range"
                min="0"
                max="100"
                value={blueLight}
                onChange={handleBlueLightChange}
                className="w-[440px] h-3 bg-gray-200 rounded-full appearance-none cursor-pointer transform -rotate-90 mt-60
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
                  [&::-webkit-slider-thumb]:bg-[#8291ff] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md
                  [&::-webkit-slider-thumb]:hover:bg-[#8291ff] [&::-webkit-slider-thumb]:transition-colors
                  [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:bg-[#8291ff]
                  [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:hover:bg-[#8291ff]
                  [&::-moz-range-thumb]:transition-colors"
                style={{
                  background: `linear-gradient(to right, #8291ff ${blueLight}%, #e5e7eb ${blueLight}%)`,
                }}
              />
              <div className="mt-56 gap-2 flex items-center justify-center w-full px-4 bg-white text-[#8291ff]">
                <HiOutlineLightBulb className="text-[#8291ff] text-3xl" />
                <span className="pr-5 font-bold">{blueLight}%</span>
              </div>
            </div>

            {/* 🔴 Red Light Slider */}
            <div className="flex w-[250px] flex-col items-center text-[#ff6663] justify-center h-full">
              <p className="font-semibold">Red Light</p>
              <input
                type="range"
                min="0"
                max="100"
                value={redLight}
                onChange={handleRedLightChange}
                className="w-[440px] h-3 bg-gray-200 rounded-full appearance-none cursor-pointer transform -rotate-90 mt-60
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
                  [&::-webkit-slider-thumb]:bg-[#ff6663] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md
                  [&::-webkit-slider-thumb]:hover:bg-[#ff6663] [&::-webkit-slider-thumb]:transition-colors
                  [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:bg-[#ff6663]
                  [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:hover:bg-[#ff6663]
                  [&::-moz-range-thumb]:transition-colors"
                style={{
                  background: `linear-gradient(to right, #ff6663 ${redLight}%, #e5e7eb ${redLight}%)`,
                }}
              />
              <div className="mt-56 gap-2 flex items-center justify-center w-full px-4 bg-white text-[#ff6663]">
                <HiOutlineLightBulb className="text-[#ff6663] text-3xl" />
                <span className="pr-5 font-bold">{redLight}%</span>
              </div>
            </div>
          </div>
        )}

        {activeSection === "temp" && (
          <div className="flex flex-col w-full h-full bg-white rounded-lg shadow-md p-6">
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
              <div className="flex items-center gap-2 mt-2 text-green-500 font-bold">
                <TbTemperatureSnow className="text-2xl" />
                <p>User Temp</p>
              </div>
              <div className="flex gap-2 mt-2">
                <button onClick={decreaseUserTemp} className="px-2 py-2 rounded">
                  <FaMinus className="text-2xl" />
                </button>
                <p className="px-2 py-2 text-xl">{maxUserTemp}</p>
                <button onClick={increaseUserTemp} className="px-2 py-2 rounded">
                  <FaPlus className="text-2xl" />
                </button>
              </div>
            </div>

            {/* ⚙️ Machine Temp Control */}
            <div className="flex flex-col items-center pt-3">
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
              <div className="flex items-center gap-2 mt-2 text-orange-500 font-bold">
                <TbTemperatureSnow className="text-2xl" />
                <p>Machine Temp</p>
              </div>
              <div className="flex gap-2 mt-2">
                <button onClick={decreaseMachineTemp} className="px-2 py-2 rounded">
                  <FaMinus className="text-2xl" />
                </button>
                <p className="px-2 py-2 text-xl">{maxMachineTemp}</p>
                <button onClick={increaseMachineTemp} className="px-2 py-2 rounded">
                  <FaPlus className="text-2xl" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
    </div>
  );
};

export default LeftController;