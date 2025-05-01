import React, { useState, useEffect, useContext } from "react";
import LightSlider from "./LightSlider";
import LightPreview from "./LightPreview";
import LightPresets from "./LightPresets";
import { Save, RotateCcw } from "lucide-react";
import { UserContext } from "../context/UserContext";

const LightControlPanel = () => {
  // const [blueIntensity, setBlueIntensity] = useState(50);
  // const [redIntensity, setRedIntensity] = useState(50);
  const [ambientColor, setAmbientColor] = useState("");

  const {
    blueLight,
    setBlueLight,
    redLight,
    setRedLight,
    sendWsMessage,
    isDarkMode,
  } = useContext(UserContext);

  useEffect(() => {
    const red = Math.round((redLight / 100) * 255);
    const blue = Math.round((blueLight / 100) * 255);
    setAmbientColor(`rgba(${red}, 0, ${blue}, 0.8)`);
  }, [blueLight, redLight]);

  const resetControls = () => {
    setBlueLight(50);
    setRedLight(50);
  };

  const handlePresetSelect = (preset) => {
    setBlueLight(preset.blue);
    setRedLight(preset.red);
  };

  // 🔵 Handle blue light slider change
  const handleBlueLightChange = (newValue) => {
    // const newValue = Number(e.target.value);
    setBlueLight(newValue);
    sendWsMessage(`BLUE_INTENSITY=${newValue}`);
  };

  // 🔴 Handle red light slider change
  const handleRedLightChange = (newValue) => {
    // const newValue = Number(e.target.value);
    setRedLight(newValue);
    sendWsMessage(`RED_INTENSITY=${newValue}`);
  };

  return (
    <div className="flex flex-col rounded-md shadow-md bg-[#F4F7FB] h-full w-full pt-10">
      <div className="flex justify-evenly h-full w-full ">
        <LightSlider
          color="blue"
          value={blueLight}
          onChange={handleBlueLightChange}
        />
        {/* info block */}
        <div className="flex flex-col text-gray-700 pt-16">
          <div className="text-base text-gray-700">LIGHT INTENSITY</div>
          <div className="text-5xl font-bold text-white">
            <span className="text-blue-400">
              {blueLight}
              <span className="text-base text-gray-400 pr-2">%</span>
            </span>
            <span className="text-red-400">
              {redLight}
              <span className="text-base text-gray-400">%</span>
            </span>
          </div>
        </div>
        <LightSlider
          color="red"
          value={redLight}
          onChange={handleRedLightChange}
          // reverse // <-- this flips the layout
        />
      </div>
      <div className="px-10 pb-3">
        <LightPresets />
      </div>
    </div>
  );
};

export default LightControlPanel;
