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
      <div className={`h-[10%] ${isDarkMode ? "bg-black" : "bg-blue-400"} text-white flex justify-around items-center border-t border-gray-700 fixed bottom-0 left-0 w-full`}>
        <NavLink to="/" className="flex flex-col items-center">
          <TiHome size={20} />
          <span className="text-xs">Home</span>
        </NavLink>

        <NavLink to="/settings" className="flex flex-col items-center">
          <FaCog size={20} />
          <span className="text-xs">Settings</span>
        </NavLink>

        <NavLink to="/stats" className="flex flex-col items-center">
          <FaChartBar size={20} />
          <span className="text-xs">Stats</span>
        </NavLink>

        <NavLink to="/sanitation" className="flex flex-col items-center">
          <FaDroplet size={20} />
          <span className="text-xs">Sanitation</span>
        </NavLink>

        {/* Shutdown Button */}
        <button onClick={() => setShowPopup(true)} className="flex flex-col items-center">
          <FaPowerOff size={20} />
          <span className="text-xs">Shutdown</span>
        </button>
      </div>

      {/* Shutdown Confirmation Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-lg font-semibold mb-4 text-black">Are you sure you want to shut down ?</p>
            <div className="flex justify-center space-x-4">
              <button onClick={handleShutdown} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Yes</button>
              <button onClick={() => setShowPopup(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">No</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Footer;
