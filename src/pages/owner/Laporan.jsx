import React, { useState } from 'react';
import { Printer, Download, TrendingUp, DollarSign, Receipt, Coffee, Minus } from 'lucide-react';

const Laporan = () => {
  // Data dummy untuk tabel rekapitulasi shift
  const [shiftList] = useState([
    {
      id: 'Shift-001',
      kasir: 'Nadine Putri Aisyah',
      foto: 'https://ui-avatars.com/api/?name=Nadine+Putri&background=F3F4F6',
      buka: '08:00 - 16:00',
      tutup: '16:00 - 06:00',
      modal: 'Rp 1.0Jt',
      penjualan: 'Rp 6.8Jt',
      status: 'Tutup'
    },
    {
      id: 'Shift-002',
      kasir: 'Raditya Kusuma Putra',
      foto: 'https://ui-avatars.com/api/?name=Raditya+Kusuma&background=F3F4F6',
      buka: '16:00 - 00:00',
      tutup: '16:00 - 00:00',
      modal: 'Rp 1.0Jt',
      penjualan: 'Rp 7.4Jt',
      status: 'Tutup'
    },
    {
      id: 'Shift-003',
      kasir: 'Nadine Putri Aisyah',
      foto: 'https://ui-avatars.com/api/?name=Nadine+Putri&background=F3F4F6',
      buka: '08:00 - 16:00',
      tutup: '-',
      modal: 'Rp 1.0Jt',
      penjualan: 'Rp 2.4Jt (1 jam)',
      status: 'Sedang Jaga'
    }
  ]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-sans">
      
      {/* HEADER & FILTER ACTION */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Selamat Datang, <span className="text-[#005432]">Owner</span></h1>
          <p className="text-gray-500 mt-1">Halaman Laporan Keuangan & Analisis Bisnis</p>
        </div>
        
        <div className="flex gap-4 items-center">
          {/* Toggle Filter Bulan/Minggu */}
          <div className="flex bg-white rounded-lg p-1 border border-gray-200 shadow-sm text-sm">
            <button className="px-4 py-1.5 text-gray-500 hover:bg-gray-50 rounded-md">Hari Ini</button>
            <button className="px-4 py-1.5 text-gray-500 hover:bg-gray-50 rounded-md">Minggu Ini</button>
            <button className="px-4 py-1.5 bg-green-100 text-[#005432] font-bold rounded-md">Bulan Ini</button>
            <button className="px-4 py-1.5 text-gray-500 hover:bg-gray-50 rounded-md">Kustom ⌄</button>
          </div>
          
          <button className="flex items-center gap-2 bg-[#005432] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#004225] transition-all shadow-sm">
            <Printer size={16} /> Cetak Laporan
          </button>
          <button className="flex items-center gap-2 bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-lg font-medium hover:bg-red-100 transition-all shadow-sm">
            <Download size={16} /> Ekspor PDF
          </button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center text-yellow-600">
            <DollarSign size={24} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-gray-700">Total Pendapatan (Bulan Ini)</p>
            <div className="flex items-end gap-3 mt-1">
              <h2 className="text-2xl font-bold text-gray-900">Rp 14.2Jt</h2>
              <span className="flex items-center gap-1 text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded-md mb-1">
                <TrendingUp size={12} /> +12% vs. Bulan Lalu
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600">
            <Receipt size={24} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-gray-700">Total Transaksi</p>
            <div className="flex items-end gap-3 mt-1 justify-between">
              <div className="flex items-end gap-3">
                <h2 className="text-2xl font-bold text-gray-900">230</h2>
                <span className="flex items-center gap-1 text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded-md mb-1">
                  <TrendingUp size={12} /> +5%
                </span>
              </div>
              <span className="text-gray-400 text-sm flex items-center mb-1"><Minus size={14}/> stable</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
            <Coffee size={24} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-gray-700">Rata-rata Nilai Transaksi</p>
            <div className="flex items-end gap-3 mt-1 justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Rp 61rb</h2>
              <span className="text-gray-400 text-sm flex items-center mb-1"><Minus size={14}/> stable</span>
            </div>
          </div>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Area Chart (Menggunakan murni SVG agar tidak error) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-6">Tren Pendapatan (Minggu Ini)</h3>
          <div className="w-full h-48 relative border-b border-l border-gray-100 pb-2 pl-2">
            
            {/* Label Sumbu Y */}
            <div className="absolute -left-10 top-0 bottom-0 flex flex-col justify-between text-[10px] text-gray-400 text-right pr-2">
              <span>Rp 40Jt</span>
              <span>Rp 30Jt</span>
              <span>Rp 20Jt</span>
              <span>Rp 10Jt</span>
              <span>0p</span>
            </div>

            {/* Label Sumbu X */}
            <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-[10px] text-gray-400 px-2">
              <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
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

        {/* Donut Chart (Menggunakan murni CSS Conic Gradient) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <h3 className="font-bold text-gray-800 mb-6">Analisis Kategori Produk Terlaris (Bulan Ini)</h3>
          <div className="flex items-center justify-around flex-1">
            
            {/* Lingkaran Donat */}
            <div className="relative w-40 h-40 rounded-full flex items-center justify-center" 
                 style={{
                   background: `conic-gradient(#6ee7b7 0% 40%, #fde68a 40% 70%, #fca5a5 70% 90%, #c4b5fd 90% 100%)`
                 }}>
              <div className="absolute w-20 h-20 bg-white rounded-full"></div>
              {/* Label Persentase Mengambang */}
              <span className="absolute top-4 right-4 text-[10px] font-bold text-gray-700">40%</span>
              <span className="absolute bottom-4 left-6 text-[10px] font-bold text-gray-700">30%</span>
              <span className="absolute top-12 left-4 text-[10px] font-bold text-gray-700">20%</span>
              <span className="absolute top-2 right-16 text-[10px] font-bold text-gray-700">10%</span>
            </div>

            {/* Legend Samping */}
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-8">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#6ee7b7] rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">coffee</span>
                </div>
                <span className="font-bold text-gray-800">401</span>
              </div>
              <div className="flex items-center justify-between gap-8">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#fde68a] rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">milk</span>
                </div>
                <span className="font-bold text-gray-800">30</span>
              </div>
              <div className="flex items-center justify-between gap-8">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#fca5a5] rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">food</span>
                </div>
                <span className="font-bold text-gray-800">20</span>
              </div>
              <div className="flex items-center justify-between gap-8">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#c4b5fd] rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">merchandise</span>
                </div>
                <span className="font-bold text-gray-800">10</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* TABLE REKAPITULASI */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">Rekapitulasi Shift Terakhir</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-sm font-bold text-gray-700">
                <th className="py-4 px-6 font-bold">ID Shift</th>
                <th className="py-4 px-6 font-bold">Kasir Jaga</th>
                <th className="py-4 px-6 font-bold">Buka</th>
                <th className="py-4 px-6 font-bold">Tutup</th>
                <th className="py-4 px-6 font-bold">Modal Awal</th>
                <th className="py-4 px-6 font-bold">Total Penjualan</th>
                <th className="py-4 px-6 font-bold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-600 divide-y divide-gray-100">
              {shiftList.map((shift, index) => (
                <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 font-medium">{shift.id}</td>
                  <td className="py-4 px-6 flex items-center gap-3">
                    <img src={shift.foto} alt="Kasir" className="w-8 h-8 rounded-full border border-gray-200" />
                    <span className="font-medium text-gray-800">{shift.kasir}</span>
                  </td>
                  <td className="py-4 px-6">{shift.buka}</td>
                  <td className="py-4 px-6">{shift.tutup}</td>
                  <td className="py-4 px-6">{shift.modal}</td>
                  <td className="py-4 px-6 font-medium">{shift.penjualan}</td>
                  <td className="py-4 px-6">
                    <div className="flex justify-center">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${
                        shift.status === 'Tutup' 
                          ? 'bg-gray-100 text-gray-500 border-gray-200' 
                          : 'bg-green-100 text-[#005432] border-green-200'
                      }`}>
                        {shift.status}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Laporan;