import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const AgneeAnimation = () => {
  const [isVisible, setIsVisible] = useState(true);

  // Auto-dismiss after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  // Variants for each letter
  const letterVariants = {
    initial: {
      opacity: 0,
      y: 100,
      rotateX: 90,
      scale: 0.5,
    },
    animate: (i) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        delay: i * 0.2,
        ease: "easeOut",
        type: "spring",
        stiffness: 100,
      },
    }),
    exit: (i) => ({
      opacity: 0,
      y: -100,
      rotateX: -90,
      transition: {
        duration: 0.5,
        delay: i * 0.1,
        ease: "easeIn",
      },
    }),
  };

  // Letters for "AGNEE"
  const letters = ["A", "G", "N", "E", "E"];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="relative flex justify-center items-center h-[600px] w-full bg-gradient-to-br from-gray-900 to-black overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          {/* Particle Background */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-purple-400 rounded-full"
                initial={{
                  x: Math.random() * 1024,
                  y: Math.random() * 600,
                  opacity: 0,
                }}
                animate={{
                  y: Math.random() * -600,
                  opacity: [0, 1, 0],
                  scale: Math.random() * 1.5,
                }}
                transition={{
                  duration: 2.5 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random(),
                }}
              />
            ))}
          </div>

          {/* Glassmorphism Overlay */}
          <motion.div
            className="absolute inset-0 bg-opacity-20 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          />

          {/* 3D Animated Text */}
          <div className="flex space-x-2" style={{ perspective: "1000px", fontFamily: "Anurati" }}>
            {letters.map((letter, index) => (
              <motion.span
                key={index}
                className="text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
                variants={letterVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                custom={index}
              >
                {letter}
              </motion.span>
            ))}
          </div>

          {/* Glow Effect */}
          <motion.div
            className="absolute w-96 h-96 bg-blue-500 rounded-full filter blur-3xl"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 0.2 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />

          {/* Sliding Tagline */}
          <motion.p
            className="absolute bottom-16 text-lg font-semibold text-white opacity-80"
            initial={{ x: -200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 1.5, ease: "easeOut" }}
          >
            Ignite Your Future
          </motion.p>

          {/* Subtle Wave Effect */}
          <motion.div
            className="absolute bottom-0 w-full h-16 bg-gradient-to-t from-blue-500 to-transparent opacity-20"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AgneeAnimation;