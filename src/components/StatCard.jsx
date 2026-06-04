import React from 'react';

const StatCard = ({ icon, title, value }) => {
  return (
    <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 flex items-center gap-4">
      <div className="p-3 bg-green-50 rounded-2xl text-[#005432]">
        {icon}
      </div>
      <div>
        <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">{title}</p>
        <p className="text-xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

export default StatCard; // Pastikan ada export default ini!