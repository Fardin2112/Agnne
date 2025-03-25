import React from "react";
import { NavLink } from "react-router-dom";
import { FaChartBar, FaDroplet, FaPowerOff } from "react-icons/fa6";
import { TiHome } from "react-icons/ti";
import { FaCog } from "react-icons/fa";

function Footer() {
  return (
    <div className="h-[10%] bg-black text-white flex justify-around items-center border-t border-gray-700 
      fixed bottom-0 left-0 w-full">
      
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

      <NavLink to="/shutdown" className="flex flex-col items-center">
        <FaPowerOff size={20} />
        <span className="text-xs">Shutdown</span>
      </NavLink>

    </div>
  );
}

export default Footer;
