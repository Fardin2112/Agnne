import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";

function Navbar() {
  const { isDarkMode } = useContext(UserContext);

  return (
    <div
      style={{ fontFamily: "Anurati" }}
      className={`h-[60px] flex  items-center justify-center fixed top-0 left-0 w-full z-50 bg-opacity-80 backdrop-blur-md  border-opacity-20`}
    >
      <h1
        className={`text-3xl font-bold bg-clip-text text-transparent transition-all duration-300 ${
          isDarkMode ? "bg-gradient-to-r from-red-400 to-pink-500" : "bg-[#000000]"
        }`}
      >
        A G N E E
      </h1>
    </div>
  );
}

export default Navbar;