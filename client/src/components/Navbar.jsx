import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";

function Navbar() {

  const {isDarkMode} = useContext(AppContext);
  return (
    <div
      style={{ fontFamily: "Anurati" }}
      className={`h-[10vh] ${isDarkMode ? " bg-black" : "bg-blue-400 "} text-white flex items-center justify-center fixed top-0 left-0 w-full z-50`}
    >
      <h1 className={`text-3xl font-bold`}>AGNEE</h1>
    </div>
  );
}

export default Navbar;
