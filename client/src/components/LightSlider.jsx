import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RiExpandUpDownFill } from "react-icons/ri";

const VerticalSlider = () => {
  const sliderRef = useRef(null);
  const [value, setValue] = useState(37);
  const [pathData, setPathData] = useState("");

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
    setValue(calculateValue(clientY));
  };

  const handlePointerDown = (e) => {
    e.preventDefault(); // Prevents touch scrolling
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#050522]">
      <div className="flex items-start gap-7 p-6 shadow-xl rounded-xl bg-[#050522]">
        
        {/* Animated Percentage Values */}
        <div className="relative flex flex-col justify-between h-[400px] text-sm font-semibold w-[30px] ">
          {[100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0].map((v) => {
            const isActive = v === value;

            return (
              <motion.span
                key={v}
                className={`text-left pl-2 text-sm font-semibold ${
                  isActive ? "text-cyan-400" : "text-white"
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

        {/* Slider Area */}
        <div
          ref={sliderRef}
          onMouseDown={handlePointerDown}
          onTouchStart={handlePointerDown}
          className="relative w-[48px] h-[400px] ml-10"
        >
          {/* Horizontal Lines */}
          {[...Array(51)].map((_, i) => {
            const tickValue = 100 - i * 2;
            const top = `${(i / 50) * 100}%`;
            const distanceFromKnob = Math.abs(tickValue - value);
            const isMajorTick = tickValue % 10 === 0;

            const shiftLeft = distanceFromKnob <= 4
              ? (isMajorTick ? -40 : -28)
              : (isMajorTick ? -20 : -10);

            return (
              <motion.div
                key={`tick-${i}`}
                className={`absolute bg-[#ffffff33] h-[1.5px] ${isMajorTick ? "w-[28px]" : "w-[20px]"}`}
                style={{ top }}
                animate={{ left: `${shiftLeft}px` }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
              />
            );
          })}

          {/* Curved Track */}
          <svg
            className="absolute left-0 top-0 w-[48px] h-full z-10 pointer-events-none"
            viewBox="0 0 48 400"
            preserveAspectRatio="none"
          >
            <path
              d={pathData}
              stroke="#3b82f6"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
              className="transition-all duration-300 ease-out"
            />
          </svg>

          {/* Knob */}
          <div
            className="absolute left-[12px] w-12 h-12 rounded-full bg-[#e0e0e0] border-4 border-[#050522] flex items-center justify-center shadow-xl transition-all duration-200 ease-out z-20"
            style={{
              top: getThumbTop(),
              transform: "translateY(-10%)",
            }}
          >
            <div className="flex flex-col items-center justify-center rounded-full p-1 border-2 hover:border-gray-500 hover:bg-gray-300">
              <RiExpandUpDownFill />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerticalSlider;
