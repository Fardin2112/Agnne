import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';

function Stats() {
  const { isDarkMode, totalSession, totalRunningHours, powerUsage } = useContext(UserContext);

  const handleClick = async () => {
    console.log("Refresh state is : on work processing");
  };

  return (
    <div className={`min-h-screen pt-10 pb-8 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} flex flex-col items-start space-y-6 p-4 transition-colors duration-300`}>
      {/* Total Sessions Card */}
      <div className={`w-full max-w-md p-6 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} hover:bg-opacity-90 transition-all duration-200`}>
        <p className="text-xl font-semibold">Total Sessions</p>
        <p className="text-2xl font-bold mt-2">{totalSession}</p>
      </div>

      {/* Total Running Hours Card */}
      <div className={`w-full max-w-md p-6 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} hover:bg-opacity-90 transition-all duration-200`}>
        <p className="text-xl font-semibold">Total Running Hours</p>
        <p className="text-2xl font-bold mt-2">{totalRunningHours}</p>
      </div>

      {/* Power Usage Card */}
      <div className={`w-full max-w-md p-6 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} hover:bg-opacity-90 transition-all duration-200`}>
        <p className="text-xl font-semibold">Power Usage</p>
        <p className="text-2xl font-bold mt-2">{powerUsage} W</p>
      </div>

      {/* Refresh Button */}
      <button
        onClick={handleClick}
        className={`mt-6 px-6 py-2 rounded-lg font-semibold text-lg ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors duration-200`}
      >
        Refresh Stats
      </button>
    </div>
  );
}

export default Stats;