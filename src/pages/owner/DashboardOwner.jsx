import React, { useState, useEffect } from 'react';
import { TrendingUp, Coffee, Milk, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useNavigate } from 'react-router-dom'; // <-- 1. IMPORT USENAVIGATE ASYA

const DashboardOwner = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate(); // <-- 2. DEKLARASI NAVIGATE

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/dashboard/owner')
      .then(res => res.json())
      .then(res => {
        if (res.success) setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Gagal load dashboard", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-[#005432]">Memuat Dashboard...</div>;
  }

  if (!data) return null;

  const formatJuta = (angka) => {
    if (angka >= 1000000) return 'Rp ' + (angka / 1000000).toFixed(1) + 'Jt';
    if (angka >= 1000) return 'Rp ' + (angka / 1000).toFixed(1) + 'Rb';
    return 'Rp ' + angka;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-sans relative min-h-screen pb-10 p-2">
      
      {/* HEADER SECTION */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Selamat Datang, <span className="text-[#005432]">Owner</span></h1>
        <p className="text-gray-500 mt-1">Kelola operasional dan pantau ringkasan bisnismu hari ini</p>
      </div>

      {/* TOP WIDGETS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* WIDGET 1: Perform Staff */}
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 text-sm mb-5">Perform Staff (Hari Ini)</h3>
          <div className="space-y-4">
            {data.performStaff.map((staff) => (
              <div key={staff.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${staff.bg} text-white flex items-center justify-center font-bold text-sm shadow-sm`}>
                    {staff.initials}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{staff.name}</h4>
                    <p className="text-xs text-gray-400">{staff.target}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider
                  ${staff.status === 'PROGRES' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                  {staff.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* WIDGET 2: Pendapatan & Pengeluaran */}
        <div className="space-y-6">
          
          {/* Pendapatan Card -> Menuju Laporan */}
          <div 
            onClick={() => navigate('/laporan')} 
            className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden cursor-pointer hover:ring-2 hover:ring-[#005432] hover:shadow-lg transition-all"
          >
             <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-bold text-gray-800">Pendapatan Bulan Ini</p>
                <span className={`${data.financials.persen_pendapatan >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1`}>
                  {data.financials.persen_pendapatan >= 0 ? '↗' : '↘'} {Math.abs(data.financials.persen_pendapatan)}%
                </span>
             </div>
             <h3 className="text-3xl font-black text-gray-900">{formatJuta(data.financials.pendapatan)}</h3>
             <p className="text-[10px] text-gray-400 absolute bottom-3 right-5">Klik untuk detail →</p>
          </div>

          {/* Pengeluaran Card -> Menuju Stok Bahan */}
          <div 
            onClick={() => navigate('/stok-bahan')} 
            className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden cursor-pointer hover:ring-2 hover:ring-[#005432] hover:shadow-lg transition-all"
          >
             <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-bold text-gray-800">Pengeluaran (Restock)</p>
                <span className={`${data.financials.persen_pengeluaran <= 0 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'} px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1`}>
                  {data.financials.persen_pengeluaran >= 0 ? '↗' : '↘'} {Math.abs(data.financials.persen_pengeluaran)}%
                </span>
             </div>
             <h3 className="text-3xl font-black text-gray-900 mb-4">{formatJuta(data.financials.pengeluaran)}</h3>
             <p className="text-[10px] text-gray-400 absolute bottom-3 right-5">Klik untuk detail →</p>
          </div>
        </div>

        {/* WIDGET 3: Stok Menipis -> Menuju Stok Bahan */}
        <div 
            onClick={() => navigate('/stok-bahan')} 
            className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm cursor-pointer hover:ring-2 hover:ring-red-400 hover:shadow-lg transition-all relative"
        >
          <h3 className="font-bold text-gray-800 text-sm mb-5">Peringatan Stok</h3>
          <div className="space-y-4">
            {data.lowStock.length === 0 ? (
                <p className="text-xs text-gray-400 italic">Semua stok bahan aman.</p>
            ) : (
                data.lowStock.map((item, index) => (
                <div key={index} className="flex items-center gap-4 border border-red-50 bg-red-50/30 p-3 rounded-2xl">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-red-100 text-red-500`}>
                    <AlertTriangle size={20} />
                    </div>
                    <div>
                    <h4 className="font-bold text-gray-900 text-sm">{item.name}</h4>
                    <p className="text-xs font-bold text-red-500">{item.sisa}</p>
                    </div>
                </div>
                ))
            )}
          </div>
          <p className="text-[10px] text-gray-400 absolute top-6 right-5">Klik untuk restock →</p>
        </div>

      </div>

      {/* CHART SECTION: Tren Pendapatan */}
      <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
        <div className="flex justify-between items-start mb-6">
            <div>
                <h3 className="font-bold text-gray-900">Tren Pendapatan</h3>
                <p className="text-xs text-gray-400">Grafik omzet 7 hari terakhir (dalam Juta Rp)</p>
            </div>
            <button className="p-2 bg-green-50 text-green-600 rounded-lg"><TrendingUp size={18}/></button>
        </div>
        
        <div className="w-full h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCurrentDash" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPrevDash" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} tickFormatter={(value) => `Rp ${value}t`} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value) => [`Rp ${value} Juta`, 'Omzet']}
              />
              <Area type="monotone" dataKey="previous" stroke="#fbbf24" strokeWidth={4} fillOpacity={1} fill="url(#colorPrevDash)" name="Minggu Lalu" />
              <Area type="monotone" dataKey="current" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorCurrentDash)" name="Minggu Ini" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default DashboardOwner;