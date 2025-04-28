import React, { useState, useRef, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';

const FanSlider = ({ color, value, onChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef(null);
  const knobRef = useRef(null);

  const {isDarkMode} = useContext(UserContext);
  
  const colorConfig = {
    yellow: {
      label: 'Yellow Light',
      trackColor: 'rgba(251, 188, 5, 0.3)',
      activeColor: 'rgba(251, 188, 5, 1)',
      glowColor: 'rgba(251, 188, 5, 0.6)',
      iconPath: 'M12 7a5 5 0 1 1-4.995 5.217L7 12l.005-.217A5 5 0 0 1 12 7z'
    }
    ,
    
    green: {
      label: 'Green Light',
      trackColor: 'rgba(0, 128,0, 0.3)',
      activeColor: 'rgba(0, 128, 0, 0.7)',
      glowColor: 'rgba(0, 128, 0, 0.6)',
      iconPath: 'M12 7a5 5 0 1 1-4.995 5.217L7 12l.005-.217A5 5 0 0 1 12 7z'
    }
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || !sliderRef.current) return;
      
      const rect = sliderRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const newValue = Math.round((x / rect.width) * 100);
      onChange(newValue);
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, onChange]);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleTrackClick = (e) => {
    if (!sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newValue = Math.round((x / rect.width) * 100);
    onChange(newValue);
  };

  const knobPosition = `${value}%`;
  
  return (
    <div className="space-y-4 w-[650px]">
      <div className="flex justify-between items-center">
        <label className={`text-xl font-medium ${isDarkMode ? "text-white" :"text-gray-400"} `}>
          {/* {colorConfig[color].label} */}
        </label>
        <span className="text-2xl font-semibold" style={{ color: color === 'yellow' ? '#374151' : '#374151' }}>
          {value}%
        </span>
      </div>
      
      <div 
        ref={sliderRef}
        className="h-16 relative cursor-pointer rounded-xl p-2 transition-transform hover:scale-[1.01]"
        onClick={handleTrackClick}
        style={{
          background: `linear-gradient(to right, ${colorConfig[color].activeColor} 0%, ${colorConfig[color].activeColor} ${value}%, ${colorConfig[color].trackColor} ${value}%, ${colorConfig[color].trackColor} 100%)`,
          boxShadow: `0 0 20px ${colorConfig[color].glowColor}`,
          transform: `perspective(1000px) rotateX(${isDragging ? '12deg' : '8deg'})`,
        }}
      >
        <div className="absolute inset-0 rounded-xl opacity-20 bg-gradient-to-b from-white to-transparent pointer-events-none" />
        
        <div className="absolute inset-x-0 inset-y-2 flex justify-between px-2 pointer-events-none">
          {[...Array(11)].map((_, i) => (
            <div 
              key={i} 
              className="w-0.5 h-full bg-gray-500 opacity-30"
              style={{ opacity: value >= i * 10 ? 0.6 : 0.2 }}
            />
          ))}
        </div>
        
        <div
          ref={knobRef}
          className={`absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-full cursor-grab ${isDragging ? 'cursor-grabbing' : ''}`}
          style={{
            left: knobPosition,
            transform: `translateX(-50%) scale(${isDragging ? 1.1 : 1})`,
            background: `radial-gradient(circle at center, ${color === 'yellow' ? '#facc15' : '#008000'} 0%, ${color === 'yellow' ? '#facc15' : '#008000'} 100%)`,
            boxShadow: `0 0 15px ${colorConfig[color].glowColor}, 0 0 5px ${colorConfig[color].glowColor}`,
            transition: isDragging ? 'none' : 'transform 0.2s, box-shadow 0.2s',
          }}
          onMouseDown={handleMouseDown}
        >
          <svg viewBox="0 0 24 24" className="w-full h-full p-2 text-white opacity-70">
            <path 
              fill="currentColor" 
              d={colorConfig[color].iconPath} 
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default FanSlider;