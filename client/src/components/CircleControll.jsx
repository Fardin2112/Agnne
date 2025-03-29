import React, { useState, useRef, useEffect } from "react";

const CircleControl = ({ label, color, value, setValue, max, unit }) => {
  const circleRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const getAngle = (x, y) => {
    const rect = circleRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    return Math.atan2(y - centerY, x - centerX) * (180 / Math.PI);
  };

  const handleStart = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMove = (e) => {
    if (!isDragging) return;
    const { clientX, clientY } = e.touches ? e.touches[0] : e;
    const angle = getAngle(clientX, clientY) + 120; // Normalize angle to start from -120°
    const percentage = Math.max(0, Math.min(1, angle / 240)); // Clamp between 0% and 100%
    setValue(Math.round(percentage * max));
  };

  const handleEnd = () => setIsDragging(false);

  useEffect(() => {
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

  const circumference = 376.99; // 2 * π * 60
  const arcDegrees = 240;
  const maxFill = (arcDegrees / 360) * circumference;
  const backgroundDasharray = `${maxFill} ${circumference - maxFill}`;
  const progressDashoffset = maxFill - (value / max) * maxFill;

  const startAngleDeg = -120;
  const radius = 60;
  const centerX = 68;
  const centerY = 68;
  const angle = ((value / max) * arcDegrees + startAngleDeg) * (Math.PI / 180);
  const knobX = centerX + radius * Math.cos(angle);
  const knobY = centerY + radius * Math.sin(angle);

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        ref={circleRef}
        className="relative w-32 h-32 cursor-pointer touch-none"
        onMouseDown={handleStart}
        onTouchStart={handleStart}
      >
        <svg className="absolute w-full h-full" viewBox="0 0 136 136">
          {/* Background Arc */}
          <circle
            cx={centerX}
            cy={centerY}
            r="60"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
            strokeDasharray={backgroundDasharray}
            transform={`rotate(${startAngleDeg} ${centerX} ${centerY})`}
          />
          {/* Progress Arc */}
          <circle
            cx={centerX}
            cy={centerY}
            r="60"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={maxFill}
            strokeDashoffset={progressDashoffset}
            transform={`rotate(${startAngleDeg} ${centerX} ${centerY})`}
          />
          {/* Knob */}
          <circle cx={knobX} cy={knobY} r={6} fill="white" stroke={color} strokeWidth={6} />
        </svg>
        <p className="text-xl font-bold absolute inset-0 flex items-center justify-center" style={{ color }}>
          {value}
          {unit}
        </p>
      </div>
      <p className="mt-2 font-bold" style={{ color }}>
        {label}
      </p>
    </div>
  );
};

export default CircleControl;
