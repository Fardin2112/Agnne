import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';

function Sanitation() {
  const { isDarkMode } = useContext(AppContext);
  const [sanitationMode, setSanitationMode] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes (180 seconds)

  const handleClick = () => {
    setSanitationMode(true);
    setProgress(0);
    setTimeLeft(180);
  };

  useEffect(() => {
    let interval, timeout;
    
    if (sanitationMode) {
      // Progress bar animation
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 100 : prev + 1.67)); // (100 / 180 seconds) = 1.67 per sec
      }, 1000);

      // Countdown timer
      timeout = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            clearInterval(timeout);
            setSanitationMode(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(interval);
      clearInterval(timeout);
    };
  }, [sanitationMode]);

  return (
    <div className={`pt-32 h-full transition-all ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <div className="flex flex-col justify-center items-center">
        <h3 className="text-3xl font-bold mb-2">Sanitation Mode</h3>

        {/* Timer Display */}
        <p className="text-lg font-semibold mb-3">
          Time Left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
        </p>

        {/* Progress Bar */}
        <div className="w-72 h-4 bg-gray-300 rounded-full overflow-hidden my-4">
          <div
            className={`h-full rounded-full transition-all ${sanitationMode ? 'bg-blue-500' : 'bg-gray-500'}`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <p className="py-3 text-lg">🟦 Blue Light: 100%, Fans Max - 3 min</p>

        {/* Start Button */}
        <button
          onClick={handleClick}
          disabled={sanitationMode}
          className={`px-5 py-2 mt-4 text-white text-lg font-semibold rounded-xl shadow-lg transition-all 
            ${sanitationMode ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'}`}
        >
          {sanitationMode ? 'Sanitizing...' : 'Start'}
        </button>
      </div>
    </div>
  );
}

export default Sanitation;
