import React, { useState, useEffect } from 'react';
import { Search, Coffee, CupSoda, Utensils, FileText, ShoppingBag, Plus, Minus, Trash2, X, Lock } from 'lucide-react';

const TransaksiKasir = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Semua Menu');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [namaKasir, setNamaKasir] = useState('Kasir');
  const [isShiftActive, setIsShiftActive] = useState(false);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const [isContentMounted, setIsContentMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => { setIsContentMounted(true); }, 100);

    const storedName = localStorage.getItem('kasir_name');
    if (storedName) setNamaKasir(storedName);

    const kasirId = localStorage.getItem('kasir_id');
    const shiftStatus = localStorage.getItem(`is_shift_active_${kasirId}`);
    setIsShiftActive(shiftStatus === 'true');

    fetch('http://127.0.0.1:8000/api/products')
      .then(res => res.json())
      .then(data => {
        const productsFromDB = data.data || data; 
        const formattedProducts = productsFromDB.map(p => ({
          id: p.id,
          name: p.nama_produk,
          price: Number(p.harga),
          desc: 'Menu spesial dari Lappo Coffee. Diramu dengan bahan berkualitas tinggi.',
          category: 'Kopi', 
          tags: ['Tersedia']
        }));
        setProducts(formattedProducts);
      })
      .catch(err => console.error("Gagal menarik data menu:", err));
  }, []);

  const categories = [
    { name: 'Semua Menu', icon: <FileText size={16} /> },
    { name: 'Kopi', icon: <Coffee size={16} /> },
    { name: 'Non-Kopi', icon: <CupSoda size={16} /> },
    { name: 'Makanan', icon: <Utensils size={16} /> },
  ];

  const addToCart = (product) => {
    if (!isShiftActive) return; 
    
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const updateQty = (id, amount) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = item.qty + amount;
        return newQty > 0 ? { ...item, qty: newQty } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (id) => setCart(cart.filter(item => item.id !== id));
  
  const clearCart = () => {
    if(window.confirm('Yakin ingin menghapus semua pesanan dari keranjang?')) setCart([]);
  };

  const openDetailModal = (product) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  const totalPembayaran = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const totalPajak = totalPembayaran * 0.11; 

  const handleCheckout = () => {
    const kasirId = localStorage.getItem('kasir_id');

    const payload = {
      kasir_id: kasirId,
      total_pajak: 0, 
      total_pembayaran: totalPembayaran,
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        qty: item.qty 
      }))
    };

    fetch('http://127.0.0.1:8000/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("Transaksi Berhasil Diproses!");
        setCart([]);
      } else {
        alert("Gagal: " + data.message);
      }
    })
    .catch(err => {
      console.error("Error API:", err);
      alert("Error Koneksi ke Server.");
    });
  };

  const filteredProducts = products.filter(p => 
    (activeCategory === 'Semua Menu' || p.category === activeCategory) && 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative min-h-screen font-sans">
      <div className={`flex flex-col xl:flex-row gap-6 transition-all duration-700 ease-out transform ${isContentMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        
        {/* AREA KIRI: KATALOG PRODUK */}
        <div className="w-full xl:w-[65%] flex flex-col gap-6 pb-10">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 border-b border-gray-200 pb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Katalog <span className="text-[#005432]">Menu</span></h1>
              <p className="text-gray-500 mt-1 text-sm">Pilih menu dan kelola pesanan pelanggan.</p>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" placeholder="Cari nama menu..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#005432]/20 focus:border-[#005432] outline-none transition-all shadow-sm" 
              />
            </div>
          </div>

          {!isShiftActive && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-4 shadow-sm relative overflow-hidden">
              <div className="absolute left-0 top-0 w-2 h-full bg-red-500"></div>
              <div className="bg-red-100 text-red-600 p-3 rounded-full ml-2">
                <Lock size={20} />
              </div>
              <div>
                <p className="font-bold text-sm uppercase tracking-wide">Sistem POS Terkunci</p>
                <p className="text-xs font-medium mt-0.5 opacity-80">Anda belum memulai shift. Buka Dashboard Kasir dan klik "Mulai Shift" untuk mengaktifkan fitur pesanan.</p>
              </div>
            </div>
          )}

          {/* KATEGORI FILTER */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <button key={cat.name} onClick={() => setActiveCategory(cat.name)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap border shadow-sm
                  ${activeCategory === cat.name 
                    ? 'bg-[#005432] text-white border-[#005432]' 
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>

          {/* GRID PRODUK (Tanpa Gambar) */}
          {products.length === 0 ? (
             <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center flex flex-col items-center justify-center text-gray-400 shadow-sm">
                <Coffee size={48} className="mb-4 opacity-50" />
                <p className="font-bold text-gray-500">Memuat katalog menu...</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <div key={product.id} className={`bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col h-full transition-all ${!isShiftActive ? 'opacity-50 grayscale-[50%]' : 'hover:border-[#005432]/40 hover:shadow-md'}`}>
                  
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-gray-900 text-base leading-snug pr-3">{product.name}</h4>
                    <span className={`shrink-0 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${!isShiftActive ? 'bg-gray-100 text-gray-500' : 'bg-green-50 text-[#005432] border border-green-100'}`}>{product.tags[0]}</span>
                  </div>
                  
                  <p className="font-black text-[#005432] text-lg mb-5">Rp {product.price.toLocaleString('id-ID')}</p>
                  
                  <div className="flex gap-2 mt-auto">
                    <button 
                      onClick={() => addToCart(product)} 
                      disabled={!isShiftActive}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 transition-colors border
                        ${isShiftActive ? 'bg-[#005432] border-[#005432] text-white hover:bg-green-900 hover:border-green-900' : 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'}`}
                    >
                      <Plus size={16} strokeWidth={2.5}/> Tambah
                    </button>
                    <button onClick={() => openDetailModal(product)} className="w-11 h-11 flex items-center justify-center bg-gray-50 text-gray-600 rounded-xl border border-gray-200 hover:bg-gray-100 hover:text-[#005432] transition-colors">
                      <FileText size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AREA KANAN: KERANJANG (Tetap sama) */}
        <div className="w-full xl:w-[35%]">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col h-[calc(100vh-2.5rem)] sticky top-5">
            <h3 className="text-lg font-bold text-gray-900 mb-5 border-b border-gray-100 pb-4 flex items-center gap-2">
              <ShoppingBag size={20} className="text-[#005432]" /> Keranjang Pesanan
            </h3>
            
            <div className="flex-1 overflow-y-auto pr-2">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-4 opacity-70">
                  <ShoppingBag size={56} strokeWidth={1} />
                  <div className="text-center">
                    <p className="font-semibold text-gray-500 text-sm">Keranjang Masih Kosong</p>
                    <p className="text-xs mt-1">Pilih menu dari katalog untuk menambahkan.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors shadow-sm">
                      <div className="flex flex-col max-w-[50%]">
                        <span className="font-semibold text-gray-900 text-sm line-clamp-1">{item.name}</span>
                        <span className="text-xs text-[#005432] font-bold mt-0.5">Rp {item.price.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg p-0.5">
                          <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-white hover:shadow-sm rounded-md transition-all"><Minus size={14} strokeWidth={2.5} /></button>
                          <span className="font-bold text-sm w-6 text-center text-gray-800">{item.qty}</span>
                          <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 flex items-center justify-center text-[#005432] hover:bg-white hover:shadow-sm rounded-md transition-all"><Plus size={14} strokeWidth={2.5} /></button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 bg-red-50 p-2 rounded-lg transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-5 pt-5 border-t border-gray-100">
              <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl mb-4">
                <div className="flex justify-between items-center mb-1">
                  <p className="font-semibold text-gray-500 text-xs uppercase tracking-wider">Total Pembayaran</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase text-right">Termasuk Pajak <br/>Rp {totalPajak.toLocaleString('id-ID')}</p>
                </div>
                <h2 className="text-3xl font-black text-gray-900 mt-1">
                  Rp {totalPembayaran.toLocaleString('id-ID')}
                </h2>
              </div>
              
              <div className="flex gap-3 mb-3">
                <button onClick={clearCart} disabled={cart.length === 0} className="flex-1 bg-white border border-gray-200 text-gray-500 py-2.5 rounded-xl font-bold text-xs hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all disabled:opacity-50 shadow-sm">Kosongkan</button>
                <button disabled={cart.length === 0} className="flex-1 bg-white border border-gray-200 text-gray-500 py-2.5 rounded-xl font-bold text-xs hover:bg-orange-50 hover:text-orange-600 hover:border-orange-100 transition-all disabled:opacity-50 shadow-sm">Tahan Pesanan</button>
              </div>
              
              <button 
                onClick={handleCheckout} 
                disabled={cart.length === 0 || !isShiftActive} 
                className={`w-full py-4 rounded-xl font-bold text-base transition-all shadow-sm flex items-center justify-center gap-2
                  ${cart.length > 0 && isShiftActive ? 'bg-[#005432] text-white hover:bg-green-900 shadow-md hover:-translate-y-0.5' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
              >
                Proses Pembayaran &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DI LUAR DIV ANIMASI */}
      {isDetailModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={() => setIsDetailModalOpen(false)}></div>
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 border border-gray-100">
            <div className="p-6 bg-gray-50 flex justify-between items-center border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Detail Menu</h2>
                <button onClick={() => setIsDetailModalOpen(false)} className="bg-white text-gray-500 p-1.5 rounded-full shadow-sm hover:text-gray-800 transition-colors"><X size={18} /></button>
            </div>
            <div className="p-6 bg-white">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedProduct.name}</h2>
                <span className="inline-block bg-green-50 text-[#005432] border border-green-100 px-2.5 py-1 rounded-lg font-bold text-sm">Rp {selectedProduct.price.toLocaleString('id-ID')}</span>
              </div>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed font-medium">{selectedProduct.desc}</p>
              
              <button 
                onClick={() => { addToCart(selectedProduct); setIsDetailModalOpen(false); }} 
                disabled={!isShiftActive}
                className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm
                  ${isShiftActive ? 'bg-[#005432] text-white hover:bg-green-900 hover:shadow-md hover:-translate-y-0.5' : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'}`}
              >
                <Plus size={18} /> Tambahkan ke Pesanan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransaksiKasir;