import React from 'react';
import { TrendingUp } from 'lucide-react';
import ShiftControl from '../../components/ShiftControl';
import StatCard from "../../components/StatCard";

const DashboardKasir = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Judul */}
      <div>
        <h1 className="text-4xl font-bold text-gray-800">
          Selamat Datang, <span className="text-[#005432]">Zaki</span>
        </h1>
        <p className="text-gray-500 mt-1">Kelola Shift kerja dan pantau Performamu hari ini</p>
      </div>

      {/* Grid Utama (3 Kolom sesuai Figma) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        
        {/* KARTU 1: PROFIL & TOTAL PENDAPATAN */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 flex flex-col items-center justify-between text-center min-h-[400px]">
          <div className="flex flex-col items-center">
            {/* Avatar Circle ZF */}
            <div className="w-32 h-32 bg-[#005432] rounded-full flex items-center justify-center relative border-4 border-white shadow-lg">
              <span className="text-white text-4xl font-bold">ZF</span>
              <div className="absolute bottom-1 right-2 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
            </div>
            <h3 className="mt-6 text-xl font-bold text-gray-800">Zaki Farizan</h3>
            <p className="text-gray-400 text-sm">Kasir Utama Shift Pagi</p>
          </div>

          <div className="w-full bg-green-50/50 border border-green-100 py-4 rounded-2xl">
             <span className="text-[#005432] font-bold text-2xl">Rp 2.500.000</span>
          </div>
        </div>

        {/* KARTU 2: PROGRES PENJUALAN (GRAFIK) */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 min-h-[400px] flex flex-col">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="font-bold text-gray-800">Progres Penjualan</h3>
              <p className="text-gray-400 text-xs uppercase tracking-wider">Aktivitas Minggu Ini</p>
            </div>
            <div className="p-2 bg-green-50 rounded-lg text-[#005432]">
              <TrendingUp size={20} />
            </div>
          </div>

          {/* Area Bar Chart Simpel (Tailwind) */}
          <div className="flex-1 flex items-end justify-between gap-2 px-2">
            {[
              { d: 'S', h: 'h-4/5', active: false },
              { d: 'M', h: 'h-3/5', active: false },
              { d: 'T', h: 'h-1/5', active: false },
              { d: 'W', h: 'h-full', active: true }, // Highlight Hari Ini
              { d: 'T', h: 'h-2/5', active: false },
              { d: 'F', h: 'h-3/4', active: false },
              { d: 'S', h: 'h-2/3', active: false },
            ].map((bar, i) => (
              <div key={i} className="flex flex-col items-center gap-4 w-full group">
                <div className="w-full bg-gray-100 rounded-full h-48 relative overflow-hidden">
                  <div className={`absolute bottom-0 w-full rounded-full transition-all duration-700 ${bar.active ? 'bg-[#005432]' : 'bg-green-200 group-hover:bg-green-300'} ${bar.h}`}></div>
                </div>
                <span className={`text-xs font-bold ${bar.active ? 'text-[#005432]' : 'text-gray-400'}`}>{bar.d}</span>
              </div>
            ))}
          </div>
        </div>

        {/* KARTU 3: MANAJEMEN SHIFT (KOMPONEN TERPISAH) */}
        <ShiftControl />

      </div>
    </div>
  );
};

export default DashboardKasir;