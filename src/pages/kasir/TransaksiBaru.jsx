import React, { useState, useEffect } from 'react';
import { Search, Coffee, FileText, ShoppingBag, Plus, Minus, Trash2, X, Lock, CheckCircle2, AlertCircle, Droplet, ChevronLeft, ChevronRight } from 'lucide-react';

const TransaksiKasir = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  
  // STATE PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  
  const [namaKasir, setNamaKasir] = useState('Kasir');
  const [isShiftActive, setIsShiftActive] = useState(false);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // STATE UNTUK POP-UP KONFIRMASI TAMBAH KE KERANJANG
  const [isConfirmAddOpen, setIsConfirmAddOpen] = useState(false);
  const [productToAdd, setProductToAdd] = useState(null);

  const [isContentMounted, setIsContentMounted] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const [isConfirmClearOpen, setIsConfirmClearOpen] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3000);
  };

  useEffect(() => {
    setTimeout(() => { setIsContentMounted(true); }, 100);

    const storedName = localStorage.getItem('kasir_name');
    if (storedName) setNamaKasir(storedName);

    const kasirId = localStorage.getItem('kasir_id');
    const shiftStatus = localStorage.getItem(`is_shift_active_${kasirId}`);
    setIsShiftActive(shiftStatus === 'true');
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts(currentPage, searchQuery, activeCategory);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, searchQuery, activeCategory]);

  const fetchProducts = (page, search, category) => {
    let url = `http://127.0.0.1:8000/api/products?page=${page}&search=${search}`;
    if (category !== 'Semua') {
        url += `&kategori=${category}`;
    }

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
            const productsFromDB = data.data.data; 
            const formattedProducts = productsFromDB.map(p => ({
              id: p.id,
              name: p.nama_produk,
              price: Number(p.harga),
              category: p.kategori || 'Coffee',
              gambar: p.gambar,
              desc: 'Menu spesial dari Lappo Coffee. Diramu dengan bahan berkualitas tinggi.',
              tags: ['Tersedia']
            }));
            
            setProducts(formattedProducts);
            setCurrentPage(data.data.current_page);
            setLastPage(data.data.last_page);
        }
      })
      .catch(err => {
        console.error("Gagal menarik data menu:", err);
        showToast("Gagal terhubung ke server untuk mengambil menu.", "error");
      });
  };

  const handleCategoryChange = (cat) => {
      setActiveCategory(cat);
      setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
      setSearchQuery(e.target.value);
      setCurrentPage(1);
  };

  // FUNGSI MEMUNCULKAN POP-UP TAMBAH KERANJANG
  const handleAddToCartClick = (product) => {
    if (!isShiftActive) {
      showToast("Shift belum dimulai! Tidak bisa menambah pesanan.", "error");
      return; 
    }
    setProductToAdd(product);
    setIsConfirmAddOpen(true);
  };

  // FUNGSI EKSEKUSI TAMBAH KE KERANJANG (SETELAH KLIK YA)
  const executeAddToCart = () => {
    if (!productToAdd) return;
    
    const existing = cart.find(item => item.id === productToAdd.id);
    if (existing) {
      setCart(cart.map(item => item.id === productToAdd.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...productToAdd, qty: 1 }]);
    }
    
    setIsConfirmAddOpen(false);
    setProductToAdd(null);
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
  
  const handleClearCartClick = () => { setIsConfirmClearOpen(true); };

  const executeClearCart = () => {
    setCart([]);
    setIsConfirmClearOpen(false);
    showToast("Keranjang berhasil dikosongkan.", "success");
  };

  const openDetailModal = (product) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  // MENGHAPUS LOGIKA PAJAK
  const totalPembayaran = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const handleCheckout = () => {
    const kasirId = localStorage.getItem('kasir_id');

    const payload = {
      kasir_id: kasirId,
      total_pembayaran: totalPembayaran,
      items: cart.map(item => ({ id: item.id, name: item.name, price: item.price, qty: item.qty }))
    };

    fetch('http://127.0.0.1:8000/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        showToast("Transaksi Berhasil Diproses!", "success");
        setCart([]);
      } else {
        showToast("Gagal: " + data.message, "error");
      }
    })
    .catch(err => {
      console.error("Error API:", err);
      showToast("Error koneksi ke server. Periksa jaringan Anda.", "error");
    });
  };

  return (
    <div className="relative min-h-screen font-sans overflow-hidden">
      
      {/* TOAST NOTIFICATION POP-UP */}
      <div className={`fixed top-6 right-6 z-[9999] transition-all duration-500 transform ${toast.visible ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-20 opacity-0 scale-95 pointer-events-none'}`}>
        <div className={`flex items-start gap-3 px-5 py-4 rounded-2xl shadow-2xl border ${toast.type === 'success' ? 'bg-white border-green-100' : 'bg-white border-red-100'}`}>
          <div className={`p-2 rounded-full shrink-0 ${toast.type === 'success' ? 'bg-green-50 text-[#005432]' : 'bg-red-50 text-red-600'}`}>
            {toast.type === 'success' ? <CheckCircle2 size={20} strokeWidth={2.5} /> : <AlertCircle size={20} strokeWidth={2.5} />}
          </div>
          <div className="pr-2">
            <p className={`text-sm font-bold ${toast.type === 'success' ? 'text-gray-900' : 'text-red-700'}`}>
              {toast.type === 'success' ? 'Berhasil!' : 'Peringatan Sistem'}
            </p>
            <p className="text-xs text-gray-500 font-medium mt-0.5">{toast.message}</p>
          </div>
        </div>
      </div>

      <div className={`flex flex-col xl:flex-row gap-6 transition-all duration-700 ease-out transform ${isContentMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        
        {/* AREA KIRI: KATALOG PRODUK */}
        <div className="w-full xl:w-[65%] flex flex-col gap-6 pb-10 p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 border-b border-gray-200 pb-5">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Katalog <span className="text-[#005432]">Menu</span></h1>
              <p className="text-gray-500 mt-1 text-sm">Pilih menu dan kelola pesanan pelanggan.</p>
            </div>
            {/* SEARCH BAR */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Cari nama menu..." 
                value={searchQuery} 
                onChange={handleSearchChange}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#005432]/20 focus:border-[#005432] outline-none transition-all shadow-sm" 
              />
            </div>
          </div>

          {/* TOMBOL FILTER KATEGORI */}
          <div className="flex gap-3">
              {['Semua', 'Coffee', 'Non-Coffee'].map((cat) => (
                  <button key={cat} onClick={() => handleCategoryChange(cat)} className={`px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-sm ${activeCategory === cat ? 'bg-[#005432] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                      {cat}
                  </button>
              ))}
          </div>

          {!isShiftActive && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-4 shadow-sm relative overflow-hidden mb-2">
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

          {/* GRID PRODUK DENGAN GAMBAR */}
          {products.length === 0 ? (
             <div className="bg-white p-12 rounded-2xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
                  <Search size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Menu Tidak Ditemukan</h3>
                <p className="text-gray-500 text-sm mt-1">Belum ada menu di kategori ini atau pencarian tidak cocok.</p>
             </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {products.map((product) => (
                  <div key={product.id} className={`bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full transition-all duration-300 group ${!isShiftActive ? 'opacity-60 grayscale-[50%]' : 'hover:shadow-xl hover:-translate-y-1 hover:border-[#005432]/40'}`}>
                    
                    {/* AREA GAMBAR MENU */}
                    <div className="h-40 w-full bg-gray-50 relative overflow-hidden border-b border-gray-100 shrink-0">
                        {product.gambar ? (
                            <img src={`http://127.0.0.1:8000/storage/${product.gambar}`} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400">
                                {product.category === 'Non-Coffee' ? <Droplet size={32} className="mb-2 opacity-40" /> : <Coffee size={32} className="mb-2 opacity-40" />}
                                <span className="font-black text-xl opacity-30 uppercase tracking-widest">{product.name.substring(0, 2)}</span>
                            </div>
                        )}
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md border border-white/20 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">{product.tags[0]}</span>
                        </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-bold text-gray-900 text-lg leading-snug pr-3 group-hover:text-[#005432] transition-colors">{product.name}</h4>
                      </div>
                      <div className="mt-auto pt-2">
                        <div className="inline-block bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg">
                          <p className="font-black text-[#005432] text-lg tracking-tight">Rp {product.price.toLocaleString('id-ID')}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-gray-50/80 border-t border-gray-100 flex gap-2">
                      <button onClick={() => handleAddToCartClick(product)} disabled={!isShiftActive} className={`flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm ${isShiftActive ? 'bg-[#005432] text-white hover:bg-green-900' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                        <Plus size={16} strokeWidth={3}/> Tambah
                      </button>
                      <button onClick={() => openDetailModal(product)} className="w-12 h-12 flex items-center justify-center bg-white text-gray-600 rounded-xl border border-gray-200 hover:bg-gray-50 hover:text-[#005432] transition-colors shadow-sm shrink-0">
                        <FileText size={18} strokeWidth={2.5}/>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* AREA PAGINATION */}
              <div className="flex items-center justify-center gap-4 mt-10 mb-4">
                <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className={`flex items-center gap-1 px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-100' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'}`}><ChevronLeft size={16} /> Sebelumnya</button>
                <div className="bg-white border border-gray-200 px-5 py-2.5 rounded-xl shadow-sm"><span className="text-sm font-semibold text-gray-600">Halaman <span className="text-[#005432] font-black">{currentPage}</span> dari {lastPage || 1}</span></div>
                <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, lastPage))} disabled={currentPage === lastPage || lastPage === 0} className={`flex items-center gap-1 px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${currentPage === lastPage || lastPage === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-100' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'}`}>Selanjutnya <ChevronRight size={16} /></button>
              </div>
            </div>
          )}
        </div>

        {/* AREA KANAN: KERANJANG */}
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
                </div>
                <h2 className="text-3xl font-black text-gray-900 mt-1">
                  Rp {totalPembayaran.toLocaleString('id-ID')}
                </h2>
              </div>
              
              <div className="flex mb-3">
                <button onClick={handleClearCartClick} disabled={cart.length === 0} className="w-full bg-white border border-gray-200 text-gray-500 py-3 rounded-xl font-bold text-sm hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all disabled:opacity-50 shadow-sm">Kosongkan Keranjang</button>
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

      {/* MODAL KONFIRMASI TAMBAH KE KERANJANG */}
      {isConfirmAddOpen && productToAdd && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsConfirmAddOpen(false)}></div>
          <div className="relative w-full max-w-xs bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 border border-gray-100 p-6 text-center">
            <div className="w-16 h-16 bg-green-50 text-[#005432] rounded-full flex items-center justify-center mx-auto mb-4 border border-green-100">
              <ShoppingBag size={28} strokeWidth={2.5} />
            </div>
            <h2 className="text-xl font-black text-gray-900 mb-2">Tambah Pesanan?</h2>
            <p className="text-sm text-gray-500 mb-6 font-medium leading-relaxed">
              Masukkan <b className="text-gray-800">{productToAdd.name}</b> ke dalam keranjang pesanan?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setIsConfirmAddOpen(false)} className="flex-1 bg-gray-50 border border-gray-200 text-gray-600 py-3 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors">
                Batal
              </button>
              <button onClick={executeAddToCart} className="flex-1 bg-[#005432] text-white py-3 rounded-xl font-bold text-sm hover:bg-green-900 transition-colors shadow-sm">
                Ya, Tambah
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DETAIL MENU */}
      {isDetailModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={() => setIsDetailModalOpen(false)}></div>
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 border border-gray-100">
            <div className="p-6 bg-gray-50 flex justify-between items-center border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Detail Menu</h2>
                <button onClick={() => setIsDetailModalOpen(false)} className="bg-white text-gray-500 p-1.5 rounded-full shadow-sm hover:text-gray-800 transition-colors"><X size={18} strokeWidth={2.5} /></button>
            </div>
            <div className="p-6 bg-white">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedProduct.name}</h2>
                <span className="inline-block bg-green-50 text-[#005432] border border-green-100 px-3 py-1.5 rounded-lg font-bold text-sm">Rp {selectedProduct.price.toLocaleString('id-ID')}</span>
              </div>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed font-medium">{selectedProduct.desc}</p>
              
              <button 
                onClick={() => { 
                  setIsDetailModalOpen(false); 
                  handleAddToCartClick(selectedProduct);
                }} 
                disabled={!isShiftActive}
                className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm
                  ${isShiftActive ? 'bg-[#005432] text-white hover:bg-green-900 hover:shadow-md hover:-translate-y-0.5' : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'}`}
              >
                <Plus size={18} strokeWidth={2.5}/> Tambahkan ke Pesanan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI KOSONGKAN KERANJANG */}
      {isConfirmClearOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsConfirmClearOpen(false)}></div>
          <div className="relative w-full max-w-xs bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 border border-gray-100 p-6 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
              <Trash2 size={28} strokeWidth={2.5} />
            </div>
            <h2 className="text-xl font-black text-gray-900 mb-2">Kosongkan Pesanan?</h2>
            <p className="text-sm text-gray-500 mb-6 font-medium leading-relaxed">Seluruh item di keranjang akan dihapus dan tidak bisa dikembalikan.</p>
            <div className="flex gap-3">
              <button onClick={() => setIsConfirmClearOpen(false)} className="flex-1 bg-gray-50 border border-gray-200 text-gray-600 py-3 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors">
                Batal
              </button>
              <button onClick={executeClearCart} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold text-sm hover:bg-red-600 transition-colors shadow-sm">
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransaksiKasir;