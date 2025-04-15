import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";

function Navbar() {
  const { isDarkMode } = useContext(AppContext);

  return (
    <div
      style={{ fontFamily: "Anurati" }}
      className={`h-[60px] flex items-center justify-center fixed top-0 left-0 w-full z-50 bg-opacity-80 backdrop-blur-md border-b border-opacity-20 ${
        isDarkMode ? "bg-gradient-to-r from-gray-900 to-black border-gray-700" : "bg-gradient-to-r from-gray-100 to-white border-gray-300"
      }`}
    >
      <h1
        className={`text-3xl font-bold bg-clip-text text-transparent transition-all duration-300 ${
          isDarkMode ? "bg-gradient-to-r from-red-400 to-pink-500" : "bg-gradient-to-r from-blue-500 to-purple-500"
        }`}
      >
        AGNEE
      </h1>
    </div>
  );
}

export default Navbar;