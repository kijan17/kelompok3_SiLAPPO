import React from 'react';
import { TrendingUp, TrendingDown, Coffee, Milk } from 'lucide-react';

const DashboardOwner = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-sans">
      
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Selamat Datang, <span className="text-[#005432]">Owner</span></h1>
        <p className="text-gray-500 mt-1">Kelola operasional dan pantau ringkasan bisnismu hari ini</p>
      </div>

      {/* TOP CARDS GRID - Dibagi menjadi 3 kolom utama */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* KOLOM 1: Perform Staff */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
          <h3 className="font-bold text-gray-800 mb-6">Perform Staff</h3>
          <div className="space-y-5">
            {/* Staff 1 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#005432] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  RY
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-sm">Raditya</p>
                  <p className="text-xs text-gray-400">Rp 2.000.000</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-orange-100 text-orange-600 text-[10px] font-bold rounded-md uppercase tracking-wider">Progres</span>
            </div>
            {/* Staff 2 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#005432] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  NY
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-sm">Nadine</p>
                  <p className="text-xs text-gray-400">Rp 2.000.000</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-100 text-[#005432] text-[10px] font-bold rounded-md uppercase tracking-wider">Done</span>
            </div>
            {/* Staff 3 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#005432] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  RY
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-sm">Raditya</p>
                  <p className="text-xs text-gray-400">Rp 2.000.000</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-100 text-[#005432] text-[10px] font-bold rounded-md uppercase tracking-wider">Done</span>
            </div>
          </div>
        </div>

        {/* KOLOM 2: RINGKASAN KEUANGAN */}
        <div className="flex flex-col gap-6">
          
          {/* Card Pendapatan */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex-1 flex flex-col justify-center relative overflow-hidden">
            <div className="flex justify-between items-start mb-2 z-10">
              <h3 className="font-bold text-gray-800">Pendapatan</h3>
              <span className="flex items-center gap-1 text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded-md">
                <TrendingUp size={12} /> +12%
              </span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 z-10">Rp 45.2Jt</h2>
            <div className="absolute -bottom-6 -right-4 w-24 h-24 bg-green-50 rounded-full blur-2xl"></div>
          </div>

          {/* Card Pengeluaran */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex-1 flex flex-col justify-center relative overflow-hidden">
            <div className="flex justify-between items-start mb-2 z-10">
              <h3 className="font-bold text-gray-800">Pengeluaran</h3>
              <span className="flex items-center gap-1 text-xs font-bold text-orange-700 bg-orange-100 px-2 py-1 rounded-md">
                <TrendingDown size={12} /> -5%
              </span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 z-10 mb-4">Rp 32.8Jt</h2>
            
            <div className="w-full z-10">
              <div className="flex justify-between text-[10px] text-gray-400 mb-1.5 font-medium">
                <span>Biji Kopi</span>
                <span>Rp 12.5Jt</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '40%' }}></div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-4 w-24 h-24 bg-red-50 rounded-full blur-2xl"></div>
          </div>

        </div>

        {/* KOLOM 3: Stok Menipis */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
          <h3 className="font-bold text-gray-800 mb-6">Stok Menipis</h3>
          <div className="space-y-4">
            
            <div className="flex items-center gap-4 bg-pink-50/50 border border-pink-100 p-4 rounded-2xl">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-pink-500 shadow-sm">
                <Coffee size={20} />
              </div>
              <div>
                <p className="font-bold text-gray-800 text-sm">Biji Arabica</p>
                <p className="text-xs text-pink-500 font-medium mt-0.5">Sisa 1.4 Kg</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-orange-50/50 border border-orange-100 p-4 rounded-2xl">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-orange-500 shadow-sm">
                <Milk size={20} />
              </div>
              <div>
                <p className="font-bold text-gray-800 text-sm">Susu UHT</p>
                <p className="text-xs text-orange-500 font-medium mt-0.5">Sisa 5L</p>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* BOTTOM CHART: Tren Pendapatan (Area Chart SVG) */}
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 relative">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Tren Pendapatan</h3>
            <p className="text-sm text-gray-400 mt-1">Grafik pergerakan omzet minggu ini</p>
          </div>
          <div className="w-10 h-10 bg-green-50 text-[#005432] rounded-xl flex items-center justify-center">
            <TrendingUp size={20} />
          </div>
        </div>

        <div className="w-full h-56 relative border-b border-l border-gray-100 pb-2 pl-2 md:ml-6 md:w-[calc(100%-2rem)]">
          {/* Label Sumbu Y */}
          <div className="absolute -left-12 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-400 text-right pr-2">
            <span>Rp 40Jt</span>
            <span>Rp 30Jt</span>
            <span>Rp 20Jt</span>
            <span>Rp 10Jt</span>
            <span>0p</span>
          </div>

          {/* Label Sumbu X */}
          <div className="absolute -bottom-7 left-0 right-0 flex justify-between text-xs text-gray-400 px-2">
            <span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span><span>Min</span>
          </div>

          {/* Garis Horizontal Bantuan */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            <div className="border-b border-gray-50 h-full"></div>
            <div className="border-b border-gray-50 h-full"></div>
            <div className="border-b border-gray-50 h-full"></div>
            <div className="border-b border-gray-50 h-full"></div>
          </div>

          {/* SVG Grafik */}
          <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible" preserveAspectRatio="none">
            {/* Grafik Kuning (Pendapatan Shift Siang) */}
            <path d="M0,40 L0,20 Q15,30 30,25 T50,5 T70,25 T100,20 L100,40 Z" fill="#fef3c7" opacity="0.6" />
            <path d="M0,20 Q15,30 30,25 T50,5 T70,25 T100,20" fill="none" stroke="#f59e0b" strokeWidth="0.8" />
            <circle cx="50" cy="5" r="1.5" fill="white" stroke="#f59e0b" strokeWidth="0.5" />
            
            {/* Grafik Hijau (Pendapatan Shift Malam) */}
            <path d="M0,40 L0,35 Q15,20 30,25 T50,25 T75,10 T100,25 L100,40 Z" fill="#d1fae5" opacity="0.7" />
            <path d="M0,35 Q15,20 30,25 T50,25 T75,10 T100,25" fill="none" stroke="#10b981" strokeWidth="0.8" />
            <circle cx="50" cy="25" r="1.5" fill="white" stroke="#10b981" strokeWidth="0.5" />
          </svg>
        </div>
      </div>

    </div>
  );
};

export default DashboardOwner;