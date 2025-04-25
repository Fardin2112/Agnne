import React, { useState, useEffect, useContext } from "react";
import LightSlider from "./LightSlider";
import LightPreview from "./LightPreview";
import LightPresets from "./LightPresets";
import { Save, RotateCcw } from "lucide-react";
import { UserContext } from "../context/UserContext";

const LightControlPanel = () => {
  const [blueIntensity, setBlueIntensity] = useState(50);
  const [redIntensity, setRedIntensity] = useState(50);
  const [ambientColor, setAmbientColor] = useState("");

  const { blueLight, setBlueLight, redLight, setRedLight } =
    useContext(UserContext);

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

  return (
    <div
      className="w-full max-w-4xl relative overflow-hidden rounded-xl shadow-2xl"
      style={{
        background:
          "radial-gradient(circle at center, #1a1a2e 0%, #16213e 100%)",
        boxShadow: `0 0 100px ${ambientColor}`,
      }}
    >
      <div className="p-6 md:p-10 backdrop-blur-md backdrop-filter bg-opacity-20 bg-gray-900 rounded-xl flex flex-col gap-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
          Light Control System
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <LightSlider
              color="blue"
              value={blueLight}
              onChange={setBlueLight}
            />

            <LightSlider
              color="red"
              value={redLight}
              onChange={setRedLight}
            />
          </div>

          <LightPreview
            blueLight={blueLight}
            redLight={redLight}
          />
        </div>

        <LightPresets onSelect={handlePresetSelect} />

        <div className="flex justify-between">
          <button
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center gap-2 transition-all duration-300 text-sm"
            onClick={resetControls}
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>

          <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-500 hover:to-red-500 rounded-lg flex items-center gap-2 transition-all duration-300 text-sm">
            <Save className="w-4 h-4" />
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};

export default LightControlPanel;
