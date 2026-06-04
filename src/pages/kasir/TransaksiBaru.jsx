import React, { useState } from 'react';
import { Search, Plus, Minus, X, Coffee, CupSoda, Utensils, Award, FileText, ShoppingBag } from 'lucide-react';

const TransaksiBaru = () => {
  // 1. DATA MASTER PRODUK (Kiri)
  const [products] = useState([
    { id: 1, name: 'Arabica Signature', desc: 'Kopi Arabica Iko premium + signatur...', price: 90000, img: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80&w=100&h=100', tags: ['Signature', 'Hemat'] },
    { id: 2, name: 'Kopi Susu Lappo', desc: 'Kopi Susu Lappo racikan rahasia pre...', price: 95000, img: 'https://images.unsplash.com/photo-1578985160538-4e55e3478952?auto=format&fit=crop&q=80&w=100&h=100', tags: ['Signature', 'Hemat'] },
    { id: 3, name: 'Croissant', desc: 'Croissant vaca teriasanilan + Lappo...', price: 20000, img: 'https://images.unsplash.com/photo-1549903072-7e6e0fb26faf?auto=format&fit=crop&q=80&w=100&h=100', tags: ['Signature', 'Hemat'] },
    { id: 4, name: 'Croissant', desc: 'Croissant Lappo organic dan mertice...', price: 25000, img: 'https://images.unsplash.com/photo-1549903072-7e6e0fb26faf?auto=format&fit=crop&q=80&w=100&h=100', tags: ['Signature', 'Hemat'] },
    { id: 5, name: 'Brownies', desc: 'Brownies sauan bernetit, ami kopi...', price: 30000, img: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=100&h=100', tags: ['Signature', 'Hemat'] },
    { id: 6, name: 'Paket Sarapan', desc: 'Brownies Lappo menyanpkan drm bi...', price: 25000, img: 'https://images.unsplash.com/photo-1493770348161-369560ae357d?auto=format&fit=crop&q=80&w=100&h=100', tags: ['Signature', 'Hemat', 'Stok Menipis'] },
  ]);

  // 2. STATE KERANJANG (Di-set kosong di awal)
  const [cart, setCart] = useState([]);

  // Fungsi Tambah ke Keranjang
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item => 
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prevCart, { ...product, qty: 1 }];
    });
  };

  // Fungsi Ubah Qty di Keranjang
  const updateQty = (id, delta) => {
    setCart(prevCart => prevCart.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : item;
      }
      return item;
    }));
  };

  // Fungsi Hapus Item
  const removeItem = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  // 3. MATEMATIKA OTOMATIS
  const subTotal = cart.reduce((total, item) => total + (item.price * item.qty), 0);
  const tax = subTotal * 0.11; // Contoh PPN 11%
  const grandTotal = subTotal + tax;

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] font-sans animate-in fade-in duration-500 pb-4">
      
      {/* 1. HEADER HALAMAN CONTENT */}
      <div className="flex justify-between items-start mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Selamat Datang, <span className="text-[#005432]">Kasir</span></h1>
          <p className="text-gray-500 mt-1">Halaman Transaksi & Pencatatan Penjualan</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search" 
            className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#005432] w-80 shadow-sm"
          />
        </div>
      </div>

      {/* 2. MAIN SPLIT CONTENT */}
      <div className="flex flex-1 gap-6 min-h-0 mb-4">
        
        {/* KIRI: KATALOG PRODUK (60-65%) */}
        <div className="w-[62%] flex flex-col gap-4">
          
          {/* Header & Filter Nav */}
          <div className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl shadow-sm border border-gray-100 shrink-0">
            <span className="text-lg font-bold text-gray-900">Menu Produk (Pilih Item)</span>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-4 py-1.5 bg-green-100 text-[#005432] rounded-lg text-sm font-bold border border-green-200">
                <Coffee size={16} /> Kopi
              </button>
              <button className="flex items-center gap-1.5 px-4 py-1.5 bg-white text-gray-600 rounded-lg text-sm font-medium border border-gray-200 hover:bg-gray-50">
                <CupSoda size={16} /> Non-Kopi
              </button>
              <button className="flex items-center gap-1.5 px-4 py-1.5 bg-white text-gray-600 rounded-lg text-sm font-medium border border-gray-200 hover:bg-gray-50">
                <Utensils size={16} /> Makanan
              </button>
              <button className="flex items-center gap-1.5 px-4 py-1.5 bg-pink-50 text-pink-600 rounded-lg text-sm font-bold border border-pink-200">
                <Award size={16} /> Terlaris
              </button>
              <button className="p-1.5 text-gray-400 border border-gray-200 rounded-lg hover:bg-gray-50">
                <FileText size={18} />
              </button>
            </div>
          </div>

          {/* Grid Produk */}
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((p) => (
                <div key={p.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col relative group">
                  {/* Badge Stok Menipis */}
                  {p.tags.includes('Stok Menipis') && (
                    <span className="absolute top-3 right-3 bg-orange-100 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded-md">
                      Stok Menipis
                    </span>
                  )}
                  
                  {/* Info Atas */}
                  <div className="flex gap-3 mb-3">
                    <img src={p.img} alt={p.name} className="w-[72px] h-[72px] rounded-xl object-cover border border-gray-100 shrink-0" />
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm leading-tight group-hover:text-[#005432] transition-colors">{p.name}</h3>
                      <p className="text-[10px] text-gray-500 mt-1 line-clamp-2 leading-snug">{p.desc}</p>
                      <p className="font-bold text-gray-900 text-sm mt-1">Rp {p.price.toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                  
                  {/* Tags */}
                  <div className="flex gap-1.5 mb-4">
                    <span className="bg-green-100 text-[#005432] text-[10px] font-bold px-2 py-0.5 rounded-md">Signature</span>
                    <span className="bg-pink-100 text-pink-600 text-[10px] font-bold px-2 py-0.5 rounded-md">Hemat</span>
                  </div>

                  {/* Tombol Aksi */}
                  <div className="flex gap-2 mt-auto">
                    <button 
                      onClick={() => addToCart(p)}
                      className="flex-1 flex justify-center items-center gap-1 py-2 bg-green-100 text-[#005432] rounded-lg text-sm font-bold hover:bg-green-200 transition-colors"
                    >
                      <Plus size={16} /> Tambah
                    </button>
                    <button className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors">
                      Detail
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* KANAN: KERANJANG (38%) */}
        <div className="w-[38%] bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          
          {/* Header Cart */}
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-bold text-gray-900 text-lg">Transaksi Baru - No. LC-TRX-001</h2>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60">
                <ShoppingBag size={48} className="mb-3 text-gray-300" />
                <p className="font-medium text-gray-500">Belum ada pesanan</p>
                <p className="text-xs mt-1">Silakan klik tombol "+ Tambah" di menu</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex items-center gap-3 border-b border-gray-50 pb-4 animate-in slide-in-from-right-4 duration-300">
                  <img src={item.img} alt={item.name} className="w-12 h-12 rounded-xl object-cover border border-gray-100" />
                  <div className="flex-1">
                    <h4 className="font-bold text-sm text-gray-900">{item.name}</h4>
                    <p className="text-sm font-bold text-gray-600">Rp {(item.price * item.qty).toLocaleString('id-ID')}</p>
                  </div>
                  
                  {/* Controls Qty */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-500 w-5 text-right">{item.qty}x</span>
                    <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
                      <button onClick={() => updateQty(item.id, -1)} className="p-1.5 text-gray-500 hover:bg-gray-200 rounded-md"><Minus size={14} /></button>
                      <span className="px-2 text-sm font-bold w-6 text-center">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="p-1.5 text-green-600 hover:bg-green-100 rounded-md"><Plus size={14} /></button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="p-1 text-gray-400 hover:text-red-500 transition-colors"><X size={18} /></button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Summary & Buttons */}
          <div className="p-5 border-t border-gray-100 space-y-4 bg-white shrink-0">
            {/* Box Total */}
            <div className={`rounded-2xl p-5 border transition-colors ${cart.length === 0 ? 'bg-gray-50 border-gray-200' : 'bg-[#f0ece1] border-[#e5dfce]'}`}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-700 font-bold">Total Pembayaran</span>
                <span className="text-xs text-gray-600 font-medium text-right">Total Pajak:<br/>Rp {tax.toLocaleString('id-ID')}</span>
              </div>
              <h2 className={`text-4xl font-bold tracking-tight ${cart.length === 0 ? 'text-gray-400' : 'text-gray-900'}`}>
                Rp {grandTotal.toLocaleString('id-ID')}
              </h2>
            </div>

            {/* Aksi Button */}
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setCart([])} 
                disabled={cart.length === 0}
                className={`py-3 rounded-xl text-sm font-bold transition-colors ${cart.length === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-pink-100 text-pink-700 border border-pink-200 hover:bg-pink-200'}`}
              >
                Hapus Pesanan
              </button>
              <button 
                disabled={cart.length === 0}
                className={`py-3 rounded-xl text-sm font-bold transition-colors ${cart.length === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-yellow-50 text-yellow-700 border border-yellow-200 hover:bg-yellow-100'}`}
              >
                Tahan Pesanan
              </button>
            </div>
            <button 
              disabled={cart.length === 0}
              className={`w-full py-4 rounded-xl text-sm font-bold shadow-sm transition-all ${cart.length === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#005432] text-white hover:bg-[#004225] shadow-md'}`}
            >
              Lanjutkan ke Pembayaran
            </button>
          </div>
        </div>
      </div>

      {/* 3. FOOTER INFO (Hanya Produk Terlaris) */}
      <div className="shrink-0 pb-2">
        <div className="bg-white px-5 py-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-10 h-10 bg-pink-50 text-pink-500 rounded-xl flex items-center justify-center shrink-0">
            <Award size={20} />
          </div>
          <div>
            <span className="text-sm font-bold text-gray-800 block">Produk Terlaris Saat Ini:</span>
            <span className="text-sm text-gray-600 font-medium">1. Kopi Susu Lappo, 2. Croissant</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default TransaksiBaru;