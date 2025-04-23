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

  const { toggleHome, setToggleHome } = useContext(AppContext);
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
      await axios.post("http://localhost:3000/api/device/user-maxtemp", {
        value,
      });
      console.log("✅ Max User Temp Set:", value);
    } catch (error) {
      console.log(error.message);
    }
  };

  const increaseMachineTemp = async () => {
    const newValue = Math.min(maxMachineTemp + 1, 75);
    await MaxMachineTempFun(newValue);
    setMaxMachineTemp(newValue);
    console.log("clicked machine inc");
  };
  
  const decreaseMachineTemp = async () => {
    const newValue = Math.max(maxMachineTemp - 1, 0);
    await MaxMachineTempFun(newValue);
    setMaxMachineTemp(newValue);
  };
  

  // ⬆️⬇️ Send max machine temp update to server
  const MaxMachineTempFun = async (value) => {
    try {
      await axios.post("http://localhost:3000/api/device/machine-maxtemp", {
        value,
      });
      console.log("✅ Max Machine Temp Set:", value);
    } catch (error) {
      console.log(error.message);
    }
  };

  // 🌬️ Send fan speed to server
  const sendFanSpeed = async (type, value) => {
    try {
      await axios.post(`http://localhost:3000/api/device/fan/${type}`, {
        value,
      });
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
  const userTempPercentage =
    maxUserTemp === 0 ? 0 : (userTemp / maxUserTemp) * 100;



  const machineTempPercentage =
    maxMachineTemp === 0 ? 0 : (machineTemp / maxMachineTemp) * 100;

  // Circumference for progress circle (radius = 105)
  const Machinecircumference = 2 * Math.PI * 105;
  const arcLength = Machinecircumference / 2;
  const progressLengthMachine = (machineTempPercentage / 100) * arcLength;
  const progressLengthUser = (userTempPercentage / 100) * arcLength;

  const radius = 105;
  const centerX = 195;
  const centerY = 193;
  const startX = centerX - radius;
  const endX = centerX + radius;

  // Arc path from left to right (180°)
  const arcPath = `M ${startX} ${centerY} A ${radius} ${radius} 0 0 1 ${endX} ${centerY}`;

  return (
    <div className="flex justify-center items-center h-full w-full ">
      {/* Buttons */}
      <div className="flex flex-col justify-between h-full w-24 bg-opacity-20">
        <button
          onClick={() => setToggleHome(false)}
          className="px-4 py-4 text-4xl rounded-br-2xl bg-[#FFFFFF] shadow-md hover:bg-gray-100 hover:scale-105"
        >
          <IoReturnUpBackOutline />
        </button>
        <div className="flex flex-col items-center bg-white gap-y-2 rounded-r-full py-10 shadow-md">
          <button
            onClick={() => setActiveSection("fan")}
            className={`p-3 rounded-tr-3xl transition-colors ${
              activeSection === "fan"
                ? "bg-gray-100 shadow-md"
                : "hover:bg-gray-100 hover:rounded-tr-3xl hover:scale-110"
            }`}
          >
            <PiFanFill
              className={`text-5xl text-[#000000]/70 ${
                activeSection === "fan" ? "text-[#000000]" : ""
              }`}
            />
          </button>
          <button
            onClick={() => setActiveSection("light")}
            className={`p-3 rounded-lg transition-colors ${
              activeSection === "light"
                ? "bg-gray-100 shadow-md"
                : "hover:bg-gray-100 hover:scale-110"
            }`}
          >
            <HiLightBulb className="text-5xl text-[#000000]/70" />
          </button>
          <button
            onClick={() => setActiveSection("temp")}
            className={`p-3 rounded-br-3xl transition-colors ${
              activeSection === "temp"
                ? "bg-gray-100"
                : "hover:bg-gray-100 hover:rounded-br-3xl hover:scale-110"
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
          <div className="flex flex-col w-full h-full rounded-lg shadow-md p-6 bg-white">
            {/* 🌡️ User Temp Control */}
            <div className="flex flex-col items-center h-[1/2]">
            <div className="w-full h-[260px] flex items-center justify-center">
                <svg
                  width="380"
                  height="330"
                  viewBox="0 0 390 384"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g filter="url(#filter0_i_2_529)">
                    {/* ticks UI */}
                    <path
                      d="M328 193C328 119.546 268.454 60 195 60C121.546 60 62 119.546 62 193"
                      stroke="#BAC4CF"
                      strokeWidth="10"
                      strokeDasharray="2 19"
                    />
                  </g>
                  <g filter="url(#filter1_i_2_529)">
                    <path d="M67 193H57" stroke="#B7C1CB" strokeWidth="2" />
                  </g>
                  <g filter="url(#filter2_i_2_529)">
                    <path d="M333 193H323" stroke="#B7C1CB" strokeWidth="2" />
                  </g>
                  <g filter="url(#filter3_di_2_529)">
                    {/* that's the circle where progress bar under this  */}
                    <circle
                      cx="195"
                      cy="193"
                      r="122"
                      fill="url(#paint0_linear_2_529)"
                      shapeRendering="crispEdges"
                    />
                    {/* upper areas of above circle */}
                    <circle
                      cx="195"
                      cy="193"
                      r="122.5"
                      stroke="url(#paint1_linear_2_529)"
                      shapeRendering="crispEdges"
                    />
                  </g>
                  {/* percentage increase decrease bar */}
                  {/* Full background arc */}
                  <path
                    d={arcPath}
                    fill="none"
                    stroke="lightgray"
                    strokeWidth="8"
                  />
                  {/* Progress arc */}
                  <path
                    d={arcPath}
                    fill="none"
                    stroke="black"
                    strokeWidth="8"
                    strokeDasharray={`${progressLengthUser} ${
                      arcLength - progressLengthUser
                    }`}
                    strokeDashoffset="0"
                    strokeLinecap="round"
                  />
                  {/* just below design look white */}
                  <g filter="url(#filter4_ddi_2_529)">
                    <circle
                      cx="195"
                      cy="193"
                      r="100"
                      fill="url(#paint3_linear_2_529)"
                    />
                    <circle
                      cx="195"
                      cy="193"
                      r="99.5"
                      stroke="url(#paint4_linear_2_529)"
                    />
                  </g>
                  {/* just above circle of written value */}
                  <circle
                    cx="195"
                    cy="193"
                    r="86"
                    fill="url(#paint5_linear_2_529)"
                  />
                  {/* dot value that also represent value */}
                  {/* <path
                    d="M207.484 122.202C208.165 118.335 211.865 115.721 215.655 116.748C215.871 116.807 216.087 116.866 216.302 116.926C220.084 117.985 221.923 122.125 220.529 125.795L220.172 126.735C218.975 129.887 215.454 131.441 212.203 130.546C208.952 129.65 206.724 126.512 207.309 123.192L207.484 122.202Z"
                    fill="url(#paint6_linear_2_529)"
                  /> */}
                  <g filter="url(#filter5_i_2_529)">
                    {/* wriiten value 22 */}
                    <text
                      x="176"
                      y="220"
                      fontFamily="Arial, sans-serif"
                      fontSize="40"
                      fill="#3C3C43"
                      fillOpacity="0.20"
                      id="temperatureText"
                    >
                      {userTemp}
                    </text>
                  </g>
                  {/* User temp */}
                  <text
                    x="140"
                    y="170"
                    fontFamily="Arial, sans-serif"
                    fontSize="20"
                    fill="#3C3C43"
                    fontWeight="700"
                    fillOpacity="0.6"
                    id="modeText"
                  >
                    User Temp
                  </text>
                  <g filter="url(#filter6_i_2_529)">
                    {/* leves */}
                    <path
                      d="M183.194 251.905C183.194 260.166 188.189 265.602 195.806 265.602C198.566 265.602 200.93 264.678 202.573 263.099C203.046 264.227 203.325 265.494 203.766 266.912C203.959 267.535 204.432 267.857 204.99 267.857C205.989 267.857 206.795 266.934 206.795 265.859C206.795 264.592 205.678 262.583 204.324 260.606C204.786 259.564 205.033 258.404 205.033 257.147C205.033 252.389 201.166 248.94 195.849 248.94C194.044 248.94 192.271 249.435 190.359 249.435C188.759 249.435 187.48 248.94 186.406 247.727C185.515 246.685 183.903 246.846 183.538 248.35C183.259 249.424 183.194 251.314 183.194 251.905ZM189.543 254.698C190.155 256.567 192.218 257.631 194.957 258.265C198.491 259.07 199.963 259.726 201.177 261.004C199.984 262.347 198.104 263.142 195.806 263.142C189.575 263.142 185.654 258.802 185.654 251.905C185.654 251.508 185.665 251.046 185.708 250.702C185.719 250.487 185.837 250.466 185.987 250.562C187.158 251.4 188.823 251.895 190.359 251.895C191.552 251.895 192.626 251.744 193.582 251.615C194.431 251.486 195.15 251.4 195.849 251.4C199.802 251.4 202.573 253.785 202.573 257.147C202.573 257.631 202.52 258.093 202.423 258.522C200.897 257.427 198.706 256.739 195.688 256.288C193.281 255.923 191.638 255.407 190.596 254.118C190.102 253.549 189.296 253.946 189.543 254.698Z"
                      fill="#09D642"
                    />
                  </g>
                  {/* 10 */}
                  <text
                    x="30" // adjust based on placement
                    y="198" // adjust based on placement
                    fill="#3C3C43"
                    fillOpacity="0.18"
                    fontSize="16"
                    fontWeight="bold"
                  >
                    0°
                  </text>
                  {/* 30 */}
                  <text
                    x="345" // Adjust X as needed for alignment
                    y="198" // Adjust Y as needed for baseline
                    fill="#3C3C43"
                    fillOpacity="0.18"
                    fontSize="16"
                    fontWeight="bold"
                  >
                    {maxUserTemp}°
                  </text>

                  {/* 20 */}
                  <text
                    x="183" // Adjust as needed for position
                    y="41" // Align with baseline
                    fill="#3C3C43"
                    fillOpacity="0.18"
                    fontSize="16"
                    fontWeight="bold"
                  >
                    {maxUserTemp / 2}°
                  </text>
                  {/* ticks */}
                  <defs>
                    <filter
                      id="filter0_i_2_529"
                      x="57"
                      y="55"
                      width="276"
                      height="138"
                      filterUnits="userSpaceOnUse"
                      colorInterpolationFilters="sRGB"
                    >
                      {/* ticks bg */}
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="BackgroundImageFix"
                        result="shape"
                      />
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                      />
                      <feOffset dy="1" />
                      <feComposite
                        in2="hardAlpha"
                        operator="arithmetic"
                        k2="-1"
                        k3="1"
                      />
                      <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0.556863 0 0 0 0 0.607843 0 0 0 0 0.682353 0 0 0 0.5 0"
                      />
                      <feBlend
                        mode="normal"
                        in2="shape"
                        result="effect1_innerShadow_2_529"
                      />
                    </filter>
                    {/* // ticks start from 10 */}
                    <filter
                      id="filter1_i_2_529"
                      x="57"
                      y="192"
                      width="10"
                      height="2"
                      filterUnits="userSpaceOnUse"
                      colorInterpolationFilters="sRGB"
                    >
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="BackgroundImageFix"
                        result="shape"
                      />
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                      />
                      <feOffset dy="1" />
                      <feComposite
                        in2="hardAlpha"
                        operator="arithmetic"
                        k2="-1"
                        k3="1"
                      />
                      <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0.556863 0 0 0 0 0.607843 0 0 0 0 0.682353 0 0 0 0.5 0"
                      />
                      <feBlend
                        mode="normal"
                        in2="shape"
                        result="effect1_innerShadow_2_529"
                      />
                    </filter>
                    <filter
                      id="filter2_i_2_529"
                      x="323"
                      y="192"
                      width="10"
                      height="2"
                      filterUnits="userSpaceOnUse"
                      colorInterpolationFilters="sRGB"
                    >
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="BackgroundImageFix"
                        result="shape"
                      />
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                      />
                      <feOffset dy="1" />
                      <feComposite
                        in2="hardAlpha"
                        operator="arithmetic"
                        k2="-1"
                        k3="1"
                      />
                      <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0.556863 0 0 0 0 0.607843 0 0 0 0 0.682353 0 0 0 0.5 0"
                      />
                      <feBlend
                        mode="normal"
                        in2="shape"
                        result="effect1_innerShadow_2_529"
                      />
                    </filter>
                    <filter
                      id="filter3_di_2_529"
                      x="42"
                      y="55"
                      width="306"
                      height="306"
                      filterUnits="userSpaceOnUse"
                      colorInterpolationFilters="sRGB"
                    >
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                      />
                      <feOffset dy="15" />
                      <feGaussianBlur stdDeviation="15" />
                      <feComposite in2="hardAlpha" operator="out" />
                      <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0.556863 0 0 0 0 0.607843 0 0 0 0 0.682353 0 0 0 0.5 0"
                      />
                      <feBlend
                        mode="normal"
                        in2="BackgroundImageFix"
                        result="effect1_dropShadow_2_529"
                      />
                      <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect1_dropShadow_2_529"
                        result="shape"
                      />
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                      />
                      <feMorphology
                        radius="1"
                        operator="erode"
                        in="SourceAlpha"
                        result="effect2_innerShadow_2_529"
                      />
                      <feOffset dy="3" />
                      <feGaussianBlur stdDeviation="4" />
                      <feComposite
                        in2="hardAlpha"
                        operator="arithmetic"
                        k2="-1"
                        k3="1"
                      />
                      <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0.254902 0 0 0 0 0.270588 0 0 0 0 0.364706 0 0 0 0.1 0"
                      />
                      <feBlend
                        mode="normal"
                        in2="shape"
                        result="effect2_innerShadow_2_529"
                      />
                    </filter>
                    <filter
                      id="filter4_ddi_2_529"
                      x="35"
                      y="64"
                      width="320"
                      height="320"
                      filterUnits="userSpaceOnUse"
                      colorInterpolationFilters="sRGB"
                    >
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                      />
                      <feOffset dy="31" />
                      <feGaussianBlur stdDeviation="30" />
                      <feComposite in2="hardAlpha" operator="out" />
                      <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                      />
                      <feBlend
                        mode="normal"
                        in2="BackgroundImageFix"
                        result="effect1_dropShadow_2_529"
                      />
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                      />
                      <feOffset dy="8" />
                      <feGaussianBlur stdDeviation="7.5" />
                      <feComposite in2="hardAlpha" operator="out" />
                      <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0.556863 0 0 0 0 0.607843 0 0 0 0 0.682353 0 0 0 0.5 0"
                      />
                      <feBlend
                        mode="normal"
                        in2="effect1_dropShadow_2_529"
                        result="effect2_dropShadow_2_529"
                      />
                      <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect2_dropShadow_2_529"
                        result="shape"
                      />
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                      />
                      <feOffset dx="3" dy="3" />
                      <feGaussianBlur stdDeviation="4" />
                      <feComposite
                        in2="hardAlpha"
                        operator="arithmetic"
                        k2="-1"
                        k3="1"
                      />
                      <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"
                      />
                      <feBlend
                        mode="normal"
                        in2="shape"
                        result="effect3_innerShadow_2_529"
                      />
                    </filter>
                    <filter
                      id="filter5_i_2_529"
                      x="166.376"
                      y="185.77"
                      width="58.0278"
                      height="41.19"
                      filterUnits="userSpaceOnUse"
                      colorInterpolationFilters="sRGB"
                    >
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="BackgroundImageFix"
                        result="shape"
                      />
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                      />
                      <feOffset dy="1.5" />
                      <feGaussianBlur stdDeviation="0.75" />
                      <feComposite
                        in2="hardAlpha"
                        operator="arithmetic"
                        k2="-1"
                        k3="1"
                      />
                      <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0.556863 0 0 0 0 0.607843 0 0 0 0 0.682353 0 0 0 0.25 0"
                      />
                      <feBlend
                        mode="normal"
                        in2="shape"
                        result="effect1_innerShadow_2_529"
                      />
                    </filter>
                    <filter
                      id="filter6_i_2_529"
                      x="183.194"
                      y="246.685"
                      width="23.6006"
                      height="22.6729"
                      filterUnits="userSpaceOnUse"
                      colorInterpolationFilters="sRGB"
                    >
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="BackgroundImageFix"
                        result="shape"
                      />
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                      />
                      <feOffset dy="1.5" />
                      <feGaussianBlur stdDeviation="0.75" />
                      <feComposite
                        in2="hardAlpha"
                        operator="arithmetic"
                        k2="-1"
                        k3="1"
                      />
                      <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.6 0"
                      />
                      <feBlend
                        mode="overlay"
                        in2="shape"
                        result="effect1_innerShadow_2_529"
                      />
                    </filter>
                    <linearGradient
                      id="paint0_linear_2_529"
                      x1="153.5"
                      y1="81"
                      x2="253.5"
                      y2="299.5"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#DEE2E7" />
                      <stop offset="1" stopColor="#DBE0E7" />
                    </linearGradient>
                    <linearGradient
                      id="paint1_linear_2_529"
                      x1="119"
                      y1="102"
                      x2="247.5"
                      y2="297"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="white" stopOpacity="0.5" />
                      <stop offset="1" stopColor="#F6F1F1" />
                    </linearGradient>
                    <linearGradient
                      id="paint2_linear_2_529"
                      x1="195"
                      y1="80.5"
                      x2="195"
                      y2="303"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#3E455B" />
                      <stop offset="1" stopColor="#A0A4E0" />
                    </linearGradient>
                    <linearGradient
                      id="paint3_linear_2_529"
                      x1="151.364"
                      y1="103"
                      x2="240.455"
                      y2="283"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#F5F5F9" />
                      <stop offset="1" stopColor="#E4E8EE" />
                    </linearGradient>
                    <linearGradient
                      id="paint4_linear_2_529"
                      x1="140.455"
                      y1="124.818"
                      x2="245"
                      y2="277.545"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="white" />
                      <stop offset="1" stopColor="#C0C5CD" />
                    </linearGradient>
                    <linearGradient
                      id="paint5_linear_2_529"
                      x1="153"
                      y1="120.5"
                      x2="239.5"
                      y2="264"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#DDE1E7" />
                      <stop offset="1" stopColor="#FAFBFC" />
                    </linearGradient>
                    <linearGradient
                      id="paint6_linear_2_529"
                      x1="207"
                      y1="124.5"
                      x2="215.5"
                      y2="133.5"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#CCCFD3" />
                      <stop offset="1" stopColor="#FAFBFC" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
          
              <div className="flex gap-2">
                <button
                  onClick={decreaseUserTemp}
                  className="px-2 py-2 rounded"
                >
                  <FaMinus className="text-2xl" />
                </button>
                <p className="px-2 py-2 text-xl">{maxUserTemp}</p>
                <button
                  onClick={increaseUserTemp}
                  className="px-2 py-2 rounded"
                >
                  <FaPlus className="text-2xl" />
                </button>
              </div>
            </div>

            {/* ⚙️ Machine Temp Control */}
            <div className="flex flex-col items-center pt-10 h-[1/2]">
              <div className="w-full h-[260px]  flex items-center justify-center">
                <svg
                  width="380"
                  height="330"
                  viewBox="0 0 390 384"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g filter="url(#filter0_i_2_529)">
                    {/* ticks UI */}
                    <path
                      d="M328 193C328 119.546 268.454 60 195 60C121.546 60 62 119.546 62 193"
                      stroke="#BAC4CF"
                      strokeWidth="10"
                      strokeDasharray="2 19"
                    />
                  </g>
                  <g filter="url(#filter1_i_2_529)">
                    <path d="M67 193H57" stroke="#B7C1CB" strokeWidth="2" />
                  </g>
                  <g filter="url(#filter2_i_2_529)">
                    <path d="M333 193H323" stroke="#B7C1CB" strokeWidth="2" />
                  </g>
                  <g filter="url(#filter3_di_2_529)">
                    {/* that's the circle where progress bar under this  */}
                    <circle
                      cx="195"
                      cy="193"
                      r="122"
                      fill="url(#paint0_linear_2_529)"
                      shapeRendering="crispEdges"
                    />
                    {/* upper areas of above circle */}
                    <circle
                      cx="195"
                      cy="193"
                      r="122.5"
                      stroke="url(#paint1_linear_2_529)"
                      shapeRendering="crispEdges"
                    />
                  </g>
                  {/* percentage increase decrease bar */}
                  {/* Full background arc */}
                  <path
                    d={arcPath}
                    fill="none"
                    stroke="lightgray"
                    strokeWidth="8"
                  />
                  {/* Progress arc */}
                  <path
                    d={arcPath}
                    fill="none"
                    stroke="black"
                    strokeWidth="8"
                    strokeDasharray={`${progressLengthMachine} ${
                      arcLength - progressLengthMachine
                    }`}
                    strokeDashoffset="0"
                    strokeLinecap="round"
                  />
                  {/* just below design look white */}
                  <g filter="url(#filter4_ddi_2_529)">
                    <circle
                      cx="195"
                      cy="193"
                      r="100"
                      fill="url(#paint3_linear_2_529)"
                    />
                    <circle
                      cx="195"
                      cy="193"
                      r="99.5"
                      stroke="url(#paint4_linear_2_529)"
                    />
                  </g>
                  {/* just above circle of written value */}
                  <circle
                    cx="195"
                    cy="193"
                    r="86"
                    fill="url(#paint5_linear_2_529)"
                  />
                  {/* dot value that also represent value */}
                  {/* <path
                    d="M207.484 122.202C208.165 118.335 211.865 115.721 215.655 116.748C215.871 116.807 216.087 116.866 216.302 116.926C220.084 117.985 221.923 122.125 220.529 125.795L220.172 126.735C218.975 129.887 215.454 131.441 212.203 130.546C208.952 129.65 206.724 126.512 207.309 123.192L207.484 122.202Z"
                    fill="url(#paint6_linear_2_529)"
                  /> */}
                  <g filter="url(#filter5_i_2_529)">
                    {/* wriiten value 22 */}
                    <text
                      x="176"
                      y="220"
                      fontFamily="Arial, sans-serif"
                      fontSize="40"
                      fill="#3C3C43"
                      fillOpacity="0.20"
                      id="temperatureText"
                    >
                      {machineTemp}
                    </text>
                  </g>
                  {/* Machine temp */}
                  <text
                    x="128"
                    y="170"
                    fontFamily="Arial, sans-serif"
                    fontSize="20"
                    fill="#3C3C43"
                    fontWeight="700"
                    fillOpacity="0.6"
                    id="modeText"
                  >
                    Machine Temp
                  </text>
                  <g filter="url(#filter6_i_2_529)">
                    {/* leves */}
                    <path
                      d="M183.194 251.905C183.194 260.166 188.189 265.602 195.806 265.602C198.566 265.602 200.93 264.678 202.573 263.099C203.046 264.227 203.325 265.494 203.766 266.912C203.959 267.535 204.432 267.857 204.99 267.857C205.989 267.857 206.795 266.934 206.795 265.859C206.795 264.592 205.678 262.583 204.324 260.606C204.786 259.564 205.033 258.404 205.033 257.147C205.033 252.389 201.166 248.94 195.849 248.94C194.044 248.94 192.271 249.435 190.359 249.435C188.759 249.435 187.48 248.94 186.406 247.727C185.515 246.685 183.903 246.846 183.538 248.35C183.259 249.424 183.194 251.314 183.194 251.905ZM189.543 254.698C190.155 256.567 192.218 257.631 194.957 258.265C198.491 259.07 199.963 259.726 201.177 261.004C199.984 262.347 198.104 263.142 195.806 263.142C189.575 263.142 185.654 258.802 185.654 251.905C185.654 251.508 185.665 251.046 185.708 250.702C185.719 250.487 185.837 250.466 185.987 250.562C187.158 251.4 188.823 251.895 190.359 251.895C191.552 251.895 192.626 251.744 193.582 251.615C194.431 251.486 195.15 251.4 195.849 251.4C199.802 251.4 202.573 253.785 202.573 257.147C202.573 257.631 202.52 258.093 202.423 258.522C200.897 257.427 198.706 256.739 195.688 256.288C193.281 255.923 191.638 255.407 190.596 254.118C190.102 253.549 189.296 253.946 189.543 254.698Z"
                      fill="#09D642"
                    />
                  </g>
                  {/* 10 */}
                  <text
                    x="30" // adjust based on placement
                    y="198" // adjust based on placement
                    fill="#3C3C43"
                    fillOpacity="0.18"
                    fontSize="16"
                    fontWeight="bold"
                  >
                    0°
                  </text>
                  {/* 30 */}
                  <text
                    x="345" // Adjust X as needed for alignment
                    y="198" // Adjust Y as needed for baseline
                    fill="#3C3C43"
                    fillOpacity="0.18"
                    fontSize="16"
                    fontWeight="bold"
                  >
                    {maxMachineTemp}°
                  </text>

                  {/* 20 */}
                  <text
                    x="183" // Adjust as needed for position
                    y="41" // Align with baseline
                    fill="#3C3C43"
                    fillOpacity="0.18"
                    fontSize="16"
                    fontWeight="bold"
                  >
                    {maxMachineTemp / 2}°
                  </text>
                  {/* ticks */}
                  <defs>
                    <filter
                      id="filter0_i_2_529"
                      x="57"
                      y="55"
                      width="276"
                      height="138"
                      filterUnits="userSpaceOnUse"
                      colorInterpolationFilters="sRGB"
                    >
                      {/* ticks bg */}
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="BackgroundImageFix"
                        result="shape"
                      />
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                      />
                      <feOffset dy="1" />
                      <feComposite
                        in2="hardAlpha"
                        operator="arithmetic"
                        k2="-1"
                        k3="1"
                      />
                      <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0.556863 0 0 0 0 0.607843 0 0 0 0 0.682353 0 0 0 0.5 0"
                      />
                      <feBlend
                        mode="normal"
                        in2="shape"
                        result="effect1_innerShadow_2_529"
                      />
                    </filter>
                    {/* // ticks start from 10 */}
                    <filter
                      id="filter1_i_2_529"
                      x="57"
                      y="192"
                      width="10"
                      height="2"
                      filterUnits="userSpaceOnUse"
                      colorInterpolationFilters="sRGB"
                    >
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="BackgroundImageFix"
                        result="shape"
                      />
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                      />
                      <feOffset dy="1" />
                      <feComposite
                        in2="hardAlpha"
                        operator="arithmetic"
                        k2="-1"
                        k3="1"
                      />
                      <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0.556863 0 0 0 0 0.607843 0 0 0 0 0.682353 0 0 0 0.5 0"
                      />
                      <feBlend
                        mode="normal"
                        in2="shape"
                        result="effect1_innerShadow_2_529"
                      />
                    </filter>
                    <filter
                      id="filter2_i_2_529"
                      x="323"
                      y="192"
                      width="10"
                      height="2"
                      filterUnits="userSpaceOnUse"
                      colorInterpolationFilters="sRGB"
                    >
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="BackgroundImageFix"
                        result="shape"
                      />
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                      />
                      <feOffset dy="1" />
                      <feComposite
                        in2="hardAlpha"
                        operator="arithmetic"
                        k2="-1"
                        k3="1"
                      />
                      <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0.556863 0 0 0 0 0.607843 0 0 0 0 0.682353 0 0 0 0.5 0"
                      />
                      <feBlend
                        mode="normal"
                        in2="shape"
                        result="effect1_innerShadow_2_529"
                      />
                    </filter>
                    <filter
                      id="filter3_di_2_529"
                      x="42"
                      y="55"
                      width="306"
                      height="306"
                      filterUnits="userSpaceOnUse"
                      colorInterpolationFilters="sRGB"
                    >
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                      />
                      <feOffset dy="15" />
                      <feGaussianBlur stdDeviation="15" />
                      <feComposite in2="hardAlpha" operator="out" />
                      <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0.556863 0 0 0 0 0.607843 0 0 0 0 0.682353 0 0 0 0.5 0"
                      />
                      <feBlend
                        mode="normal"
                        in2="BackgroundImageFix"
                        result="effect1_dropShadow_2_529"
                      />
                      <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect1_dropShadow_2_529"
                        result="shape"
                      />
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                      />
                      <feMorphology
                        radius="1"
                        operator="erode"
                        in="SourceAlpha"
                        result="effect2_innerShadow_2_529"
                      />
                      <feOffset dy="3" />
                      <feGaussianBlur stdDeviation="4" />
                      <feComposite
                        in2="hardAlpha"
                        operator="arithmetic"
                        k2="-1"
                        k3="1"
                      />
                      <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0.254902 0 0 0 0 0.270588 0 0 0 0 0.364706 0 0 0 0.1 0"
                      />
                      <feBlend
                        mode="normal"
                        in2="shape"
                        result="effect2_innerShadow_2_529"
                      />
                    </filter>
                    <filter
                      id="filter4_ddi_2_529"
                      x="35"
                      y="64"
                      width="320"
                      height="320"
                      filterUnits="userSpaceOnUse"
                      colorInterpolationFilters="sRGB"
                    >
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                      />
                      <feOffset dy="31" />
                      <feGaussianBlur stdDeviation="30" />
                      <feComposite in2="hardAlpha" operator="out" />
                      <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                      />
                      <feBlend
                        mode="normal"
                        in2="BackgroundImageFix"
                        result="effect1_dropShadow_2_529"
                      />
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                      />
                      <feOffset dy="8" />
                      <feGaussianBlur stdDeviation="7.5" />
                      <feComposite in2="hardAlpha" operator="out" />
                      <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0.556863 0 0 0 0 0.607843 0 0 0 0 0.682353 0 0 0 0.5 0"
                      />
                      <feBlend
                        mode="normal"
                        in2="effect1_dropShadow_2_529"
                        result="effect2_dropShadow_2_529"
                      />
                      <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect2_dropShadow_2_529"
                        result="shape"
                      />
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                      />
                      <feOffset dx="3" dy="3" />
                      <feGaussianBlur stdDeviation="4" />
                      <feComposite
                        in2="hardAlpha"
                        operator="arithmetic"
                        k2="-1"
                        k3="1"
                      />
                      <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"
                      />
                      <feBlend
                        mode="normal"
                        in2="shape"
                        result="effect3_innerShadow_2_529"
                      />
                    </filter>
                    <filter
                      id="filter5_i_2_529"
                      x="166.376"
                      y="185.77"
                      width="58.0278"
                      height="41.19"
                      filterUnits="userSpaceOnUse"
                      colorInterpolationFilters="sRGB"
                    >
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="BackgroundImageFix"
                        result="shape"
                      />
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                      />
                      <feOffset dy="1.5" />
                      <feGaussianBlur stdDeviation="0.75" />
                      <feComposite
                        in2="hardAlpha"
                        operator="arithmetic"
                        k2="-1"
                        k3="1"
                      />
                      <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0.556863 0 0 0 0 0.607843 0 0 0 0 0.682353 0 0 0 0.25 0"
                      />
                      <feBlend
                        mode="normal"
                        in2="shape"
                        result="effect1_innerShadow_2_529"
                      />
                    </filter>
                    <filter
                      id="filter6_i_2_529"
                      x="183.194"
                      y="246.685"
                      width="23.6006"
                      height="22.6729"
                      filterUnits="userSpaceOnUse"
                      colorInterpolationFilters="sRGB"
                    >
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="BackgroundImageFix"
                        result="shape"
                      />
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                      />
                      <feOffset dy="1.5" />
                      <feGaussianBlur stdDeviation="0.75" />
                      <feComposite
                        in2="hardAlpha"
                        operator="arithmetic"
                        k2="-1"
                        k3="1"
                      />
                      <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.6 0"
                      />
                      <feBlend
                        mode="overlay"
                        in2="shape"
                        result="effect1_innerShadow_2_529"
                      />
                    </filter>
                    <linearGradient
                      id="paint0_linear_2_529"
                      x1="153.5"
                      y1="81"
                      x2="253.5"
                      y2="299.5"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#DEE2E7" />
                      <stop offset="1" stopColor="#DBE0E7" />
                    </linearGradient>
                    <linearGradient
                      id="paint1_linear_2_529"
                      x1="119"
                      y1="102"
                      x2="247.5"
                      y2="297"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="white" stopOpacity="0.5" />
                      <stop offset="1" stopColor="#F6F1F1" />
                    </linearGradient>
                    <linearGradient
                      id="paint2_linear_2_529"
                      x1="195"
                      y1="80.5"
                      x2="195"
                      y2="303"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#3E455B" />
                      <stop offset="1" stopColor="#A0A4E0" />
                    </linearGradient>
                    <linearGradient
                      id="paint3_linear_2_529"
                      x1="151.364"
                      y1="103"
                      x2="240.455"
                      y2="283"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#F5F5F9" />
                      <stop offset="1" stopColor="#E4E8EE" />
                    </linearGradient>
                    <linearGradient
                      id="paint4_linear_2_529"
                      x1="140.455"
                      y1="124.818"
                      x2="245"
                      y2="277.545"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="white" />
                      <stop offset="1" stopColor="#C0C5CD" />
                    </linearGradient>
                    <linearGradient
                      id="paint5_linear_2_529"
                      x1="153"
                      y1="120.5"
                      x2="239.5"
                      y2="264"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#DDE1E7" />
                      <stop offset="1" stopColor="#FAFBFC" />
                    </linearGradient>
                    <linearGradient
                      id="paint6_linear_2_529"
                      x1="207"
                      y1="124.5"
                      x2="215.5"
                      y2="133.5"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#CCCFD3" />
                      <stop offset="1" stopColor="#FAFBFC" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={decreaseMachineTemp}
                  className="px-2 py-2 rounded"
                >
                  <FaMinus className="text-2xl" />
                </button>
                <p className="px-2 py-2 text-xl">{maxMachineTemp}</p>
                <button
                  onClick={increaseMachineTemp}
                  className="px-2 py-2 rounded"
                >
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
