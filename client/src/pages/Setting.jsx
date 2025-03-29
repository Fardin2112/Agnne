import React, { useContext, useState } from 'react';
import { AppContext } from "../context/AppContext";

function Setting() {
  const { isDarkMode, toggleDarkMode } = useContext(AppContext);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const powerConsumption = "24.5 W";

  const toggleVoiceCommands = () => {
    setVoiceEnabled(prev => !prev);
    console.log(`Voice commands ${!voiceEnabled ? 'enabled' : 'disabled'}`);
  };

  return (
    <div className={`h-full pt-12 ${isDarkMode ? 'bg-black : text-white' : 'bg-white text-black'}`}>
      
      {/* Dark Theme Section */}
      <div className="mb-8">
        <div className="space-y-4">
          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold">Dark Mode</span>
            <button
              onClick={toggleDarkMode}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${
                isDarkMode ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              <div
                className={`bg-white rounded-full w-4 h-4 transform transition-transform ${
                  isDarkMode ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Voice Commands Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold">Voice Commands</span>
            <button
              onClick={toggleVoiceCommands}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${
                voiceEnabled ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <div
                className={`bg-white rounded-full w-4 h-4 transform transition-transform ${
                  voiceEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Power Consumption */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4">POWER CONSUMPTION</h2>
        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
          <span className="text-lg font-bold">{powerConsumption}</span>
        </div>
      </div>
    
    </div>
  );
}

export default Setting;