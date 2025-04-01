import { motion } from "framer-motion";
import bgvedio from '../assets/vedios/Agnee.mp4';
import logo from '../assets/AGNEE_LOGO.png';

const AgneeAnimation = () => {
  return (
    <div className="relative flex justify-center items-center h-screen w-full bg-black overflow-hidden">
      {/* Background Video */}
      <video 
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
      >
        <source src={bgvedio} type="video/mp4" />
      </video>

      {/* Centered Logo */}
      <motion.img 
        src={logo} 
        alt="Agnee Logo" 
        className="relative w-40 md:w-60" 
        initial={{ opacity: 0, scale: 0.5 }} 
        animate={{ opacity: 1, scale: 3 }} 
        transition={{ duration: 2.5 }}
      />
    </div>
  );
};

export default AgneeAnimation;
