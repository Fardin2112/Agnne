import React, { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';

function Setting() {
  const { isDarkMode, toggleDarkMode, powerUsage } = useContext(UserContext);
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  const toggleVoiceCommands = () => {
    setVoiceEnabled(prev => !prev);
    console.log(`Voice commands ${!voiceEnabled ? 'enabled' : 'disabled'}`);
  };

  return (
    <div className={`min-h-screen w-full pt-16 pb-8 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} flex flex-col items-center justify-start transition-colors duration-300`}>
      {/* Settings Container */}
      <div className="grid grid-cols-2 gap-8 gap-y-10 px-10 w-full">
        {/* Dark Mode Card */}
        <div className={`flex items-center justify-between h-[200px] p-6 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} hover:bg-opacity-90 transition-all duration-200`}>
            <span className="text-lg font-semibold">Dark Mode</span>
            <button
              onClick={toggleDarkMode}
              className={`relative w-12 h-6 rounded-full p-1 transition-colors duration-300 ${
                isDarkMode ? 'bg-[#4169e1]' : 'bg-gray-400'
              } focus:outline-none`}
            >
              <span
                className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transform transition-transform duration-300 ${
                  isDarkMode ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
        </div>

        {/* Voice Commands Card */}
        <div className={`flex items-center justify-between p-6 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} hover:bg-opacity-90 transition-all duration-200`}>
            <span className="text-lg font-semibold">Voice Commands</span>
            <button
              onClick={toggleVoiceCommands}
              className={`relative w-12 shadow-md h-6 rounded-full p-1 transition-colors duration-300 ${
                voiceEnabled ? 'bg-[#32cd32 ]' : 'bg-gray-400'
              } focus:outline-none`}
            >
              <span
                className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transform transition-transform duration-300 ${
                  voiceEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
        </div>

        {/* Power Consumption Card */}
        <div className={`flex flex-col justify-center h-[200px] p-6 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} hover:bg-opacity-90 transition-all duration-200`}>
          <h2 className="text-lg font-semibold mb-4">Power Consumption</h2>
          <p className="text-2xl font-bold text-center">
            {powerUsage} W
          </p>
        </div>
      </div>

    </div>
  );
}

export default Setting;