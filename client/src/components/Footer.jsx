import React, { useContext, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { FaChartBar, FaDroplet, FaPowerOff } from "react-icons/fa6";
import { TiHome } from "react-icons/ti";
import { FaCog } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion"; // For 3D animations
import { assests } from "../assets/assests";
import { UserContext } from "../context/UserContext";
import { AppContext } from "../context/AppContext";
import { MdOutlineStart } from "react-icons/md";

function Footer() {
  const { toggleHome,setToggleHome } = useContext(AppContext);
  const { isDarkMode } = useContext(UserContext);
  const [showPopup, setShowPopup] = useState(false);
  const location = useLocation();
  const navigate = useNavigate(); // To programmatically navigate

  const handleShutdown = () => {
    console.log("Shutting down...");
    setShowPopup(false);
    // Add shutdown logic here, e.g., API call or script execution
  };

  // Animation variants for the popup
  const popupVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50, rotateX: -15 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.5,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      rotateX: 15,
      transition: { duration: 0.3 },
    },
  };

  // Animation variants for the shutdown icon
  const iconVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.2,
        type: "spring",
        stiffness: 120,
        damping: 10,
      },
    },
  };

  // Function to navigate to "Deep Research"
  const navigateToResearch = () => {
    navigate("/"); // Replace with the correct route
  };

  return (
    <>
      {/* Footer */}
      <motion.div
        className={`h-[100px] flex justify-around items-center fixed bottom-0 left-0 w-full z-50 bg-opacity-90 backdrop-blur-md border-t border-opacity-20 shadow-[0_4px_15px_rgba(0,0,0,0.3)] perspective-1000 ${
          isDarkMode
            ? "bg-gradient-to-r from-gray-900 via-gray-800 to-black border-gray-700 text-white"
            : "bg-[#FAFAFA] border-[#F1F3F4] text-gray-900"
        }`}
        style={{ transformStyle: "preserve-3d" }}
        initial={{ y: 50, rotateX: 15 }}
        animate={{ y: 0, rotateX: 0 }}
        transition={{ type: "spring", stiffness: 80, damping: 12 }}
      >
        {/* Home Button - Conditionally Rendered */}
        {location.pathname === "/" ? (
          <button
            onClick={() => {
              setToggleHome(true);
              // Add any additional logic you want when the home button is clicked
            }}
            className="flex flex-col items-center transition-all duration-300 transform hover:scale-110 rounded-full p-1 text-blue-500"
          >
            <MdOutlineStart size={32} className="mb-1" />
            <span className="text-base font-semibold">Start</span>
          </button>
        ) : (
          <button
            onClick={navigateToResearch} // Navigate to Deep Research
            className="flex flex-col items-center transition-all duration-300 transform hover:scale-110 rounded-full p-1"
          >
            <TiHome size={32} className="mb-1" />
            <span className="text-base font-semibold">Home</span>
          </button>
        )}

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex flex-col items-center transition-all duration-300 transform hover:scale-110 rounded-full p-1 ${
              isActive ? "text-blue-500" : isDarkMode ? "text-gray-300" : "text-[#2B2E48]"
            }`
          }
        >
          <FaCog size={32} className="mb-1" />
          <span className="text-base font-semibold">Settings</span>
        </NavLink>

        <NavLink
          to="/stats"
          className={({ isActive }) =>
            `flex flex-col items-center transition-all duration-300 transform hover:scale-110 rounded-full p-1 ${
              isActive ? "text-blue-500" : isDarkMode ? "text-gray-300" : "text-[#2B2E48]"
            }`
          }
        >
          <FaChartBar size={32} className="mb-1" />
          <span className="text-base font-semibold">Stats</span>
        </NavLink>

        <NavLink
          to="/sanitation"
          className={({ isActive }) =>
            `flex flex-col items-center transition-all duration-300 transform hover:scale-110 rounded-full p-1 ${
              isActive ? "text-blue-500" : isDarkMode ? "text-gray-300" : "text-[#2B2E48]"
            }`
          }
        >
          <FaDroplet size={32} className="mb-1" />
          <span className="text-base font-semibold">Sanitation</span>
        </NavLink>

        <button
          onClick={() => setShowPopup(true)}
          className="flex flex-col items-center transition-all duration-300 transform hover:scale-110 rounded-full p-1 text-red-500"
        >
          <FaPowerOff size={32} className="mb-1" />
          <span className="text-base font-semibold">Shutdown</span>
        </button>
      </motion.div>

      {/* Shutdown Confirmation Popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] bg-opacity-95 backdrop-blur-md w-[90%] max-w-3xl ${
                isDarkMode
                  ? "bg-gradient-to-br from-gray-800 to-black text-white"
                  : "bg-gradient-to-br from-white to-gray-100 text-black"
              }`}
              variants={popupVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="text-center mb-6">
                <motion.img
                  src={assests.shutdown}
                  alt="Shutdown"
                  className="mx-auto mb-4 w-28 h-28"
                  variants={iconVariants}
                  initial="hidden"
                  animate="visible"
                />
                <p className="text-2xl font-bold mb-2">Shutdown Confirmation</p>
                <p className="text-base">Are you sure you want to shut down the system?</p>
              </div>
              <div className="flex justify-center space-x-6">
                <motion.button
                  onClick={handleShutdown}
                  className="px-8 py-4 text-white rounded-xl bg-gradient-to-r from-red-600 to-red-800 transform transition-all duration-300 hover:scale-105 active:scale-95"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Yes
                </motion.button>
                <motion.button
                  onClick={() => setShowPopup(false)}
                  className="px-8 py-4 text-white rounded-xl bg-gradient-to-r from-gray-600 to-gray-800 transform transition-all duration-300 hover:scale-105 active:scale-95"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  No
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Footer;
