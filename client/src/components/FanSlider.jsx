import React, { useRef, useState, useEffect } from "react";

const CustomSlider = () => {
  const sliderRef = useRef(null);
  const [value, setValue] = useState(50); // Default to middle (0–100)

  const calculateValue = (clientX) => {
    const slider = sliderRef.current;
    if (!slider) return 0;
    const { left, width } = slider.getBoundingClientRect();
    let percent = (clientX - left) / width;
    percent = Math.max(0, Math.min(1, percent));
    return Math.round(percent * 100); // 0 to 100
  };

  const handlePointerMove = (e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setValue(calculateValue(clientX));
  };

  const handlePointerDown = (e) => {
    handlePointerMove(e);
    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("touchmove", handlePointerMove);
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
    return () => handlePointerUp(); // Cleanup
  }, []);

  const getThumbLeft = () => `${value}%`;

  return (
    <div className="flex flex-col items-center w-full bg-black h-[100px]">
      {/* Slider track */}
      <div
        ref={sliderRef}
        onMouseDown={handlePointerDown}
        onTouchStart={handlePointerDown}
        className="relative w-full max-w-md h-[50px] mt-5 cursor-pointer"
      >
        {/* Tick marks */}
        <div className="absolute left-0 top-1/2 w-full h-px bg-white/20">
          {[...Array(21)].map((_, i) => (
            <div
              key={i}
              className="absolute top-[-6px] w-px h-3 bg-white"
              style={{ left: `${(i / 20) * 100}%` }}
            />
          ))}
        </div>

        {/* Thumb with circular progress */}
{/* Thumb with circular progress */}
<div
  className="absolute transform -translate-x-1/2 bg-transparent text-black w-10 h-10 flex items-center justify-center"
  style={{ left: getThumbLeft(), top: 'calc(50% - 65px)' }}
>
  {/* Vertical connecting line */}
  <div className="absolute bottom-[-33px] w-[2px] bg-white" style={{ height: '25px' }} />

  {/* SVG circular progress */}
  <svg className="absolute w-10 h-10 rotate-[-90deg]" viewBox="0 0 36 36">
    <circle
      cx="18"
      cy="18"
      r="16"
      fill="none"
      stroke="gray"
      strokeWidth="3"
    />
    <circle
      cx="18"
      cy="18"
      r="16"
      fill="none"
      stroke="#ffffff"
      strokeWidth="3"
      strokeDasharray="100"
      strokeDashoffset={100 - value}
      strokeLinecap="round"
    />
  </svg>

  {/* Value circle */}
  <div className="absolute w-8 h-8 rounded-full bg-black text-white shadow flex items-center justify-center text-sm font-bold">
    {value}
  </div>
</div>
      </div>
    </div>
  );
};

export default CustomSlider;
