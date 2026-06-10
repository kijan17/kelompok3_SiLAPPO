import React from 'react';
import { Play } from 'lucide-react';

const DashboardKasir = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-sans p-2">
      
      {/* HEADER TITLE */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Selamat Datang, <span className="text-[#005432]">Asya</span></h1>
        <p className="text-gray-500 mt-2">Kelola Shift kerja dan pantau Performamu hari ini</p>
      </div>

      {/* CARDS CONTAINER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 w-full max-w-5xl">
        
        {/* CARD 1: PROFILE KASIR */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-center justify-center relative">
          <div className="relative mb-5">
            <div className="w-32 h-32 bg-[#005432] rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-md">
              AS
            </div>
            <div className="absolute bottom-2 right-2 w-7 h-7 bg-green-400 border-4 border-white rounded-full shadow-sm"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Asya</h2>
          <p className="text-gray-400 text-sm mb-8 font-medium">Kasir Utama Shift Pagi</p>
          <div className="w-full bg-green-50/50 border border-green-100 rounded-2xl py-4 flex items-center justify-center">
            <span className="text-2xl font-bold text-[#005432]">Rp 2.500.000</span>
          </div>
        </div>

        {/* CARD 2: STATUS SHIFT */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <h3 className="text-sm font-bold text-gray-500 tracking-widest uppercase mb-6">Status Shift</h3>
          <div className="w-full bg-gray-50/80 border border-gray-100 rounded-2xl py-8 flex items-center justify-center mb-8">
            <span className="text-5xl font-black text-gray-800 tracking-widest font-mono">00:00:00</span>
          </div>
          <button className="w-full bg-[#005432] text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-[#004225] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 mb-4">
            <Play fill="currentColor" size={20} /> Mulai Shift
          </button>
          <p className="text-sm text-gray-400 italic">Shift belum dimulai.</p>
        </div>

      </div>
    </div>
  );
};

export default DashboardKasir;