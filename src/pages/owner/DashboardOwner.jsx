import React, { useState, useEffect } from 'react';
import { TrendingUp, ArrowUpRight, ArrowDownRight, AlertTriangle, Users, Wallet, PackageX, CheckCircle2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom'; 

const DashboardOwner = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isContentMounted, setIsContentMounted] = useState(false);
  const navigate = useNavigate(); 

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/dashboard/owner')
      .then(res => res.json())
      .then(res => {
        if (res.success) setData(res.data);
        setLoading(false);
        
        // Memicu animasi setelah data selesai di-load
        setTimeout(() => {
            setIsContentMounted(true);
        }, 100);
      })
      .catch(err => {
        console.error("Gagal load dashboard", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-[#005432] rounded-full animate-spin"></div>
        <div className="font-bold text-gray-500 text-sm tracking-widest uppercase">Memuat Analitik...</div>
      </div>
    );
  }

  if (!data) return null;

  const formatJuta = (angka) => {
    if (angka >= 1000000) return 'Rp ' + (angka / 1000000).toFixed(1) + ' Jt';
    if (angka >= 1000) return 'Rp ' + (angka / 1000).toFixed(1) + ' Rb';
    return 'Rp ' + angka.toLocaleString('id-ID');
  };

  return (
    <div className="space-y-6 font-sans relative min-h-screen pb-10">
      
      {/* HEADER SECTION (Langsung Muncul) */}
      <div className={`flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-100 pb-4 transition-all duration-700 ease-out transform ${isContentMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Selamat Datang, <span className="text-[#005432]">Owner</span></h1>
          <p className="text-gray-500 mt-1 text-sm">Pantau performa harian dan metrik operasional Lappo Coffee.</p>
        </div>
      </div>

      {/* TOP WIDGETS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* WIDGET 1: FINANCIAL METRICS (Meluncur Pertama - Delay 150ms) */}
        <div className={`lg:col-span-1 flex flex-col gap-4 transition-all duration-[1000ms] delay-[150ms] ease-out transform ${isContentMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Pendapatan Card */}
          <div 
            onClick={() => navigate('/laporan')} 
            className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm cursor-pointer hover:border-green-300 hover:shadow-md transition-all group relative overflow-hidden"
          >
            <div className="absolute right-0 top-0 w-24 h-24 bg-green-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-green-50 text-[#005432] rounded-lg"><Wallet size={18} /></div>
                <p className="text-sm font-semibold text-gray-600">Pendapatan Bulan Ini</p>
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <h3 className="text-3xl font-bold text-gray-900">{formatJuta(data.financials.pendapatan)}</h3>
              </div>
              <span className={`px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 ${data.financials.persen_pendapatan >= 0 ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                {data.financials.persen_pendapatan >= 0 ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>} 
                {Math.abs(data.financials.persen_pendapatan)}%
              </span>
            </div>
          </div>

          {/* Pengeluaran Card */}
          <div 
            onClick={() => navigate('/stok-bahan')} 
            className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm cursor-pointer hover:border-red-200 hover:shadow-md transition-all group relative overflow-hidden"
          >
            <div className="absolute right-0 top-0 w-24 h-24 bg-red-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-red-50 text-red-600 rounded-lg"><TrendingUp size={18} className="rotate-180" /></div>
                <p className="text-sm font-semibold text-gray-600">Pengeluaran Restock</p>
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <h3 className="text-3xl font-bold text-gray-900">{formatJuta(data.financials.pengeluaran)}</h3>
              </div>
              <span className={`px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 ${data.financials.persen_pengeluaran <= 0 ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                {data.financials.persen_pengeluaran >= 0 ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>} 
                {Math.abs(data.financials.persen_pengeluaran)}%
              </span>
            </div>
          </div>
        </div>

        {/* WIDGET 2: Perform Staff (Meluncur Kedua - Delay 300ms) */}
        <div className={`bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col transition-all duration-[1000ms] delay-[300ms] ease-out transform ${isContentMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center justify-between mb-5 border-b border-gray-50 pb-3">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-blue-500" />
              <h3 className="font-bold text-gray-800 text-sm">Aktivitas Staf Harian</h3>
            </div>
          </div>
          <div className="space-y-3 flex-1 overflow-y-auto pr-2">
            {data.performStaff.map((staff) => (
              <div key={staff.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${staff.bg} text-white flex items-center justify-center font-bold text-sm shadow-sm`}>
                    {staff.initials}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{staff.name}</h4>
                    <p className="text-[11px] text-gray-500 font-mono mt-0.5">{staff.target}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider
                  ${staff.status === 'PROGRES' ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-green-50 text-[#005432] border border-green-100'}`}>
                  {staff.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* WIDGET 3: Stok Menipis (Meluncur Ketiga - Delay 450ms) */}
        <div 
          onClick={() => navigate('/stok-bahan')} 
          className={`bg-white p-5 rounded-2xl border border-gray-200 shadow-sm cursor-pointer hover:border-red-300 transition-all flex flex-col group transition-all duration-[1000ms] delay-[450ms] ease-out transform ${isContentMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="flex items-center justify-between mb-5 border-b border-gray-50 pb-3">
            <div className="flex items-center gap-2">
              <PackageX size={18} className="text-red-500" />
              <h3 className="font-bold text-gray-800 text-sm">Peringatan Stok Terbatas</h3>
            </div>
            <span className="text-xs text-gray-400 group-hover:text-red-500 transition-colors">Lihat detail &rarr;</span>
          </div>
          
          <div className="space-y-3 flex-1">
            {data.lowStock.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-2">
                  <CheckCircle2 size={24} className="text-green-500" />
                </div>
                <p className="text-sm font-semibold text-gray-600">Semua stok aman</p>
                <p className="text-xs text-gray-400 mt-1">Belum ada bahan baku yang perlu di-restock.</p>
              </div>
            ) : (
              data.lowStock.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-red-50/50 border border-red-100 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
                      <AlertTriangle size={16} />
                    </div>
                    <h4 className="font-semibold text-gray-800 text-sm">{item.name}</h4>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-500 mb-0.5">Sisa Stok</p>
                    <p className="text-sm font-bold text-red-600">{item.sisa}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* CHART SECTION: Tren Pendapatan (Meluncur Terakhir - Delay 600ms) */}
      <div className={`bg-white p-6 rounded-2xl border border-gray-200 shadow-sm transition-all duration-[1000ms] delay-[600ms] ease-out transform ${isContentMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Tren Pendapatan Mingguan</h3>
            <p className="text-sm text-gray-500 mt-1">Perbandingan omzet 7 hari terakhir (dalam Juta Rupiah)</p>
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
              <span className="w-3 h-3 rounded-full bg-[#fbbf24]"></span> Minggu Lalu
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
              <span className="w-3 h-3 rounded-full bg-[#005432]"></span> Minggu Ini
            </div>
          </div>
        </div>
        
        <div className="w-full h-[320px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCurrentDash" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#005432" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#005432" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPrevDash" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280', fontWeight: 500 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280', fontWeight: 500 }} tickFormatter={(value) => `Rp ${value}t`} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ fontWeight: 'bold' }}
                formatter={(value) => [`Rp ${value} Juta`, 'Omzet']}
              />
              <Area type="monotone" dataKey="previous" stroke="#fbbf24" strokeWidth={3} fillOpacity={1} fill="url(#colorPrevDash)" name="Minggu Lalu" />
              <Area type="monotone" dataKey="current" stroke="#005432" strokeWidth={3} fillOpacity={1} fill="url(#colorCurrentDash)" name="Minggu Ini" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default DashboardOwner;