import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { assests } from "../assets/assests";

const AgneeAnimation = () => {
  const [isVisible, setIsVisible] = useState(true);

  // Auto-dismiss after 5.5 seconds (5500ms) to match video length
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 5500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="relative flex justify-center items-center h-screen w-full overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          {/* Video Background */}
          <video
            autoPlay
            muted
            loop
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={assests.AgneeVedio} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AgneeAnimation;