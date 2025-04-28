import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';



const LightPresets = ({ onSelect }) => {

  const {isDarkMode} = useContext(UserContext);

  const presets = [
    {
      id: 1,
      name: "Reading Mode",
      // description: "Warm light with reduced blue",
      blue: 20,
      red: 80
    },
    {
      id: 2,
      name: "Evening Relax",
      // description: "Balanced for relaxation",
      blue: 30,
      red: 60
    },
    {
      id: 3,
      name: "Energize",
      // description: "High blue for alertness",
      blue: 90,
      red: 40
    },
    {
      id: 4,
      name: "Movie Time",
      // description: "Dramatic red ambiance",
      blue: 10,
      red: 90
    }
  ];
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-400">Quick Presets</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {presets.map(preset => (
          <button
            key={preset.id}
            className="group p-3 rounded-lg transition-all duration-300 hover:scale-105 relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, rgba(${preset.red * 2.55}, 0, ${preset.blue * 2.55}, ${isDarkMode ?"0.3":"0.8"}), rgba(0, 0, 0, 0.7))`,
              boxShadow: `0 0 15px rgba(${preset.red * 2.55}, 0, ${preset.blue * 2.55}, 0.3)`
            }}
            onClick={() => onSelect({ blue: preset.blue, red: preset.red })}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000" />
            
            <div className="relative z-10">
              <h4 className="font-medium text-white text-md truncate">{preset.name}</h4>
              <p className="text-xs text-gray-300 mt-1 truncate">{preset.description}</p>
              
              <div className={` mt-2 flex justify-between text-md text-white`}>
                <span>R: {preset.red}%</span>
                <span>B: {preset.blue}%</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LightPresets;