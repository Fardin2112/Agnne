import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { FaUser } from "react-icons/fa";
import FanSlider from "./Fanslider";
import axios from "axios";
import { IoMdSettings } from "react-icons/io";
import { MdOutlineHdrAuto } from "react-icons/md";

function FanController() {
  const {
    isDarkMode,
    userFanSpeed,
    setUserFanSpeed,
    machineFanSpeed,
    setMachineFanSpeed,
    sendWsMessage,
  } = useContext(UserContext);

  // Send fan speed to server
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

  // Handle user fan speed change
  const handleUserfan = (newValue) => {
    setUserFanSpeed(newValue);
    sendFanSpeed("user", newValue);
  };

  // Handle machine fan speed change
  const handleMachinefan = (newValue) => {
    setMachineFanSpeed(newValue);
    sendFanSpeed("machine", newValue);
  };

  // Auto Mode Handler for User Fan
  const handleUserAuto = () => {
    setUserFanSpeed(-1); // assuming -1 means Auto Mode
    sendFanSpeed("user", "auto");
  };

  // Auto Mode Handler for Machine Fan
  const handleMachineAuto = () => {
    setMachineFanSpeed(-1); // assuming -1 means Auto Mode
    sendFanSpeed("machine", "auto");
  };

  return (
    <div
      className={`w-full h-full flex flex-col items-center px-6 overflow-hidden ${
        isDarkMode ? "bg-gray-900" : "bg-[#EFF1F5]"
      }`}
    >
      {/* User Fan Control */}
      <div className="flex flex-col items-center w-full h-[49%] rounded-md shadow-md bg-[#F4F7FB]">
        <div className="flex justify-between w-full h-[80%]">
          <div className="pl-10">
            <h2 className="w-full flex py-5 gap-4 items-center text-2xl font-semibold text-gray-700 pb-6">
              <FaUser className="text-3xl" /> User Fan
            </h2>

            <div className="pl-15 pt-5">
            <span className="text-5xl">
                {userFanSpeed < 0 ? "Auto" : `${userFanSpeed}`}
                <span className="text-sm">%</span>
              </span>
              <div className="flex gap-2 items-center justify-center p-5 mt-6 rounded-md bg-gray-400" onClick={handleUserAuto}>
                Auto <MdOutlineHdrAuto className="text-lg"/>
              </div>
            </div>
          </div>
          <div className="flex justify-end items-start h-[300px] w-[50%]">
  <svg width="300" height="300" viewBox="0 0 200 200">
    <g transform="translate(0, -38)">
      {/* Dotted Arc with visible gap above solid arc */}
      <path
        d="M 200 211 A 61 61 0 0 1 200 49"
        fill="none"
        stroke="#444"
        strokeWidth="6"
        strokeDasharray="1,2"
      />
      
      {/* Foreground Solid Arc */}
      <path
        d="M 200 200 A 50 50 0 0 1 200 60"
        fill="none"
        stroke="#444"
        strokeWidth="12"
      />
      <path
        d="M 200 200 A 50 50 0 0 1 200 60"
        fill="none"
        stroke="red"
        strokeWidth="12"
      />
    </g>
  </svg>
</div>






        </div>

        <div className="bg-gray-400 flex w-[90%] h-10 items-center px-10">
        <input
            type="range"
            min="0"
            max="100"
            className="w-full accent-cyan-500"
            value={userFanSpeed < 0 ? 0 : userFanSpeed}
            onChange={(e) => handleUserfan(Number(e.target.value))}
          />
        </div>
      </div>

      {/* Machine Fan Control */}
      <div className="flex flex-col items-center w-full h-[49%] mt-2 rounded-md shadow-md bg-[#F4F7FB]">
        <div className="flex justify-between w-full h-[80%]">
          <div className="pl-10">
            <h2 className="w-full flex py-5 gap-4 items-center text-2xl font-semibold text-gray-700 pb-6">
              <IoMdSettings className="text-3xl" /> User Fan
            </h2>

            <div className="pl-15 pt-5">
            <span className="text-5xl">
                {machineFanSpeed < 0 ? "Auto" : `${machineFanSpeed}`}
                <span className="text-sm">%</span>
              </span>
              <div className="flex gap-2 items-center justify-center p-5 mt-6 rounded-md bg-gray-400" onClick={handleMachineAuto}>
                Auto <MdOutlineHdrAuto className="text-lg"/>
              </div>
            </div>
          </div>
          <div className="flex justify-end items-start h-[300px] w-[50%]">
  <svg width="300" height="300" viewBox="0 0 200 200">
    <g transform="translate(0, -38)">
      {/* Dotted Arc with visible gap above solid arc */}
      <path
        d="M 200 211 A 61 61 0 0 1 200 49"
        fill="none"
        stroke="#444"
        strokeWidth="6"
        strokeDasharray="1,2"
      />
      
      {/* Foreground Solid Arc */}
      <path
        d="M 200 200 A 50 50 0 0 1 200 60"
        fill="none"
        stroke="#444"
        strokeWidth="12"
      />
      <path
        d="M 200 200 A 50 50 0 0 1 200 60"
        fill="none"
        stroke="red"
        strokeWidth="12"
      />
    </g>
  </svg>
</div>






        </div>

        <div className="bg-gray-400 flex w-[90%] h-10 items-center px-10">
        <input
            type="range"
            min="0"
            max="100"
            className="w-full accent-cyan-500"
            value={machineFanSpeed < 0 ? 0 : machineFanSpeed}
            onChange={(e) => handleMachinefan(Number(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
}

export default FanController;
