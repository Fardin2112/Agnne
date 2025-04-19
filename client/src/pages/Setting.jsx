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
    <div className={`min-h-screen pt-16 pb-8 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} flex flex-col items-center justify-start transition-colors duration-300`}>
      {/* Header */}
      <h1 className="text-2xl font-bold mb-8 tracking-wide">Settings</h1>

      {/* Settings Container */}
      <div className="w-full max-w-md space-y-6">
        {/* Dark Mode Card */}
        <div className={`p-6 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} hover:bg-opacity-90 transition-all duration-200`}>
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">Dark Mode</span>
            <button
              onClick={toggleDarkMode}
              className={`relative w-12 h-6 rounded-full p-1 transition-colors duration-300 ${
                isDarkMode ? 'bg-blue-600' : 'bg-gray-400'
              } focus:outline-none`}
            >
              <span
                className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transform transition-transform duration-300 ${
                  isDarkMode ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Voice Commands Card */}
        <div className={`p-6 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} hover:bg-opacity-90 transition-all duration-200`}>
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">Voice Commands</span>
            <button
              onClick={toggleVoiceCommands}
              className={`relative w-12 h-6 rounded-full p-1 transition-colors duration-300 ${
                voiceEnabled ? 'bg-green-600' : 'bg-gray-400'
              } focus:outline-none`}
            >
              <span
                className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transform transition-transform duration-300 ${
                  voiceEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Power Consumption Card */}
        <div className={`p-6 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} hover:bg-opacity-90 transition-all duration-200`}>
          <h2 className="text-lg font-semibold mb-4">Power Consumption</h2>
          <div className="text-2xl font-bold text-center">
            {powerUsage} W
          </div>
        </div>
      </div>
    </div>
  );
}

export default Setting;