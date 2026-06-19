import React, { useState, useEffect } from 'react';
import { Plus, Edit2, X, Save, Trash2, ShoppingBag, Layers, AlertCircle, CheckCircle2, Search } from 'lucide-react';

const KelolaProduk = () => {
  const [products, setProducts] = useState([]);
  const [allIngredients, setAllIngredients] = useState([]); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const [formData, setFormData] = useState({ nama_produk: '', harga: '' });
  const [selectedIngredients, setSelectedIngredients] = useState([]); 
  const [tempIngredient, setTempIngredient] = useState({ id: '', qty: '' });

  const [isContentMounted, setIsContentMounted] = useState(false);

  // STATE UNTUK PENCARIAN
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
    fetchProducts(); 
    fetchIngredients(); 
  }, []);

  const fetchProducts = () => {
    fetch('http://127.0.0.1:8000/api/products')
      .then(res => res.json())
      .then(data => { if (data.success) setProducts(data.data); })
      .catch(() => showToast("Gagal mengambil data produk dari server", "error"));
  };

  const fetchIngredients = () => {
    fetch('http://127.0.0.1:8000/api/ingredients')
      .then(res => res.json())
      .then(data => { if (data.success) setAllIngredients(data.data); });
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({ nama_produk: product.nama_produk, harga: product.harga });
      const existingRecipe = product.ingredients.map(ing => ({
        id: ing.id,
        nama: ing.nama_bahan,
        qty: ing.pivot.jumlah_dibutuhkan,
        satuan: ing.satuan
      }));
      setSelectedIngredients(existingRecipe);
    } else {
      setEditingProduct(null);
      setFormData({ nama_produk: '', harga: '' });
      setSelectedIngredients([]);
    }
    setIsModalOpen(true);
  };

  const addIngredientToRecipe = () => {
    if (!tempIngredient.id || !tempIngredient.qty) return;
    const ing = allIngredients.find(i => i.id === parseInt(tempIngredient.id));
    setSelectedIngredients([...selectedIngredients, { ...tempIngredient, nama: ing.nama_bahan, satuan: ing.satuan }]);
    setTempIngredient({ id: '', qty: '' });
  };

  const removeIngredientFromRecipe = (index) => {
    const newList = [...selectedIngredients];
    newList.splice(index, 1);
    setSelectedIngredients(newList);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productUrl = editingProduct ? `http://127.0.0.1:8000/api/products/${editingProduct.id}` : 'http://127.0.0.1:8000/api/products';
      const productMethod = editingProduct ? 'PUT' : 'POST';

      const productResponse = await fetch(productUrl, {
        method: productMethod,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData) 
      });

      const productData = await productResponse.json();

      if (productData.success) {
        const productId = editingProduct ? editingProduct.id : productData.data.id;
        const formattedIngredients = selectedIngredients.map(ing => ({
          ingredient_id: ing.id,
          jumlah_dibutuhkan: ing.qty
        }));

        const recipeResponse = await fetch(`http://127.0.0.1:8000/api/products/${productId}/recipes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ingredients: formattedIngredients })
        });

        const recipeData = await recipeResponse.json();

        if (recipeData.success) {
          showToast(editingProduct ? "Perubahan menu berhasil disimpan!" : "Menu baru berhasil ditambahkan!", "success");
          setIsModalOpen(false);
          fetchProducts(); 
        } else {
          showToast("Menu tersimpan, tapi resep gagal: " + recipeData.message, "error");
        }
      } else {
        showToast("Gagal menyimpan menu produk!", "error");
      }
    } catch (error) {
      console.error("Error:", error);
      showToast("Terjadi kesalahan sistem, periksa koneksi internetmu.", "error");
    }
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setIsConfirmDeleteOpen(true);
  };

  const executeDelete = async () => {
    if (!productToDelete) return;
    
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/products/${productToDelete.id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      
      if (data.success) {
        showToast("Produk berhasil dihapus dari katalog!", "success");
        fetchProducts(); 
      } else {
        showToast("Gagal menghapus produk: " + data.message, "error");
      }
    } catch (error) {
      console.error("Error deleting:", error);
      showToast("Terjadi kesalahan saat menghapus produk.", "error");
    }
    
    setIsConfirmDeleteOpen(false);
    setProductToDelete(null);
  };

  // LOGIKA PENCARIAN PRODUK
  const filteredProducts = products.filter(product =>
    product.nama_produk.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

      <div className={`space-y-8 p-2 transition-all duration-700 ease-out transform ${isContentMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        
        {/* HEADER DENGAN SEARCH BAR */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-200 pb-5">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Katalog Produk</h1>
            <p className="text-gray-500 mt-1.5 text-sm">Manajemen Menu & Konfigurasi Resep Otomatis</p>
          </div>
          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Cari nama menu..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#005432]/20 focus:border-[#005432] outline-none transition-all shadow-sm"
              />
            </div>
            <button onClick={() => openModal()} className="flex items-center justify-center gap-2 bg-[#005432] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-green-900 transition-all shadow-sm shadow-green-900/20 shrink-0">
              <Plus size={18} strokeWidth={2.5} /> Tambah Produk
            </button>
          </div>
        </div>

        {/* GRID KARTU PRODUK */}
        {filteredProducts.length === 0 ? (
           <div className="bg-white p-16 rounded-3xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
                <Search size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Menu Tidak Ditemukan</h3>
              <p className="text-gray-500 text-sm mt-1">Coba gunakan kata kunci lain atau tambahkan produk baru.</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                
                {/* Sektor Atas */}
                <div className="bg-[#005432] p-5 flex justify-between items-start">
                  <div className="pr-4">
                    <h3 className="text-lg font-bold text-white leading-tight">{product.nama_produk}</h3>
                    <p className="text-[10px] font-medium text-green-100/80 mt-1.5 uppercase tracking-widest flex items-center gap-1.5">
                      <Layers size={12} /> Signature Series
                    </p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-md border border-white/20 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse"></div>
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">Tersedia</span>
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
                  
                  {/* Tombol Edit dan Hapus */}
                  <div className="flex gap-2">
                    <button 
                      onClick={() => openModal(product)} 
                      className="flex items-center justify-center gap-1.5 text-xs font-bold text-gray-600 bg-white border border-gray-200 px-3.5 py-2 rounded-xl hover:bg-[#005432] hover:text-white hover:border-[#005432] transition-colors shadow-sm"
                    >
                      <Edit2 size={14} strokeWidth={2.5} /> Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(product)} 
                      className="flex items-center justify-center w-9 h-9 bg-white border border-gray-200 text-red-400 rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-colors shadow-sm shrink-0"
                      title="Hapus Produk"
                    >
                      <Trash2 size={14} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL FORM TAMBAH/EDIT (SAMA SEPERTI SEBELUMNYA) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 border border-gray-100">
            
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/80">
              <div>
                  <h2 className="text-lg font-bold text-gray-900">{editingProduct ? 'Update Konfigurasi Menu' : 'Registrasi Menu Baru'}</h2>
                  <p className="text-gray-500 text-xs mt-0.5 font-medium">Atur nama, harga, dan relasi bahan baku.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700 bg-white border border-gray-200 p-2 rounded-xl shadow-sm transition-colors"><X size={16} strokeWidth={2.5}/></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
                <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs font-bold text-gray-700 mb-2 block uppercase tracking-wider">Nama Menu</label>
                      <input required value={formData.nama_produk} onChange={(e) => setFormData({...formData, nama_produk: e.target.value})} type="text" placeholder="Masukkan nama..." className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#005432]/20 focus:border-[#005432] outline-none transition-all" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 mb-2 block uppercase tracking-wider">Harga Jual (Rp)</label>
                      <input required value={formData.harga} onChange={(e) => setFormData({...formData, harga: e.target.value})} type="number" placeholder="Contoh: 15000" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#005432]/20 focus:border-[#005432] outline-none transition-all" />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <ShoppingBag size={16} className="text-[#005432]" />
                      Formulasi Resep (Bahan Baku)
                    </h3>
                    
                    <div className="flex gap-3 mb-5">
                        <select className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm font-medium text-gray-800 focus:bg-white focus:ring-2 focus:ring-[#005432]/20 focus:border-[#005432] outline-none transition-all" value={tempIngredient.id} onChange={(e) => setTempIngredient({...tempIngredient, id: e.target.value})}>
                            <option value="">Pilih Bahan Baku...</option>
                            {allIngredients.map(ing => <option key={ing.id} value={ing.id}>{ing.nama_bahan} ({ing.satuan})</option>)}
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

      {/* MODAL KONFIRMASI HAPUS PRODUK (SAMA SEPERTI SEBELUMNYA) */}
      {isConfirmDeleteOpen && productToDelete && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsConfirmDeleteOpen(false)}></div>
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 border border-gray-100 p-6 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
              <Trash2 size={28} strokeWidth={2.5} />
            </div>
            <h2 className="text-xl font-black text-gray-900 mb-2">Hapus Menu Ini?</h2>
            <p className="text-sm text-gray-500 mb-6 font-medium leading-relaxed">
              Anda yakin ingin menghapus <span className="font-bold text-gray-800">{productToDelete.nama_produk}</span> dari katalog? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setIsConfirmDeleteOpen(false)} className="flex-1 bg-gray-50 border border-gray-200 text-gray-600 py-3 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors">
                Batal
              </button>
              <button onClick={executeDelete} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold text-sm hover:bg-red-600 transition-colors shadow-sm">
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KelolaProduk;