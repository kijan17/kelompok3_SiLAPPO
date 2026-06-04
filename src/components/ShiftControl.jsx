// src/components/ShiftControl.jsx
import React, { useState, useEffect } from 'react';
import { Play, Square } from 'lucide-react';

const ShiftControl = () => {
  const [isShiftActive, setIsShiftActive] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval = null;
    if (isShiftActive) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isShiftActive]);

  const formatTime = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
      <h3 className="font-bold text-gray-700 mb-4 uppercase tracking-widest text-xs">Status Shift</h3>
      
      <div className="text-4xl font-mono font-bold text-gray-800 mb-6 bg-gray-50 py-4 rounded-xl">
        {formatTime(seconds)}
      </div>

      <div className="space-y-3">
        {!isShiftActive ? (
          <button 
            onClick={() => setIsShiftActive(true)}
            className="w-full bg-[#005432] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#004225] transition-all"
          >
            <Play size={18} fill="currentColor" /> Mulai Shift
          </button>
        ) : (
          <button 
            onClick={() => setIsShiftActive(false)}
            className="w-full bg-red-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-600 transition-all"
          >
            <Square size={18} fill="currentColor" /> Akhir Shift
          </button>
        )}
      </div>
      
      <p className="mt-4 text-xs text-gray-400 italic">
        {isShiftActive ? "Shift sedang berjalan..." : "Shift belum dimulai."}
      </p>
    </div>
  );
};

export default ShiftControl;