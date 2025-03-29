import { motion } from "framer-motion";

const AgneeAnimation = () => {
  return (
    <div className="relative flex justify-center items-center h-screen w-full bg-black overflow-hidden">
      {/* Blue Smoke Effect */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5, x: -200, y: 200 }} // Starts from bottom left
        animate={{ opacity: 1, scale: 1.5, x: 200, y: -200 }} // Moves to top right
        transition={{ duration: 4, ease: "easeOut", repeat: Infinity, repeatType: "reverse" }} // Continuous floating effect
        className="absolute w-72 h-72 bg-blue-500 rounded-full blur-3xl opacity-50"
      ></motion.div>

      {/* AGNEE Text */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, color: "#000000" }} // Starts dark & small
        animate={{ opacity: 1, scale: 1.2, color: "#ff0000" }} // Fades to red
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="text-6xl font-bold relative z-10"
        style={{
          fontFamily: "Anurati",
          textShadow: "0px 0px 15px rgba(255, 0, 0, 0.8)", // Red glow effect
        }}
      >
        AGNEE
      </motion.div>
    </div>
  );
};

export default AgneeAnimation;
