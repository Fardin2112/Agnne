import React, { useContext, useState, useEffect, useRef } from "react";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { AppContext } from "../context/AppContext";
import { HiOutlineLightBulb } from "react-icons/hi";

const LeftController = () => {
  const {
    isDarkMode,
    blueLight,
    setBlueLight,
    redLight,
    setRedLight,
    userTemp,
    setUserTemp,
    machineTemp,
    setMachineTemp,
    maxUserTemp,
    setMaxUserTemp,
    maxMachineTemp,
    setMaxMachineTemp,
  } = useContext(AppContext);

  const socketRef = useRef(null);
  const reconnectIntervalRef = useRef(null);

  // Auto-Reconnect WebSocket Setup
  useEffect(() => {
    let isMounted = true;

    const connectWebSocket = () => {
      const ws = new WebSocket("ws://localhost:3000");
      socketRef.current = ws;

      ws.onopen = () => {
        console.log("✅ Connected to WebSocket server");
        clearInterval(reconnectIntervalRef.current);
      };

      ws.onmessage = (event) => {
        const [key, value] = event.data.split("=");
        switch (key) {
          case "TEMP_USER":
            setUserTemp(parseFloat(value));
            break;
          case "TEMP_MACHINE":
            setMachineTemp(parseFloat(value));
            break;
          case "BLUE_INTENSITY":
            setBlueLight(parseFloat(value));
            break;
          case "RED_INTENSITY":
            setRedLight(parseFloat(value));
            break;
          default:
            break;
        }
      };

      ws.onclose = () => {
        console.warn("⚠️ WebSocket disconnected. Attempting to reconnect...");
        reconnectIntervalRef.current = setInterval(() => {
          if (!socketRef.current || socketRef.current.readyState === WebSocket.CLOSED) {
            connectWebSocket();
          }
        }, 2000);
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        ws.close();
      };
    };

    connectWebSocket();

    return () => {
      isMounted = false;
      clearInterval(reconnectIntervalRef.current);
      socketRef.current?.close();
    };
  }, [setUserTemp, setMachineTemp, setBlueLight, setRedLight]);

  // Send message via WebSocket
  const sendWsMessage = (msg) => {
    const ws = socketRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(msg);
    }
  };

  // Blue light slider
  const handleBlueLightChange = (e) => {
    const newValue = Number(e.target.value);
    setBlueLight(newValue);
    sendWsMessage(`BLUE_INTENSITY=${newValue}`);
  };

  // Red light slider
  const handleRedLightChange = (e) => {
    const newValue = Number(e.target.value);
    setRedLight(newValue);
    sendWsMessage(`RED_INTENSITY=${newValue}`);
  };

  // Max temp handlers
  const increaseUserTemp = () => setMaxUserTemp((prev) => Math.min(prev + 1, 50));
  const decreaseUserTemp = () => setMaxUserTemp((prev) => Math.max(prev - 1, 0));
  const increaseMachineTemp = () => setMaxMachineTemp((prev) => Math.min(prev + 1, 50));
  const decreaseMachineTemp = () => setMaxMachineTemp((prev) => Math.max(prev - 1, 0));

  const userTempPercentage = maxUserTemp === 0 ? 0 : (userTemp / maxUserTemp) * 100;
  const machineTempPercentage = maxMachineTemp === 0 ? 0 : (machineTemp / maxMachineTemp) * 100;
  const circumference = 376.99;

  return (
    <div className="flex justify-center items-center h-full w-full">
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 w-full h-full">
        {/* Blue Light Slider */}
        <div className="flex flex-col items-center pt-1">
          <div className="flex flex-col h-full items-center">
            <input
              type="range"
              min="0"
              max="100"
              value={blueLight}
              onChange={handleBlueLightChange}
              style={{
                background: `linear-gradient(to right, #3b82f6 ${blueLight}%, #e5e7eb ${blueLight}%)`,
              }}
              className="w-[200px] mt-24 h-4 appearance-none bg-gray-300 rounded-full outline-none transform -rotate-90 origin-center cursor-pointer
                [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-10 [&::-webkit-slider-thumb]:bg-blue-300 [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer"
            />
          </div>
          <div className="flex gap-2 items-center pt-1 text-xl font-bold text-blue-500">
            <HiOutlineLightBulb className="text-blue-400 text-2xl" />
            <p>{blueLight}%</p>
          </div>
        </div>

        {/* Red Light Slider */}
        <div className="flex flex-col h-full pt-1 items-center">
          <div className="flex flex-col h-full items-center">
            <input
              type="range"
              min="0"
              max="100"
              value={redLight}
              onChange={handleRedLightChange}
              style={{
                background: `linear-gradient(to right, #ef4444 ${redLight}%, #e5e7eb ${redLight}%)`,
              }}
              className="w-[200px] mt-24 h-4 appearance-none bg-gray-300 rounded-full outline-none transform -rotate-90 origin-center cursor-pointer
                [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-10 [&::-webkit-slider-thumb]:bg-red-300 [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer"
            />
          </div>
          <div className="flex gap-2 items-center pt-1 text-xl font-bold text-red-500">
            <HiOutlineLightBulb className="text-red-400 text-2xl" />
            <p>{redLight}%</p>
          </div>
        </div>

        {/* User Temperature Control */}
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
            <button onClick={decreaseUserTemp} className="px-3 py-1 rounded">
              <FaMinus />
            </button>
            <p>{maxUserTemp}</p>
            <button onClick={increaseUserTemp} className="px-3 py-1 rounded">
              <FaPlus />
            </button>
          </div>
        </div>

        {/* Machine Temperature Control */}
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
