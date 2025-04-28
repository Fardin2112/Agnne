import React, { useEffect, useRef } from 'react';

const LightPreview = ({ blueLight, redLight }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const setCanvasDimensions = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };
    
    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const red = Math.round((redLight / 100) * 255);
    const blue = Math.round((blueLight / 100) * 255);
    
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.rect(20, 20, canvas.width - 40, canvas.height - 40);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.rect(canvas.width / 2 - 50, canvas.height - 100, 100, 60);
    ctx.stroke();
    
    const centerX = canvas.width / 2;
    const centerY = 30;
    
    const gradient = ctx.createRadialGradient(
      centerX, centerY, 0, 
      centerX, centerY, canvas.height
    );
    
    gradient.addColorStop(0, `rgba(${red}, 0, ${blue}, 0.8)`);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, canvas.height, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#f3f4f6';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 10, 0, Math.PI * 2);
    ctx.fill();
    
    const rayCount = 8;
    const rayLength = 20;
    ctx.strokeStyle = '#f3f4f6';
    ctx.lineWidth = 2;
    
    for (let i = 0; i < rayCount; i++) {
      const angle = (i / rayCount) * Math.PI * 2;
      const x1 = centerX + Math.cos(angle) * 12;
      const y1 = centerY + Math.sin(angle) * 12;
      const x2 = centerX + Math.cos(angle) * (12 + rayLength);
      const y2 = centerY + Math.sin(angle) * (12 + rayLength);
      
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
    
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
    };
  }, [blueLight, redLight]);
  
  return (
    <div className="relative bg-gray-900 rounded-xl overflow-hidden" style={{ height: '180px' }}>
      <div className="absolute inset-0 flex items-center justify-center">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>
      <div className="absolute bottom-4 left-4 text-white bg-black bg-opacity-60 px-3 py-1.5 rounded-lg text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: `rgb(${Math.round((redLight / 100) * 255)}, 0, 0)` }} />
          <span>Red: {redLight}%</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: `rgb(0, 0, ${Math.round((blueLight / 100) * 255)})` }} />
          <span>Blue: {blueLight}%</span>
        </div>
      </div>
    </div>
  );
};

export default LightPreview;