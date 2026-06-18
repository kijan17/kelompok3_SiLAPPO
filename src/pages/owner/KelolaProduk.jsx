import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Coffee, Info, X, Save, Trash2, PlusCircle, ShoppingBag } from 'lucide-react';

const KelolaProduk = () => {
  const [products, setProducts] = useState([]);
  const [allIngredients, setAllIngredients] = useState([]); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const [formData, setFormData] = useState({ nama_produk: '', harga: '' });
  const [selectedIngredients, setSelectedIngredients] = useState([]); 
  const [tempIngredient, setTempIngredient] = useState({ id: '', qty: '' });

  const [isContentMounted, setIsContentMounted] = useState(false);

  useEffect(() => { 
    setTimeout(() => { setIsContentMounted(true); }, 100);
    fetchProducts(); 
    fetchIngredients(); 
  }, []);

  const fetchProducts = () => {
    fetch('http://127.0.0.1:8000/api/products').then(res => res.json()).then(data => { if (data.success) setProducts(data.data); });
  };

  const fetchIngredients = () => {
    fetch('http://127.0.0.1:8000/api/ingredients').then(res => res.json()).then(data => { if (data.success) setAllIngredients(data.data); });
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
          alert("Mantap! Menu & Resep berhasil disimpan.");
          setIsModalOpen(false);
          fetchProducts(); 
        } else {
          alert("Menu tersimpan, tapi resep gagal: " + recipeData.message);
        }
      } else {
        alert("Gagal menyimpan menu produk!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan sistem, cek console (F12).");
    }
  };

  return (
    <div className="relative min-h-screen font-sans pb-10">
      <div className={`space-y-8 p-2 transition-all duration-700 ease-out transform ${isContentMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        
        {/* HEADER */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Katalog Produk</h1>
            <p className="text-gray-500 mt-1 text-sm">Manajemen Menu & Resep Otomatis</p>
          </div>
          <button onClick={() => openModal()} className="flex items-center gap-2 bg-[#005432] text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-green-900 transition-all shadow-sm shadow-green-900/20">
            <Plus size={18} /> Tambah Produk
          </button>
        </div>

        {/* GRID KARTU PRODUK (Tanpa Ruang Gambar) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col relative group hover:border-[#005432]/30 hover:shadow-md transition-all duration-300">
              
              <div className="flex justify-between items-start mb-4">
                <div className="pr-4">
                  <h3 className="text-xl font-bold text-gray-900 leading-tight">{product.nama_produk}</h3>
                  <p className="text-xs font-medium text-gray-400 mt-1 uppercase tracking-wider">Lappo Signature Series</p>
                </div>
                <div className="bg-green-50 border border-green-100 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#005432] animate-pulse"></div>
                  <span className="text-[10px] font-bold text-[#005432] uppercase tracking-widest">Tersedia</span>
                </div>
              </div>

              <div className="mb-6 bg-gray-50/80 p-4 rounded-2xl border border-gray-100 transition-colors flex-1">
                <div className="flex items-center gap-1.5 mb-2">
                  <ShoppingBag size={14} className="text-[#005432]" />
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Komposisi Resep</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                  {product.ingredients?.length > 0 
                    ? product.ingredients.map(r => `${r.pivot.jumlah_dibutuhkan}${r.satuan} ${r.nama_bahan}`).join(' • ') 
                    : <span className="italic text-red-400 text-xs">Belum ada konfigurasi resep.</span>}
                </p>
              </div>

              <div className="flex justify-between items-end mt-auto pt-4 border-t border-gray-100">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Harga Jual</p>
                  <p className="font-black text-2xl text-[#005432]">Rp {product.harga.toLocaleString('id-ID')}</p>
                </div>
                <button onClick={() => openModal(product)} className="w-11 h-11 bg-white text-gray-500 rounded-xl border-2 border-gray-100 flex items-center justify-center hover:bg-[#005432] hover:text-white hover:border-[#005432] transition-colors shadow-sm">
                  <Edit2 size={16} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL (Tetap sama) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 border border-gray-100">
            
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                  <h2 className="text-lg font-bold text-gray-900">{editingProduct ? 'Update Menu & Resep' : 'Registrasi Menu Baru'}</h2>
                  <p className="text-gray-500 text-xs mt-1">Lengkapi informasi produk dan takaran resep bahan baku.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 bg-white border border-gray-200 p-2 rounded-full shadow-sm transition-colors"><X size={16}/></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Nama Produk</label>
                      <input required value={formData.nama_produk} onChange={(e) => setFormData({...formData, nama_produk: e.target.value})} type="text" placeholder="Masukkan nama..." className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-gray-800 focus:ring-2 focus:ring-[#005432]/20 focus:border-[#005432] outline-none transition-all" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Harga Jual (Rp)</label>
                      <input required value={formData.harga} onChange={(e) => setFormData({...formData, harga: e.target.value})} type="number" placeholder="Contoh: 15000" className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-gray-800 focus:ring-2 focus:ring-[#005432]/20 focus:border-[#005432] outline-none transition-all" />
                    </div>
                </div>

                <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-200">
                    <h3 className="text-sm font-bold text-gray-800 mb-4">Konfigurasi Takaran Resep</h3>
                    
                    <div className="flex gap-3 mb-5">
                        <select className="flex-1 bg-white border border-gray-200 rounded-xl p-2.5 text-sm text-gray-700 focus:ring-2 focus:ring-[#005432]/20 focus:border-[#005432] outline-none transition-all" value={tempIngredient.id} onChange={(e) => setTempIngredient({...tempIngredient, id: e.target.value})}>
                            <option value="">Pilih Bahan Baku...</option>
                            {allIngredients.map(ing => <option key={ing.id} value={ing.id}>{ing.nama_bahan} ({ing.satuan})</option>)}
                        </select>
                        <input type="number" placeholder="Qty" className="w-24 bg-white border border-gray-200 rounded-xl p-2.5 text-sm text-gray-700 focus:ring-2 focus:ring-[#005432]/20 focus:border-[#005432] outline-none transition-all" value={tempIngredient.qty} onChange={(e) => setTempIngredient({...tempIngredient, qty: e.target.value})} />
                        <button type="button" onClick={addIngredientToRecipe} className="bg-gray-800 text-white px-4 rounded-xl hover:bg-[#005432] transition-all text-sm font-semibold flex items-center gap-2">
                          <Plus size={16} /> Tambah
                        </button>
                    </div>

                    <div className="space-y-2.5">
                        {selectedIngredients.length === 0 && (
                          <p className="text-xs text-center text-gray-400 py-3 italic">Belum ada bahan resep yang ditambahkan.</p>
                        )}
                        {selectedIngredients.map((item, index) => (
                            <div key={index} className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                                <span className="text-sm font-semibold text-gray-800">{item.nama}</span>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs font-bold px-2 py-1 bg-gray-100 rounded-md text-gray-600">{item.qty} {item.satuan}</span>
                                    <button type="button" onClick={() => removeIngredientFromRecipe(index)} className="text-red-400 hover:text-red-600 bg-red-50 p-1.5 rounded-lg transition-colors"><Trash2 size={14} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-2">
                  <button type="submit" className="w-full bg-[#005432] text-white py-3.5 rounded-xl font-bold hover:bg-green-900 transition-colors flex justify-center items-center gap-2">
                    <Save size={18} /> {editingProduct ? 'Simpan Perubahan' : 'Buat Menu Sekarang'}
                  </button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default KelolaProduk;