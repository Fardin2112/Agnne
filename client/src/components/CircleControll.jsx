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
  const circumference = 376.99; // Matches User/Machine Temp (2 * π * 60)
  const strokeDashoffset = circumference - (value / max) * circumference;

  // 🟢 Calculate knob position (start from -90°)
  const angle = ((value / max) * 360 - 90) * (Math.PI / 180); // Convert to radians
  const radius = 60; // Circle radius, align knob with arc
  const knobRadius = 4; // Smaller knob to prevent clipping
  const centerX = 64; // Match LeftController
  const centerY = 64; // Match LeftController
  const knobX = centerX + radius * Math.cos(angle);
  const knobY = centerY + radius * Math.sin(angle);

  return (
    <div className="flex flex-col items-center">
      <div
        ref={circleRef}
        className="relative w-32 h-32 cursor-pointer touch-none"
        onMouseDown={handleStart}
        onTouchStart={handleStart}
      >
        <svg className="absolute w-full h-full" viewBox="0 0 128 128">
          {/* Background Circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r="60"
            fill="none"
            stroke="#e5e7eb" // Gray background
            strokeWidth="8"
          />
          {/* Foreground Circle (Filled Portion) */}
          <circle
            cx={centerX}
            cy={centerY}
            r="60"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform={`rotate(-90 ${centerX} ${centerY})`} // Start from top
          />
          {/* Knob */}
          <circle
            cx={knobX}
            cy={knobY}
            r={knobRadius}
            fill="white"
            stroke={color}
            strokeWidth="4" // Reduced stroke width to minimize footprint
            className="cursor-pointer transition-transform duration-200"
          />
        </svg>
        <p className={`text-xl font-bold z-10 text-${color}-500 absolute inset-0 flex items-center justify-center`}>
          {value}{unit}
        </p>
      </div>
      <p className={`mt-2 text-${color}-500 font-bold`}>{label}</p>
    </div>
  );
};

export default CircleControl;