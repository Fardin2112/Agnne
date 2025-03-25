import React, { useState, useRef } from "react";

const CircleControl = ({ label, color, value, setValue, max, unit }) => {
  const circleRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startAngle, setStartAngle] = useState(null);

  // 🔥 Get angle based on cursor/touch position
  const getAngle = (x, y) => {
    const rect = circleRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    return Math.atan2(y - centerY, x - centerX) * (180 / Math.PI);
  };

  // ✅ Start dragging (Mouse + Touch)
  const handleStart = (e) => {
    e.preventDefault();
    const { clientX, clientY } = e.touches ? e.touches[0] : e;
    setStartAngle(getAngle(clientX, clientY));
    setIsDragging(true);
  };

  // 🎯 While dragging (change value)
  const handleMove = (e) => {
    if (!isDragging) return;

    const { clientX, clientY } = e.touches ? e.touches[0] : e;
    const currentAngle = getAngle(clientX, clientY);
    const angleDiff = currentAngle - startAngle;

    if (angleDiff > 5) setValue((prev) => Math.min(prev + 1, max));
    if (angleDiff < -5) setValue((prev) => Math.max(prev - 1, 0));

    setStartAngle(currentAngle);
  };

  // ❌ Stop dragging
  const handleEnd = () => {
    setIsDragging(false);
  };

  // 🔗 Attach event listeners for both mouse & touch
  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleEnd);
      window.addEventListener("touchmove", handleMove);
      window.addEventListener("touchend", handleEnd);
    } else {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
    }
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging]);

  // 🎨 Progress circle calculations
  const strokeDasharray = 251.2;
  const strokeDashoffset = strokeDasharray - (value / max) * strokeDasharray;

  // 🟢 Calculate knob (ball) position on the circle (start from -90°)
  const angle = (value / max) * 360 - 90;
  const knobX = 50 + 40 * Math.cos(angle * (Math.PI / 180));
  const knobY = 50 + 40 * Math.sin(angle * (Math.PI / 180));

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-white text-sm mb-2">{label}</h2>
      <div
        ref={circleRef}
        className="relative w-32 h-32 cursor-pointer touch-none"
        onMouseDown={handleStart}
        onTouchStart={handleStart}
      >
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* Background Circle */}
          <circle cx="50" cy="50" r="40" stroke="#555" strokeWidth="5" fill="none" />

          {/* Progress Arc (Start from -90°) */}
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke={color}
            strokeWidth="5"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 50 50)" // 🛠 FIXED: Start at top
          />

          {/* Knob (Bigger & White) */}
          <circle
            cx={knobX}
            cy={knobY}
            r="8"  // Bigger knob
            fill="white"
            stroke={color}
            strokeWidth="2"
            className="cursor-pointer transition-transform duration-200"
          />
        </svg>

        {/* Value in Center */}
        <span className="absolute inset-0 flex items-center justify-center text-white text-lg font-bold">
          {value}{unit}
        </span>
      </div>
    </div>
  );
};

export default CircleControl;
