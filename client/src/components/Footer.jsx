import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { FaChartBar, FaDroplet, FaPowerOff } from "react-icons/fa6";
import { TiHome } from "react-icons/ti";
import { FaCog } from "react-icons/fa";
import { AppContext } from "../context/AppContext";

function Footer() {
  const { isDarkMode } = useContext(AppContext);
  const [showPopup, setShowPopup] = useState(false);

  const handleShutdown = () => {
    console.log("Shutting down...");
    setShowPopup(false);
    // Add shutdown logic here, like calling an API or executing a script
  };

  return (
    <>
      {/* Footer */}
      <div
        className={`h-[60px] flex justify-around items-center fixed bottom-0 left-0 w-full z-50 bg-opacity-80 backdrop-blur-md border-t border-opacity-20 ${
          isDarkMode ? "bg-gradient-to-r from-gray-900 to-black border-gray-700 text-white" : "bg-gradient-to-r from-gray-100 to-white border-gray-300 text-gray-900"
        }`}
      >
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center transition-all duration-300 transform hover:scale-110 ${
              isActive ? "text-blue-500" : isDarkMode ? "text-gray-300" : "text-gray-700"
            }`
          }
        >
          <TiHome size={24} className="mb-1" />
          <span className="text-xs font-semibold">Home</span>
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex flex-col items-center transition-all duration-300 transform hover:scale-110 ${
              isActive ? "text-blue-500" : isDarkMode ? "text-gray-300" : "text-gray-700"
            }`
          }
        >
          <FaCog size={20} className="mb-1" />
          <span className="text-xs font-semibold">Settings</span>
        </NavLink>

        <NavLink
          to="/stats"
          className={({ isActive }) =>
            `flex flex-col items-center transition-all duration-300 transform hover:scale-110 ${
              isActive ? "text-blue-500" : isDarkMode ? "text-gray-300" : "text-gray-700"
            }`
          }
        >
          <FaChartBar size={20} className="mb-1" />
          <span className="text-xs font-semibold">Stats</span>
        </NavLink>

        <NavLink
          to="/sanitation"
          className={({ isActive }) =>
            `flex flex-col items-center transition-all duration-300 transform hover:scale-110 ${
              isActive ? "text-blue-500" : isDarkMode ? "text-gray-300" : "text-gray-700"
            }`
          }
        >
          <FaDroplet size={20} className="mb-1" />
          <span className="text-xs font-semibold">Sanitation</span>
        </NavLink>

        <button
          onClick={() => setShowPopup(true)}
          className="flex flex-col items-center transition-all duration-300 transform hover:scale-110 text-red-500"
        >
          <FaPowerOff size={20} className="mb-1" />
          <span className="text-xs font-semibold">Shutdown</span>
        </button>
      </div>

      {/* Shutdown Confirmation Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div
            className={`p-6 rounded-2xl shadow-2xl bg-opacity-90 backdrop-blur-lg transform transition-all duration-300 scale-100 ${
              isDarkMode ? "bg-gradient-to-br from-gray-800 to-black text-white" : "bg-gradient-to-br from-white to-gray-100 text-black"
            }`}
          >
            <p className="text-lg font-semibold mb-4">Are you sure you want to shut down?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleShutdown}
                className="px-4 py-2 text-white rounded-xl bg-gradient-to-r from-red-500 to-red-700 shadow-lg transform transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Yes
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 text-white rounded-xl bg-gradient-to-r from-gray-500 to-gray-700 shadow-lg transform transition-all duration-300 hover:scale-105 active:scale-95"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Footer;