import React, { useState, useEffect } from 'react';
import { Printer, DollarSign, Receipt, Coffee } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, PieChart, Pie, Cell } from 'recharts';

const LaporanKeuangan = () => {
  const [data, setData] = useState(null);
  const [namaPengguna, setNamaPengguna] = useState('Owner');

  useEffect(() => {
    // Tarik nama yang sedang login
    const storedName = localStorage.getItem('kasir_name');
    if (storedName) setNamaPengguna(storedName);

    fetch('http://127.0.0.1:8000/api/transactions')
      .then(res => res.json())
      .then(res => setData(res))
      .catch(err => console.error("Error fetching data:", err));
  }, []);

  if (!data) return <div className="p-10 text-center font-bold text-[#005432]">Memuat data laporan...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-sans min-h-screen pb-10">
      
      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Selamat Datang, <span className="text-[#005432]">{namaPengguna}</span></h1>
          <p className="text-gray-500 mt-1">Halaman Laporan Keuangan & Analisis Bisnis (Real-Time)</p>
        </div>
        <button className="flex items-center gap-2 bg-[#005432] text-white px-5 py-2 rounded-lg font-bold hover:bg-green-900 shadow-sm text-sm">
          <Printer size={16} /> Cetak Laporan
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Total Pendapatan', val: data.summary.total_pendapatan, icon: DollarSign, color: 'text-yellow-600', bg: 'bg-yellow-100' },
          { title: 'Total Transaksi', val: `${data.summary.total_transaksi} Nota`, icon: Receipt, color: 'text-gray-600', bg: 'bg-gray-100' },
          { title: 'Rata-rata Penjualan', val: data.summary.rata_rata, icon: Coffee, color: 'text-purple-500', bg: 'bg-purple-100' }
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5">
            <div className={`w-14 h-14 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center`}><item.icon size={28} /></div>
            <div><p className="text-xs font-bold text-gray-500 mb-1">{item.title}</p><h3 className="text-2xl font-black">{item.val}</h3></div>
          </div>
        ))}
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LINE CHART */}
        <div className="lg:col-span-2 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm h-[320px]">
          <h3 className="font-bold text-gray-800 text-sm mb-6">Tren Pendapatan Harian</h3>
          <ResponsiveContainer width="100%" height="80%">
            <AreaChart data={data.chart_data}>
              <defs><linearGradient id="color" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v) => `Rp ${v}Rb`} tick={{fontSize: 10}} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => [`Rp ${v}.000`, 'Pendapatan']} />
              <Area type="monotone" dataKey="current" stroke="#10b981" fill="url(#color)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* PIE CHART */}
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-between h-[320px]">
          <h3 className="font-bold text-gray-800 text-sm">Kategori Terlaris</h3>
          <div className="flex-1 flex items-center justify-center relative h-[150px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.pie_data} dataKey="value" innerRadius={45} outerRadius={70} paddingAngle={5}>
                  {data.pie_data.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip formatter={(v) => [`${v} item`, 'Terjual']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2 px-2">
            {data.pie_data.map((item, i) => (
              <div key={i} className="flex justify-between text-[11px] font-bold text-gray-500">
                <span className="capitalize">{item.name}</span>
                <span className="text-gray-900">{item.value} Item</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 font-bold text-gray-800 text-sm">Rekapitulasi Transaksi Terakhir</div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-[10px] text-gray-400 uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">ID Nota</th>
                <th className="px-6 py-4">Kasir</th>
                <th className="px-6 py-4">Waktu</th>
                <th className="px-6 py-4">Total Penjualan</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {data.recent_transactions.map((row, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-700">{row.id}</td>
                  <td className="px-6 py-4 flex items-center gap-3">
                    {/* Inisial Kasir ditarik langsung dari nama (row.name) jika row.in tidak ada */}
                    <div className="w-8 h-8 rounded-full bg-[#005432] text-white flex items-center justify-center text-[10px] font-bold">
                      {row.name ? row.name.substring(0, 2).toUpperCase() : 'KS'}
                    </div>
                    <span className="font-bold">{row.name}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{row.open} WIB</td>
                  <td className="px-6 py-4 font-black text-[#005432]">{row.total}</td>
                  <td className="px-6 py-4 text-center"><span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase">Berhasil</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LaporanKeuangan;