import React, { useState, useEffect } from 'react';
import { Printer, DollarSign, Receipt, Coffee, Download, TrendingUp } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, PieChart, Pie, Cell } from 'recharts';

const LaporanKeuangan = () => {
  const [data, setData] = useState(null);
  const [namaPengguna, setNamaPengguna] = useState('Owner');
  const [isMounted, setIsMounted] = useState(false);
  const [filterDate, setFilterDate] = useState(''); 

  useEffect(() => {
    const storedName = localStorage.getItem('kasir_name');
    if (storedName) setNamaPengguna(storedName);

    fetch('http://127.0.0.1:8000/api/transactions')
      .then(res => res.json())
      .then(res => {
        setData(res);
        setTimeout(() => setIsMounted(true), 100);
      })
      .catch(err => console.error("Error fetching data:", err));
  }, []);

  if (!data) return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
      <div className="w-10 h-10 border-4 border-gray-200 border-t-[#005432] rounded-full animate-spin"></div>
      <div className="font-bold text-gray-500 text-sm tracking-widest uppercase">Merekap Data Keuangan...</div>
    </div>
  );

  // 1. LOGIKA FILTER TANGGAL
  const filteredTransactions = data.recent_transactions.filter(row => {
    if (!filterDate) return true; 
    return row.tanggal === filterDate;
  });

  // 2. LOGIKA MATEMATIKA DINAMIS UNTUK KPI CARDS
  const dynamicTotalTransaksi = filteredTransactions.length;
  
  const dynamicTotalPendapatan = filteredTransactions.reduce((sum, trx) => {
    const rawNumber = parseInt(trx.total.replace(/[^0-9]/g, ''), 10);
    return sum + (rawNumber || 0);
  }, 0);

  const dynamicRataRata = dynamicTotalTransaksi > 0 ? dynamicTotalPendapatan / dynamicTotalTransaksi : 0;

  const formatRupiah = (angka) => {
    return 'Rp ' + angka.toLocaleString('id-ID');
  };

  // 3. LOGIKA MATEMATIKA DINAMIS UNTUK PIE CHART (Distribusi Produk)
  const getDynamicPieData = () => {
    if (filteredTransactions.length === 0) {
      return [{ name: 'Belum ada penjualan', value: 1, color: '#d1d5db' }];
    }

    // Hitung kemunculan item dari transaksi yang terfilter
    const productCounts = {};
    filteredTransactions.forEach(trx => {
      if (trx.items) {
        trx.items.forEach(item => {
          if (productCounts[item.name]) {
            productCounts[item.name] += item.qty;
          } else {
            productCounts[item.name] = item.qty;
          }
        });
      }
    });

    // Ubah jadi array, urutkan dari yang terbanyak, ambil top 4
    const sortedProducts = Object.keys(productCounts)
      .map(key => ({
        name: key,
        value: productCounts[key]
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 4);

    // Beri warna
    const colors = ['#005432', '#3b82f6', '#ef4444', '#f59e0b', '#8b5cf6'];
    return sortedProducts.map((prod, index) => ({
      ...prod,
      color: colors[index % colors.length]
    }));
  };

  const dynamicPieData = getDynamicPieData();

  return (
    <div className={`space-y-6 font-sans min-h-screen pb-10 transition-all duration-700 ease-out transform ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Laporan <span className="text-[#005432]">Keuangan</span></h1>
          <p className="text-gray-500 mt-1 text-sm">Ringkasan performa penjualan dan analisis transaksi real-time.</p>
        </div>
        <div className="flex gap-3 items-center">
          <div className="relative">
            <input 
              type="date" 
              value={filterDate} 
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition-colors shadow-sm text-sm outline-none focus:ring-2 focus:ring-[#005432]/20 focus:border-[#005432] cursor-pointer"
            />
          </div>
          <button className="flex items-center gap-2 bg-[#005432] text-white px-4 py-2 rounded-xl font-semibold hover:bg-green-900 transition-colors shadow-sm shadow-green-900/20 text-sm">
            <Download size={16} /> Ekspor
          </button>
        </div>
      </div>

      {/* KPI METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col relative overflow-hidden group hover:border-[#005432]/30 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg"><DollarSign size={20} /></div>
              <p className="text-sm font-semibold text-gray-600">Total Pendapatan {filterDate ? 'Harian' : 'Keseluruhan'}</p>
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{formatRupiah(dynamicTotalPendapatan)}</h3>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col relative overflow-hidden group hover:border-[#005432]/30 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Receipt size={20} /></div>
              <p className="text-sm font-semibold text-gray-600">Total Transaksi {filterDate ? 'Harian' : 'Selesai'}</p>
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{dynamicTotalTransaksi} <span className="text-lg text-gray-400 font-medium">Nota</span></h3>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col relative overflow-hidden group hover:border-[#005432]/30 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Coffee size={20} /></div>
              <p className="text-sm font-semibold text-gray-600">Rata-rata Penjualan</p>
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{formatRupiah(dynamicRataRata)}</h3>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Tren Pendapatan Harian</h3>
              <p className="text-sm text-gray-500 mt-1">Grafik pergerakan omzet minggu ini</p>
            </div>
            <div className="p-2 bg-gray-50 text-gray-400 rounded-lg border border-gray-100"><TrendingUp size={18}/></div>
          </div>
          <div className="w-full flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.chart_data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#005432" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#005432" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{fontSize: 12, fill: '#6b7280', fontWeight: 500}} axisLine={false} tickLine={false} dy={10} />
                <YAxis tickFormatter={(v) => `Rp ${v}Rb`} tick={{fontSize: 12, fill: '#6b7280', fontWeight: 500}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(v) => [`Rp ${v}.000`, 'Pendapatan']} 
                />
                <Area type="monotone" dataKey="current" stroke="#005432" fill="url(#colorArea)" strokeWidth={3} activeDot={{ r: 6, fill: '#005432', stroke: '#fff', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
          <div className="mb-4 border-b border-gray-100 pb-4">
            <h3 className="font-bold text-gray-900 text-lg">Distribusi Produk</h3>
            <p className="text-sm text-gray-500 mt-1">Kategori menu terlaris {filterDate && "di tanggal ini"}</p>
          </div>
          <div className="flex-1 flex flex-col justify-center relative min-h-[250px]">
            <div className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                {/* MENGGUNAKAN DYNAMIC PIE DATA */}
                <PieChart>
                  <Pie data={dynamicPieData} dataKey="value" innerRadius={55} outerRadius={80} paddingAngle={2} stroke="none">
                    {dynamicPieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(v) => [`${v} Porsi`, 'Terjual']} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 mt-4">
              {dynamicPieData.map((item, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <span className="font-medium text-gray-600 capitalize">{item.name}</span>
                  </div>
                  <span className="font-bold text-gray-900">{item.value} <span className="text-gray-400 font-normal text-xs">Item</span></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50/30">
          <h2 className="text-lg font-bold text-gray-900">Histori Transaksi Keseluruhan</h2>
          {filterDate && (
             <button onClick={() => setFilterDate('')} className="text-xs text-red-500 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 font-bold transition-colors">
               Hapus Filter ✖
             </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">ID Nota</th>
                <th className="px-6 py-4 whitespace-nowrap">Petugas Kasir</th>
                <th className="px-6 py-4 min-w-[200px]">Menu Pesanan</th>
                <th className="px-6 py-4 whitespace-nowrap">Waktu Transaksi</th>
                <th className="px-6 py-4 whitespace-nowrap">Total Pembayaran</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredTransactions.length === 0 ? (
                 <tr>
                   <td colSpan="6" className="p-12 text-center text-gray-400 font-medium">
                     Tidak ada transaksi pada tanggal tersebut.
                   </td>
                 </tr>
              ) : (
                filteredTransactions.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-6 py-4 align-top">
                      <span className="font-mono font-medium text-gray-600 bg-white border border-gray-200 shadow-sm px-2.5 py-1.5 rounded-lg">{row.id}</span>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold shadow-sm">
                          {row.name ? row.name.substring(0, 2).toUpperCase() : 'KS'}
                        </div>
                        <span className="font-semibold text-gray-800">{row.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                        <div className="flex flex-wrap gap-1.5">
                          {row.items && row.items.map((item, idx) => (
                            <span key={idx} className="inline-flex items-center text-[10px] font-bold text-gray-600 bg-white border border-gray-200 px-2 py-1 rounded-md shadow-sm">
                              <span className="text-[#005432] mr-1">{item.qty}x</span> {item.name}
                            </span>
                          ))}
                        </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-medium align-top whitespace-nowrap">
                      {row.open}
                    </td>
                    <td className="px-6 py-4 align-top whitespace-nowrap">
                      <span className="font-bold text-gray-900">{row.total}</span>
                    </td>
                    <td className="px-6 py-4 text-center align-top">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold bg-green-50 text-green-700 border border-green-200 uppercase tracking-wide">
                        Berhasil
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
};

export default LaporanKeuangan;