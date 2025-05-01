import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { RiExpandUpDownFill } from "react-icons/ri";

const LightSlider = ({ value, onChange, color = "blue" }) => {
  const sliderRef = useRef(null);
  const [pathData, setPathData] = React.useState("");

  const calculateValue = (clientY) => {
    const slider = sliderRef.current;
    if (!slider) return 0;
    const { top, height } = slider.getBoundingClientRect();
    let percent = 1 - (clientY - top) / height;
    percent = Math.max(0, Math.min(1, percent));
    return Math.round(percent * 100);
  };

  const handlePointerMove = (e) => {
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    onChange(calculateValue(clientY));
  };

  const handlePointerDown = (e) => {
    e.preventDefault();
    handlePointerMove(e);
    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("touchmove", handlePointerMove, { passive: false });
    window.addEventListener("mouseup", handlePointerUp);
    window.addEventListener("touchend", handlePointerUp);
  };

  const handlePointerUp = () => {
    window.removeEventListener("mousemove", handlePointerMove);
    window.removeEventListener("touchmove", handlePointerMove);
    window.removeEventListener("mouseup", handlePointerUp);
    window.removeEventListener("touchend", handlePointerUp);
  };

  useEffect(() => {
    return () => handlePointerUp();
  }, []);

  useEffect(() => {
    const knobPosition = (100 - value) / 100 * 400;
    const curveRadius = 20;

    const newPathData = `
      M24,0 
      L24,${knobPosition - curveRadius * 1.5}
      C24,${knobPosition - curveRadius} ${24 - curveRadius},${knobPosition - curveRadius} ${24 - curveRadius},${knobPosition}
      S24,${knobPosition + curveRadius} 24,${knobPosition + curveRadius * 1.5}
      L24,400
    `;

    setPathData(newPathData);
  }, [value]);

  const getThumbTop = () => `calc(${100 - value}% - 20px)`;

  const colorMap = {
    red: "#f87171",
    blue: "#3b82f6",
  };

  const trackColor = colorMap[color] || "#3b82f6";

  return (
    <div className="flex items-center gap-7 p-6">
      {/* Percentage Labels */}
      <div className="relative flex flex-col justify-between h-[420px] text-sm font-bold w-[30px]">
        {[100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0].map((v) => {
          const isActive = v === value;
          return (
            <motion.span
              key={v}
              className={`text-left pl-2 text-base font-semibold ${
                isActive ? "text-cyan-500" : "text-gray-700"
              }`}
              animate={
                isActive
                  ? {
                      y: `${((100 - value) / 100) * 400 - (400 * (100 - v)) / 100}px`,
                      scale: 1.2,
                    }
                  : { y: 0, scale: 1 }
              }
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              style={{ position: "relative" }}
            >
              {v}%
            </motion.span>
          );
        })}
      </div>

      {/* Slider */}
      <div
        ref={sliderRef}
        onMouseDown={handlePointerDown}
        onTouchStart={handlePointerDown}
        className="relative w-[48px] h-[400px] ml-10"
      >
        {[...Array(51)].map((_, i) => {
          const tickValue = 100 - i * 2;
          const top = `${(i / 50) * 100}%`;
          const distanceFromKnob = Math.abs(tickValue - value);
          const isMajorTick = tickValue % 10 === 0;

          const shiftLeft =
            distanceFromKnob <= 4
              ? isMajorTick
                ? -40
                : -28
              : isMajorTick
              ? -20
              : -10;

          return (
            <motion.div
              key={`tick-${i}`}
              className={`absolute bg-gray-400 h-[1.5px] ${
                isMajorTick ? "w-[28px]" : "w-[20px]"
              }`}
              style={{ top }}
              animate={{ left: `${shiftLeft}px` }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
            />
          );
        })}

        {/* Track Path */}
        <svg
          className="absolute left-0 top-0 w-[48px] h-full z-10 pointer-events-none"
          viewBox="0 0 48 400"
          preserveAspectRatio="none"
        >
          <path
            d={pathData}
            stroke={trackColor}
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
            className="transition-all duration-300 ease-out"
          />
        </svg>

        {/* Knob */}
        <div
          className="absolute left-[12px] w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center shadow-xl transition-all duration-200 ease-out z-20"
          style={{
            top: getThumbTop(),
            transform: "translateY(-10%)",
          }}
        >
          <div className="flex flex-col items-center justify-center rounded-full p-1 hover:border-2 hover:border-white-500 hover:bg-white">
            <RiExpandUpDownFill />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LightSlider;
