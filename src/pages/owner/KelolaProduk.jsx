import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Coffee, Info, X, Save, Trash2, PlusCircle } from 'lucide-react';

const KelolaProduk = () => {
  const [products, setProducts] = useState([]);
  const [allIngredients, setAllIngredients] = useState([]); // Master data bahan dari DB
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const [formData, setFormData] = useState({ nama_produk: '', harga: '' });
  const [selectedIngredients, setSelectedIngredients] = useState([]); // Resep yang sedang disusun
  const [tempIngredient, setTempIngredient] = useState({ id: '', qty: '' });

  useEffect(() => { fetchProducts(); fetchIngredients(); }, []);

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
      // Ambil resep yang sudah ada dari database
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

  // Tambah bahan ke daftar resep sementara
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = editingProduct ? `http://127.0.0.1:8000/api/products/${editingProduct.id}` : 'http://127.0.0.1:8000/api/products';
    fetch(url, {
      method: editingProduct ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, ingredients: selectedIngredients })
    }).then(res => res.json()).then(data => { if (data.success) { setIsModalOpen(false); fetchProducts(); } });
  };

  return (
    <div className="relative min-h-screen space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div><h1 className="text-3xl font-bold text-gray-800">Kelola Produk</h1><p className="text-gray-500 mt-1">Manajemen Menu & Resep Otomatis</p></div>
        <button onClick={() => openModal()} className="flex items-center gap-2 bg-[#005432] text-white px-5 py-3 rounded-xl font-bold hover:scale-105 transition-all shadow-lg"><Plus size={20} /> Tambah Produk</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col relative group hover:shadow-xl transition-all duration-300">
            <div className="flex gap-4 mb-3">
              <div className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center text-gray-300 flex-shrink-0 group-hover:bg-green-50 transition-colors"><Coffee size={35} strokeWidth={1.5} /></div>
              <div className="flex-1"><h3 className="font-bold text-gray-800 leading-tight">{product.nama_produk}</h3><p className="text-[11px] text-gray-400 mt-1">Lappo Signature Series</p></div>
            </div>
            <div className="mb-4 bg-green-50/50 p-2.5 rounded-lg border border-green-100/50">
              <div className="flex items-center gap-1.5 mb-1.5"><Info size={12} className="text-[#005432]" /><span className="text-[10px] font-bold text-[#005432] uppercase tracking-wider">Resep Aktif</span></div>
              <p className="text-[11px] text-gray-600 italic leading-relaxed">{product.ingredients?.map(r => `${r.pivot.jumlah_dibutuhkan}${r.satuan} ${r.nama_bahan}`).join(', ') || 'Belum ada resep'}</p>
            </div>
            <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-50">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#005432]"></div><span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Tersedia</span></div>
              <div className="flex items-center gap-3"><p className="font-black text-xl text-gray-900 whitespace-nowrap">Rp {product.harga.toLocaleString('id-ID')}</p><button onClick={() => openModal(product)} className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-[#005432] transition-all"><Edit2 size={16} /></button></div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-2xl bg-white/95 backdrop-blur-2xl border border-white/50 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-[#005432] p-6 text-white flex justify-between items-center">
                <div><h2 className="text-xl font-black">{editingProduct ? 'Update Menu & Resep' : 'Buat Menu & Resep'}</h2><p className="text-green-200 text-xs">Lappo Intelligence System</p></div>
                <button onClick={() => setIsModalOpen(false)} className="bg-white/20 p-2 rounded-full hover:bg-white/40 transition-colors"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[80vh]">
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100"><label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Nama Produk</label><input required value={formData.nama_produk} onChange={(e) => setFormData({...formData, nama_produk: e.target.value})} type="text" className="w-full bg-transparent border-none p-0 focus:ring-0 font-bold text-gray-800" /></div>
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100"><label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Harga (Rp)</label><input required value={formData.harga} onChange={(e) => setFormData({...formData, harga: e.target.value})} type="number" className="w-full bg-transparent border-none p-0 focus:ring-0 font-bold text-gray-800" /></div>
                </div>

                <div className="bg-white p-5 rounded-3xl border-2 border-dashed border-gray-100">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Konfigurasi Resep</h3>
                    <div className="flex gap-3 mb-4">
                        <select className="flex-1 bg-gray-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-[#005432]" value={tempIngredient.id} onChange={(e) => setTempIngredient({...tempIngredient, id: e.target.value})}>
                            <option value="">Pilih Bahan...</option>
                            {allIngredients.map(ing => <option key={ing.id} value={ing.id}>{ing.nama_bahan} ({ing.satuan})</option>)}
                        </select>
                        <input type="number" placeholder="Qty" className="w-20 bg-gray-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-[#005432]" value={tempIngredient.qty} onChange={(e) => setTempIngredient({...tempIngredient, qty: e.target.value})} />
                        <button type="button" onClick={addIngredientToRecipe} className="bg-[#005432] text-white p-3 rounded-xl hover:bg-black transition-all"><PlusCircle size={24} /></button>
                    </div>

                    <div className="space-y-2">
                        {selectedIngredients.map((item, index) => (
                            <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <span className="text-sm font-bold text-gray-700">{item.nama}</span>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-black text-[#005432]">{item.qty} {item.satuan}</span>
                                    <button type="button" onClick={() => removeIngredientFromRecipe(index)} className="text-red-400 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <button type="submit" className="w-full bg-[#005432] text-white py-4 rounded-2xl font-black text-lg shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3"><Save size={20} />{editingProduct ? 'Perbarui Menu & Resep' : 'Simpan Menu Baru'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default KelolaProduk;