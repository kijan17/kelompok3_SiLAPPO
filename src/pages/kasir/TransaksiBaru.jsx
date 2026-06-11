import React, { useState, useEffect } from 'react';
import { Search, Coffee, CupSoda, Utensils, Award, FileText, ShoppingBag, Plus, Minus, Trash2, X } from 'lucide-react';

const TransaksiKasir = () => {
  // --- STATE UNTUK DATA API, KERANJANG & KATEGORI ---
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Kopi');
  const [searchQuery, setSearchQuery] = useState('');
  
  // State untuk Modal Detail
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // --- AMBIL DATA DARI DATABASE LARAVEL ---
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/products')
      .then(res => res.json())
      .then(data => {
        // Asumsi data dibungkus dalam 'data' oleh Laravel
        const productsFromDB = data.data || data; 
        
        // Sesuaikan format data DB dengan kebutuhan UI React
        const formattedProducts = productsFromDB.map(p => ({
          id: p.id,
          name: p.nama_produk,
          price: Number(p.harga),
          desc: 'Menu spesial dari Lappo Coffee. (Deskripsi belum tersedia di database)',
          category: 'Kopi', // Sementara diset 'Kopi' semua karena belum ada kolom kategori di DB
          image: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=500&q=80', // Gambar default
          tags: ['Tersedia']
        }));
        
        setProducts(formattedProducts);
      })
      .catch(err => console.error("Waduh, gagal narik data menu:", err));
  }, []);

  const categories = [
    { name: 'Semua Menu', icon: <FileText size={16} /> },
    { name: 'Kopi', icon: <Coffee size={16} /> },
    { name: 'Non-Kopi', icon: <CupSoda size={16} /> },
    { name: 'Makanan', icon: <Utensils size={16} /> },
  ];

  // --- FUNGSI KERANJANG ---
  const addToCart = (product) => {
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
    if(window.confirm('Yakin ingin menghapus semua pesanan?')) setCart([]);
  };

  // --- FUNGSI MODAL DETAIL ---
  const openDetailModal = (product) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  // --- KALKULASI HARGA ---
  const totalPembayaran = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const totalPajak = totalPembayaran * 0.11; 

  // --- FUNGSI CHECKOUT KE API LARAVEL ---
 const handleCheckout = () => {
    // 1. Definisikan payload dengan lengkap
    const payload = {
      total_pajak: 0, // Ganti dengan variabel pajakkmu kalau ada
      total_pembayaran: cart.reduce((sum, item) => sum + (item.price * item.qty), 0),
      items: cart.map(item => ({
        id: item.id,      // PENTING: ID produk wajib dikirim
        name: item.name,  // PENTING: Nama produk
        price: item.price,// PENTING: Harga satuan
        qty: item.qty     // PENTING: Jumlah beli
      }))
    };

    // 2. Kirim ke API
    fetch('http://127.0.0.1:8000/api/transactions', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'Accept': 'application/json' 
      },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("Transaksi Berhasil!");
        setCart([]); // Kosongkan keranjang
      } else {
        alert("Gagal: " + data.message);
      }
    })
    .catch(err => {
      console.error("Error API:", err);
      alert("Error Koneksi: " + err);
    });
  };

  // --- FILTER PRODUK ---
  const filteredProducts = products.filter(p => 
    (activeCategory === 'Semua Menu' || p.category === activeCategory) && 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6 animate-in fade-in duration-500 font-sans min-h-screen relative">
      
      {/* ================= AREA KIRI: KATALOG PRODUK ================= */}
      <div className="w-full lg:w-[65%] flex flex-col gap-6 pb-10">
        
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Selamat Datang, <span className="text-[#005432]">Kasir</span></h1>
            <p className="text-gray-500 mt-1">Halaman Transaksi & Pencatatan Penjualan</p>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#005432] outline-none shadow-sm" 
            />
          </div>
        </div>

        {/* KATEGORI FILTER */}
        <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
          <span className="font-bold text-gray-800 text-sm px-2 whitespace-nowrap">Kategori Menu</span>
          <div className="flex gap-2 ml-auto">
            {categories.map((cat) => (
              <button 
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap
                  ${activeCategory === cat.name 
                    ? 'bg-green-50 text-[#005432] border border-green-100' 
                    : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'}`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* GRID PRODUK DINAMIS DARI DATABASE */}
        {products.length === 0 ? (
           <div className="bg-white p-10 rounded-2xl border border-gray-100 text-center flex flex-col items-center justify-center text-gray-400">
              <Coffee size={48} className="mb-4 opacity-50" />
              <p className="font-bold">Memuat menu dari database...</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative flex flex-col">
                
                <div className="flex gap-3 mb-3">
                  <img src={product.image} alt={product.name} className="w-[70px] h-[70px] object-cover rounded-xl border border-gray-100 shrink-0" />
                  <div className="flex flex-col">
                    <h4 className="font-bold text-gray-900 text-sm leading-tight line-clamp-2">{product.name}</h4>
                    <p className="font-black text-[#005432] text-sm mt-auto pt-1">Rp {product.price.toLocaleString('id-ID')}</p>
                  </div>
                </div>

                <div className="flex gap-2 mb-4">
                  {product.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-50 text-[#005432]">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2 mt-auto">
                  <button onClick={() => addToCart(product)} className="flex-1 bg-[#e6f4ea] text-[#005432] py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1 hover:bg-[#005432] hover:text-white transition-colors">
                    <Plus size={14}/> Tambah
                  </button>
                  <button onClick={() => openDetailModal(product)} className="flex-1 bg-gray-50 text-gray-600 py-2 rounded-xl text-xs font-bold border border-gray-100 hover:bg-gray-100 transition-colors">
                    Detail
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= AREA KANAN: KERANJANG PESANAN ================= */}
      <div className="w-full lg:w-[35%]">
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 flex flex-col h-[calc(100vh-2rem)] sticky top-4">
          
          <h3 className="text-lg font-black text-gray-900 mb-6 border-b border-gray-100 pb-4">
            Transaksi Baru
          </h3>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-3">
                <ShoppingBag size={64} strokeWidth={1} />
                <div className="text-center">
                  <p className="font-bold text-gray-400">Belum ada pesanan</p>
                  <p className="text-xs">Silakan klik tombol "+ Tambah" di menu</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-2xl border border-gray-100">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900 text-sm line-clamp-1">{item.name}</span>
                      <span className="text-xs text-gray-500 font-medium">Rp {item.price.toLocaleString('id-ID')}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-1">
                        <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-md">
                          <Minus size={14} />
                        </button>
                        <span className="font-bold text-sm w-4 text-center">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 flex items-center justify-center text-[#005432] bg-green-50 hover:bg-green-100 rounded-md">
                          <Plus size={14} />
                        </button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 p-1">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="bg-gray-50 p-4 rounded-2xl mb-4">
              <div className="flex justify-between items-center mb-1">
                <p className="font-bold text-gray-500 text-sm">Total Pembayaran</p>
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Total Pajak: <br/>Rp {totalPajak.toLocaleString('id-ID')}</p>
                </div>
              </div>
              <h2 className="text-4xl font-black text-gray-400">
                <span className={cart.length > 0 ? "text-[#005432]" : ""}>
                  Rp {totalPembayaran.toLocaleString('id-ID')}
                </span>
              </h2>
            </div>

            <div className="flex gap-2 mb-3">
              <button 
                onClick={clearCart}
                disabled={cart.length === 0} 
                className="flex-1 bg-gray-100 text-gray-400 py-3 rounded-xl font-bold text-sm hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-50 disabled:hover:bg-gray-100 disabled:hover:text-gray-400"
              >
                Hapus Pesanan
              </button>
              <button 
                disabled={cart.length === 0}
                className="flex-1 bg-gray-100 text-gray-400 py-3 rounded-xl font-bold text-sm hover:bg-orange-50 hover:text-orange-500 transition-colors disabled:opacity-50 disabled:hover:bg-gray-100 disabled:hover:text-gray-400"
              >
                Tahan Pesanan
              </button>
            </div>
            
            <button 
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className={`w-full py-4 rounded-xl font-black text-lg transition-all shadow-sm
                ${cart.length > 0 
                  ? 'bg-[#005432] text-white hover:bg-green-900 shadow-md hover:-translate-y-0.5' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            >
              Lanjutkan ke Pembayaran
            </button>
          </div>
        </div>
      </div>

      {/* ================= MODAL DETAIL PRODUK ================= */}
      {isDetailModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsDetailModalOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95">
            <button 
              onClick={() => setIsDetailModalOpen(false)}
              className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10"
            >
              <X size={20} />
            </button>
            <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-56 object-cover" />
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-2xl font-black text-gray-900">{selectedProduct.name}</h2>
                <span className="bg-[#deff9a] text-[#005432] px-3 py-1 rounded-lg font-black text-sm">
                  Rp {selectedProduct.price.toLocaleString('id-ID')}
                </span>
              </div>

              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                {selectedProduct.desc}
              </p>
              
              <button 
                onClick={() => { 
                  addToCart(selectedProduct); 
                  setIsDetailModalOpen(false); 
                }} 
                className="w-full bg-[#005432] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-900 transition-colors shadow-lg"
              >
                <Plus size={18} /> Tambah ke Pesanan
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TransaksiKasir;