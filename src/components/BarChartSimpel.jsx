import React from 'react';

const BarChartSimpel = () => {
  // Data tinggi batang yang disesuaikan agar pas (skala tinggi maks 100%)
  const bars = [
    { height: '75%', day: 'S', active: false },
    { height: '50%', day: 'M', active: false },
    { height: '15%', day: 'T', active: false },
    { height: '90%', day: 'W', active: true }, // Hari aktif (Kopi Paling Laris)
    { height: '35%', day: 'T', active: false },
    { height: '70%', day: 'F', active: false },
    { height: '65%', day: 'S', active: false },
  ];

  return (
    <div className="w-full flex items-end justify-between gap-4 h-48 px-4 mt-6">
      {bars.map((bar, index) => (
        <div key={index} className="flex flex-col items-center gap-3 flex-1 h-full justify-end">
          
          {/* Batang Grafik */}
          <div className="w-full bg-[#F3F4F6] rounded-full h-full relative overflow-hidden group min-w-[20px] max-w-[45px]">
            <div 
              style={{ height: bar.height }} 
              className={`absolute bottom-0 w-full rounded-full transition-all duration-700 ${
                bar.active 
                  ? 'bg-[#005432]' 
                  : 'bg-[#A7F3D0] group-hover:bg-[#6EE7B7]'
              }`}
            ></div>
          </div>
          
          {/* Label Hari */}
          <span className={`text-sm font-bold tracking-wider ${
            bar.active ? 'text-[#005432]' : 'text-gray-400'
          }`}>
            {bar.day}
          </span>

        </div>
      ))}
    </div>
  );
};

export default BarChartSimpel;