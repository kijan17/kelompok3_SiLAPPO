import React from 'react';
import { TrendingUp, Coffee, Milk } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const DashboardOwner = () => {
  // --- DUMMY DATA ---
  const chartData = [
    { name: 'Sen', current: 5, previous: 20 },
    { name: 'Sel', current: 16, previous: 14 },
    { name: 'Rab', current: 15, previous: 18 },
    { name: 'Kam', current: 16, previous: 38 },
    { name: 'Jum', current: 28, previous: 20 },
    { name: 'Sab', current: 35, previous: 2 },
    { name: 'Min', current: 18, previous: 15 },
  ];

  const performStaff = [
    { id: 1, name: 'Raditya', target: 'Rp 2.000.000', status: 'PROGRES', initials: 'RY', bg: 'bg-[#005432]' },
    { id: 2, name: 'Nadine', target: 'Rp 2.000.000', status: 'DONE', initials: 'NY', bg: 'bg-green-800' },
    { id: 3, name: 'Raditya', target: 'Rp 2.000.000', status: 'DONE', initials: 'RY', bg: 'bg-[#005432]' },
  ];

  const lowStock = [
    { id: 1, name: 'Biji Arabica', sisa: 'Sisa 1.4 Kg', icon: <Coffee size={20} className="text-pink-500"/>, bg: 'bg-pink-50' },
    { id: 2, name: 'Susu UHT', sisa: 'Sisa 5L', icon: <Milk size={20} className="text-orange-500"/>, bg: 'bg-orange-50' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-sans relative min-h-screen pb-10">
      
      {/* HEADER SECTION */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Selamat Datang, <span className="text-[#005432]">Owner</span></h1>
        <p className="text-gray-500 mt-1">Kelola operasional dan pantau ringkasan bisnismu hari ini</p>
      </div>

      {/* TOP WIDGETS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* WIDGET 1: Perform Staff */}
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 text-sm mb-5">Perform Staff</h3>
          <div className="space-y-4">
            {performStaff.map((staff) => (
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
          {/* Pendapatan Card */}
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden">
             <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-bold text-gray-800">Pendapatan</p>
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1">
                  ↗ +12%
                </span>
             </div>
             <h3 className="text-3xl font-black text-gray-900">Rp 45.2Jt</h3>
          </div>

          {/* Pengeluaran Card */}
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden">
             <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-bold text-gray-800">Pengeluaran</p>
                <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1">
                  ↘ -5%
                </span>
             </div>
             <h3 className="text-3xl font-black text-gray-900 mb-4">Rp 32.8Jt</h3>
             
             {/* Progress Bar Mini */}
             <div>
                <div className="flex justify-between text-[10px] text-gray-400 font-bold mb-1">
                    <span>Biji Kopi</span>
                    <span>Rp 12.5Jt</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '40%' }}></div>
                </div>
             </div>
          </div>
        </div>

        {/* WIDGET 3: Stok Menipis */}
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 text-sm mb-5">Stok Menipis</h3>
          <div className="space-y-4">
            {lowStock.map((item) => (
              <div key={item.id} className="flex items-center gap-4 border border-gray-50 bg-gray-50/30 p-3 rounded-2xl">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${item.bg}`}>
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{item.name}</h4>
                  <p className="text-xs font-bold text-red-400">{item.sisa}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* CHART SECTION: Tren Pendapatan */}
      <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
        <div className="flex justify-between items-start mb-6">
            <div>
                <h3 className="font-bold text-gray-900">Tren Pendapatan</h3>
                <p className="text-xs text-gray-400">Grafik pergerakan omzet minggu ini</p>
            </div>
            <button className="p-2 bg-green-50 text-green-600 rounded-lg"><TrendingUp size={18}/></button>
        </div>
        
        <div className="w-full h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                formatter={(value) => [`Rp ${value}.000.000`, '']}
              />
              <Area type="monotone" dataKey="previous" stroke="#fbbf24" strokeWidth={4} fillOpacity={1} fill="url(#colorPrevDash)" />
              <Area type="monotone" dataKey="current" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorCurrentDash)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default DashboardOwner;