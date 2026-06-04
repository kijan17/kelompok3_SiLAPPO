import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Coffee, Milk, Droplet, Package } from 'lucide-react';

const StokBahan = () => {
  // Data dummy stok bahan baku
  const [stocks] = useState([
    {
      id: 1,
      name: 'Biji Arabica Gayo Premium',
      category: 'Kopi',
      imageIcon: <Coffee size={24} className="text-[#005432]" />,
      stockLevel: 75, // Persentase
      amount: '15 Kg',
      status: 'Stok Aman',
      color: 'bg-green-300',
      textColor: 'text-green-700',
      badgeColor: 'bg-green-100'
    },
    {
      id: 2,
      name: 'Susu UHT Full Cream',
      category: 'Susu',
      imageIcon: <Milk size={24} className="text-yellow-600" />,
      stockLevel: 25,
      amount: '5 Liter',
      status: 'Stok Menipis',
      color: 'bg-yellow-300',
      textColor: 'text-yellow-700',
      badgeColor: 'bg-yellow-100'
    },
    {
      id: 3,
      name: 'Gula Aren Bubuk',
      category: 'Gula',
      imageIcon: <Droplet size={24} className="text-red-600" />,
      stockLevel: 10,
      amount: '1 Kg',
      status: 'Stok Menipis',
      color: 'bg-red-300',
      textColor: 'text-red-700',
      badgeColor: 'bg-red-100'
    },
    {
      id: 4,
      name: 'Paper Cup 16oz',
      category: 'Kemasan',
      imageIcon: <Package size={24} className="text-[#005432]" />,
      stockLevel: 90,
      amount: '2000 pcs',
      status: 'Stok Aman',
      color: 'bg-green-300',
      textColor: 'text-green-700',
      badgeColor: 'bg-green-100'
    }
  ]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-sans">
      
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Selamat Datang, <span className="text-[#005432]">Owner</span></h1>
          <p className="text-gray-500 mt-1">Kelola Persediaan Bahan Baku Anda</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 bg-[#005432] text-white px-4 py-2.5 rounded-lg font-medium hover:bg-[#004225] transition-all">
            <Plus size={18} />
            Tambah Bahan Baku Baru
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search" 
              className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#005432] w-64"
            />
          </div>
        </div>
      </div>

      {/* Filter Kategori */}
      <div className="flex justify-end items-center gap-2 text-sm text-gray-600 mb-6">
        <span>Kategori:</span>
        {['Kopi', 'Susu', 'Gula', 'Kemasan'].map(cat => (
          <select key={cat} className="border border-gray-200 rounded-md px-2 py-1.5 bg-white focus:outline-none">
            <option>{cat}</option>
          </select>
        ))}
      </div>

      {/* Grid Card Stok */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stocks.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col">
            
            {/* Info Bahan */}
            <div className="flex gap-4 mb-6">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden">
                 {/* Dummy Image Box */}
                 <div className="w-full h-full bg-slate-200 object-cover"></div>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Foto bahan</p>
                <h3 className="font-bold text-gray-800 text-sm leading-tight mb-1">{item.name}</h3>
                <p className="text-[10px] text-gray-500">Kategori <br/><span className="font-semibold text-gray-700">{item.category}</span></p>
              </div>
            </div>

            {/* Indikator Stok & Angka */}
            <div className="flex items-center gap-6 mb-6">
              {/* Vertical Progress Bar */}
              <div className="relative w-12 h-32 bg-gray-100 rounded-full overflow-hidden flex flex-col justify-end">
                <div 
                  className={`w-full ${item.color} rounded-full transition-all duration-1000`} 
                  style={{ height: `${item.stockLevel}%` }}
                ></div>
                {/* Icon inside the bar */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white p-1 rounded-full shadow-sm opacity-80">
                    {item.imageIcon}
                  </div>
                </div>
              </div>

              {/* Detail Angka */}
              <div>
                <span className={`text-[10px] px-2 py-1 rounded-md font-bold ${item.badgeColor} ${item.textColor}`}>
                  {item.status}
                </span>
                <h2 className="text-3xl font-bold text-gray-800 mt-2">{item.stockLevel}%</h2>
                <p className="text-xs text-gray-500 mt-2">Jumlah</p>
                <p className="font-bold text-gray-800 text-lg">{item.amount}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-auto">
              <button className={`flex-1 flex justify-center items-center gap-1 py-2 rounded-lg border text-xs font-bold transition-all ${item.badgeColor} border-transparent text-gray-700 hover:brightness-95`}>
                <Edit size={14} /> Edit Stok
              </button>
              <button className="flex-1 flex justify-center items-center gap-1 py-2 rounded-lg border bg-red-50 border-red-100 text-red-600 text-xs font-bold hover:bg-red-100 transition-all">
                <Trash2 size={14} /> Hapus
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Summary Cards di Bawah */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
          <span className="font-bold text-gray-700">Total Bahan Baku</span>
          <span className="font-bold text-xl text-gray-900">10</span>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
          <span className="font-bold text-gray-700">Total Pengeluaran Bulan Ini</span>
          <span className="font-bold text-xl text-gray-900">Rp 12.5M</span>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
          <span className="font-bold text-gray-700">Total Produk Tersedia</span>
          <span className="font-bold text-xl text-gray-900">7</span>
        </div>
      </div>

    </div>
  );
};

export default StokBahan;