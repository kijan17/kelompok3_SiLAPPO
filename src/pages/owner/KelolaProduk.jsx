import React, { useState, useEffect } from 'react';
import { Plus, Edit2, X, Save, Trash2, ShoppingBag, Layers, AlertCircle, CheckCircle2, Search, ChevronLeft, ChevronRight, Coffee, Droplet, ImagePlus } from 'lucide-react';

const KelolaProduk = () => {
  const [products, setProducts] = useState([]);
  const [allIngredients, setAllIngredients] = useState([]); 
  
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  
  // STATE BARU: Untuk menyimpan status tab kategori yang sedang aktif
  const [activeCategory, setActiveCategory] = useState('Semua');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const [formData, setFormData] = useState({ nama_produk: '', harga: '', kategori: 'Coffee', gambarFile: null });
  const [selectedIngredients, setSelectedIngredients] = useState([]); 
  const [tempIngredient, setTempIngredient] = useState({ id: '', qty: '' });

  const [isContentMounted, setIsContentMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3000);
  };

  useEffect(() => { 
    setTimeout(() => { setIsContentMounted(true); }, 100);
    fetchIngredients(); 
  }, []);

  // UPDATE EFFECT: Menambahkan activeCategory ke dalam array dependency
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts(currentPage, searchQuery, activeCategory);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, searchQuery, activeCategory]);

  // UPDATE FETCH: Mengirimkan parameter kategori ke Laravel
  const fetchProducts = (page = 1, search = '', category = 'Semua') => {
    let url = `http://127.0.0.1:8000/api/products?page=${page}&search=${search}`;
    if (category !== 'Semua') {
        url += `&kategori=${category}`;
    }

    fetch(url)
      .then(res => res.json())
      .then(data => { 
        if (data.success) { 
            setProducts(data.data.data); 
            setCurrentPage(data.data.current_page);
            setLastPage(data.data.last_page);
        } 
      })
      .catch(() => showToast("Gagal mengambil data produk dari server", "error"));
  };

  const fetchIngredients = () => {
    fetch('http://127.0.0.1:8000/api/ingredients?all=true')
      .then(res => res.json())
      .then(data => { if (data.success) setAllIngredients(data.data); })
      .catch(() => console.error("Gagal mengambil daftar bahan baku untuk resep"));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); 
  };

  // FUNGSI BARU: Untuk mengubah kategori dan mereset halaman ke 1
  const handleCategoryChange = (category) => {
      setActiveCategory(category);
      setCurrentPage(1);
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({ 
        nama_produk: product.nama_produk, 
        harga: product.harga,
        kategori: product.kategori || 'Coffee',
        gambarFile: null
      });
      const existingRecipe = product.ingredients.map(ing => ({
        id: ing.id,
        nama: ing.nama_bahan,
        qty: ing.pivot.jumlah_dibutuhkan,
        satuan: ing.satuan
      }));
      setSelectedIngredients(existingRecipe);
    } else {
      setEditingProduct(null);
      setFormData({ nama_produk: '', harga: '', kategori: 'Coffee', gambarFile: null });
      setSelectedIngredients([]);
    }
    setIsModalOpen(true);
  };

  const addIngredientToRecipe = () => {
    if (!tempIngredient.id || !tempIngredient.qty) return;
    const ing = allIngredients.find(i => i.id === parseInt(tempIngredient.id));
    if(ing) {
        setSelectedIngredients([...selectedIngredients, { ...tempIngredient, nama: ing.nama_bahan, satuan: ing.satuan }]);
        setTempIngredient({ id: '', qty: '' });
    }
  };

  const removeIngredientFromRecipe = (index) => {
    const newList = [...selectedIngredients];
    newList.splice(index, 1);
    setSelectedIngredients(newList);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      payload.append('nama_produk', formData.nama_produk);
      payload.append('harga', formData.harga);
      payload.append('kategori', formData.kategori);
      
      if (formData.gambarFile) {
          payload.append('gambar', formData.gambarFile);
      }

      if (selectedIngredients.length > 0) {
          const formattedIngredients = selectedIngredients.map(ing => ({ id: ing.id, qty: ing.qty }));
          payload.append('ingredients', JSON.stringify(formattedIngredients));
      }

      if (editingProduct) {
          payload.append('_method', 'PUT');
      }

      const productUrl = editingProduct ? `http://127.0.0.1:8000/api/products/${editingProduct.id}` : 'http://127.0.0.1:8000/api/products';
      
      const response = await fetch(productUrl, {
        method: 'POST',
        body: payload
      });

      const data = await response.json();

      if (data.success) {
        showToast(editingProduct ? "Perubahan menu berhasil disimpan!" : "Menu baru berhasil ditambahkan!", "success");
        setIsModalOpen(false);
        fetchProducts(currentPage, searchQuery, activeCategory); 
      } else {
        showToast("Gagal menyimpan menu produk!", "error");
      }
    } catch (error) {
      console.error("Error:", error);
      showToast("Terjadi kesalahan sistem.", "error");
    }
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setIsConfirmDeleteOpen(true);
  };

  const executeDelete = async () => {
    if (!productToDelete) return;
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/products/${productToDelete.id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        showToast("Produk berhasil dihapus dari katalog!", "success");
        if (products.length === 1 && currentPage > 1) { setCurrentPage(currentPage - 1); } 
        else { fetchProducts(currentPage, searchQuery, activeCategory); }
      } else { showToast("Gagal menghapus produk: " + data.message, "error"); }
    } catch (error) {
      showToast("Terjadi kesalahan saat menghapus produk.", "error");
    }
    setIsConfirmDeleteOpen(false);
    setProductToDelete(null);
  };

  return (
    <div className="relative min-h-screen font-sans pb-10 overflow-hidden">
      
      {/* TOAST NOTIFICATION */}
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

      <div className={`space-y-6 p-2 transition-all duration-700 ease-out transform ${isContentMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-200 pb-5">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Katalog Produk</h1>
            <p className="text-gray-500 mt-1.5 text-sm">Manajemen Menu & Konfigurasi Resep Otomatis</p>
          </div>
          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input type="text" placeholder="Cari nama menu..." value={searchQuery} onChange={handleSearchChange} className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#005432]/20 focus:border-[#005432] outline-none transition-all shadow-sm" />
            </div>
            <button onClick={() => openModal()} className="flex items-center justify-center gap-2 bg-[#005432] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-green-900 transition-all shadow-sm shadow-green-900/20 shrink-0">
              <Plus size={18} strokeWidth={2.5} /> Tambah Produk
            </button>
          </div>
        </div>

        {/* ========================================== */}
        {/* TAB FILTER KATEGORI (BARU) */}
        {/* ========================================== */}
        <div className="flex gap-3 mb-2">
            {['Semua', 'Coffee', 'Non-Coffee'].map((cat) => (
                <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-sm ${
                        activeCategory === cat 
                        ? 'bg-[#005432] text-white' 
                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                    }`}
                >
                    {cat === 'Semua' ? 'Semua Menu' : cat}
                </button>
            ))}
        </div>

        {/* GRID KARTU PRODUK */}
        {products.length === 0 ? (
           <div className="bg-white p-16 rounded-3xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400"><Search size={32} /></div>
              <h3 className="text-lg font-bold text-gray-900">Menu Tidak Ditemukan</h3>
              <p className="text-gray-500 text-sm mt-1">Belum ada menu di kategori ini atau pencarian tidak cocok.</p>
           </div>
        ) : (
          <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                    
                    {/* BAGIAN GAMBAR / SMART PLACEHOLDER */}
                    <div className="h-44 w-full bg-gray-50 relative overflow-hidden border-b border-gray-100">
                        {product.gambar ? (
                            <img src={`http://127.0.0.1:8000/storage/${product.gambar}`} alt={product.nama_produk} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400">
                                {product.kategori === 'Non-Coffee' ? <Droplet size={40} className="mb-2 opacity-40" /> : <Coffee size={40} className="mb-2 opacity-40" />}
                                <span className="font-black text-3xl opacity-30 uppercase tracking-widest">{product.nama_produk.substring(0, 2)}</span>
                            </div>
                        )}
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md border border-white/20 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">Tersedia</span>
                        </div>
                    </div>

                    {/* Sektor Judul & Kategori */}
                    <div className="bg-[#005432] p-4 flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-white leading-tight">{product.nama_produk}</h3>
                        <p className="text-[10px] font-medium text-green-100/80 mt-1 uppercase tracking-widest flex items-center gap-1.5">
                          {product.kategori === 'Non-Coffee' ? <Droplet size={12} /> : <Coffee size={12} />} 
                          {product.kategori || 'Coffee'}
                        </p>
                      </div>
                    </div>

                    {/* Sektor Tengah (Resep) */}
                    <div className="p-5 flex-1 bg-white">
                      <div className="flex items-center gap-2 mb-4">
                        <ShoppingBag size={16} className="text-gray-400" />
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Komposisi Resep</span>
                      </div>
                      
                      {product.ingredients?.length > 0 ? (
                        <div className="space-y-2.5">
                          {product.ingredients.map((r, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm border-b border-gray-100 pb-2.5 last:border-0 last:pb-0">
                              <span className="font-medium text-gray-700 capitalize">{r.nama_bahan}</span>
                              <span className="font-bold text-[#005432] bg-green-50 px-2 py-1 rounded text-xs border border-green-100">
                                {r.pivot.jumlah_dibutuhkan} {r.satuan}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 bg-red-50 text-red-600 p-3 rounded-xl border border-red-100">
                          <AlertCircle size={16} />
                          <span className="text-xs font-semibold">Belum ada konfigurasi resep</span>
                        </div>
                      )}
                    </div>

                    {/* Sektor Bawah (Harga & Tombol Aksi) */}
                    <div className="p-5 border-t border-gray-100 flex justify-between items-end bg-gray-50/50">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Harga Jual</p>
                        <p className="font-black text-xl text-gray-900">Rp {product.harga.toLocaleString('id-ID')}</p>
                      </div>
                      
                      <div className="flex gap-2">
                        <button onClick={() => openModal(product)} className="flex items-center justify-center gap-1.5 text-xs font-bold text-gray-600 bg-white border border-gray-200 px-3.5 py-2 rounded-xl hover:bg-[#005432] hover:text-white hover:border-[#005432] transition-colors shadow-sm"><Edit2 size={14} strokeWidth={2.5} /> Edit</button>
                        <button onClick={() => handleDeleteClick(product)} className="flex items-center justify-center w-9 h-9 bg-white border border-gray-200 text-red-400 rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-colors shadow-sm shrink-0" title="Hapus Produk"><Trash2 size={14} strokeWidth={2.5} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* KOMPONEN PAGINATION */}
              <div className="flex items-center justify-center gap-4 mt-10 mb-4">
                <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className={`flex items-center gap-1 px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-100' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'}`}><ChevronLeft size={16} /> Sebelumnya</button>
                <div className="bg-white border border-gray-200 px-5 py-2.5 rounded-xl shadow-sm"><span className="text-sm font-semibold text-gray-600">Halaman <span className="text-[#005432] font-black">{currentPage}</span> dari {lastPage || 1}</span></div>
                <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, lastPage))} disabled={currentPage === lastPage || lastPage === 0} className={`flex items-center gap-1 px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${currentPage === lastPage || lastPage === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-100' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'}`}>Selanjutnya <ChevronRight size={16} /></button>
              </div>
          </div>
        )}
      </div>

      {/* MODAL FORM TAMBAH/EDIT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 border border-gray-100">
            
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/80">
              <div>
                  <h2 className="text-lg font-bold text-gray-900">{editingProduct ? 'Update Konfigurasi Menu' : 'Registrasi Menu Baru'}</h2>
                  <p className="text-gray-500 text-xs mt-0.5 font-medium">Atur nama, harga, foto (opsional), dan relasi bahan baku.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700 bg-white border border-gray-200 p-2 rounded-xl shadow-sm transition-colors"><X size={16} strokeWidth={2.5}/></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[75vh]">
                
                {/* GRID UNTUK FOTO & INPUTAN */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    
                    {/* BAGIAN UPLOAD FOTO (OPSIONAL) */}
                    <div className="md:col-span-1">
                        <label className="text-xs font-bold text-gray-700 mb-2 block uppercase tracking-wider">Foto Produk <span className="text-gray-400 font-normal capitalize">(Opsional)</span></label>
                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center text-center bg-gray-50 hover:bg-gray-100 transition-colors relative h-36">
                            <input 
                                type="file" 
                                accept="image/*"
                                onChange={(e) => setFormData({...formData, gambarFile: e.target.files[0]})}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            {formData.gambarFile ? (
                                <div className="text-[#005432] flex flex-col items-center">
                                    <CheckCircle2 size={24} className="mb-2" />
                                    <span className="text-xs font-bold truncate w-28">{formData.gambarFile.name}</span>
                                </div>
                            ) : (
                                <div className="text-gray-400 flex flex-col items-center">
                                    <ImagePlus size={28} className="mb-2" />
                                    <span className="text-xs font-medium">Klik/Drop Foto</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* INPUTAN TEKS */}
                    <div className="md:col-span-2 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs font-bold text-gray-700 mb-2 block uppercase tracking-wider">Kategori</label>
                              <select required value={formData.kategori} onChange={(e) => setFormData({...formData, kategori: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#005432]/20 focus:border-[#005432] outline-none transition-all">
                                <option value="Coffee">Coffee</option>
                                <option value="Non-Coffee">Non-Coffee</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-xs font-bold text-gray-700 mb-2 block uppercase tracking-wider">Harga Jual</label>
                              <input required value={formData.harga} onChange={(e) => setFormData({...formData, harga: e.target.value})} type="number" placeholder="Contoh: 15000" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#005432]/20 focus:border-[#005432] outline-none transition-all" />
                            </div>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-700 mb-2 block uppercase tracking-wider">Nama Menu</label>
                          <input required value={formData.nama_produk} onChange={(e) => setFormData({...formData, nama_produk: e.target.value})} type="text" placeholder="Masukkan nama..." className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#005432]/20 focus:border-[#005432] outline-none transition-all" />
                        </div>
                    </div>
                </div>

                {/* FORMULASI RESEP */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm mb-6">
                    <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <ShoppingBag size={16} className="text-[#005432]" />
                      Formulasi Resep (Bahan Baku)
                    </h3>
                    
                    <div className="flex gap-3 mb-5">
                        <select className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm font-medium text-gray-800 focus:bg-white focus:ring-2 focus:ring-[#005432]/20 focus:border-[#005432] outline-none transition-all" value={tempIngredient.id} onChange={(e) => setTempIngredient({...tempIngredient, id: e.target.value})}>
                            <option value="">Pilih Bahan Baku...</option>
                            {allIngredients?.map(ing => <option key={ing.id} value={ing.id}>{ing.nama_bahan} ({ing.satuan})</option>)}
                        </select>
                        <input type="number" placeholder="Qty" className="w-24 bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm font-medium text-gray-800 focus:bg-white focus:ring-2 focus:ring-[#005432]/20 focus:border-[#005432] outline-none transition-all" value={tempIngredient.qty} onChange={(e) => setTempIngredient({...tempIngredient, qty: e.target.value})} />
                        <button type="button" onClick={addIngredientToRecipe} className="bg-gray-800 text-white px-4 rounded-xl hover:bg-gray-900 transition-all text-sm font-bold flex items-center gap-1.5 shadow-sm">
                          <Plus size={16} strokeWidth={3} /> Add
                        </button>
                    </div>

                    <div className="space-y-2">
                        {selectedIngredients.length === 0 && (
                          <div className="text-center bg-gray-50 border border-dashed border-gray-200 py-6 rounded-xl">
                            <p className="text-xs text-gray-400 font-medium">Belum ada bahan baku yang ditambahkan.</p>
                          </div>
                        )}
                        {selectedIngredients.map((item, index) => (
                            <div key={index} className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:border-gray-200 transition-colors">
                                <span className="text-sm font-bold text-gray-800">{item.nama}</span>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-black px-2.5 py-1 bg-gray-100 rounded-lg text-gray-700">{item.qty} {item.satuan}</span>
                                    <button type="button" onClick={() => removeIngredientFromRecipe(index)} className="text-red-400 hover:text-red-600 bg-red-50 p-1.5 rounded-lg transition-colors"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <button type="submit" className="w-full bg-[#005432] text-white py-3.5 rounded-xl font-bold hover:bg-green-900 transition-colors flex justify-center items-center gap-2 shadow-sm">
                    <Save size={18} strokeWidth={2.5} /> {editingProduct ? 'Simpan Pembaruan Data' : 'Simpan Menu Baru'}
                  </button>
                </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI HAPUS PRODUK */}
      {isConfirmDeleteOpen && productToDelete && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsConfirmDeleteOpen(false)}></div>
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 border border-gray-100 p-6 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
              <Trash2 size={28} strokeWidth={2.5} />
            </div>
            <h2 className="text-xl font-black text-gray-900 mb-2">Hapus Menu Ini?</h2>
            <p className="text-sm text-gray-500 mb-6 font-medium leading-relaxed">
              Anda yakin ingin menghapus <span className="font-bold text-gray-800">{productToDelete.nama_produk}</span> dari katalog?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setIsConfirmDeleteOpen(false)} className="flex-1 bg-gray-50 border border-gray-200 text-gray-600 py-3 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors">Batal</button>
              <button onClick={executeDelete} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold text-sm hover:bg-red-600 transition-colors shadow-sm">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KelolaProduk;