import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Coffee, Milk, Droplet, Package, Box, X, Save, ShoppingCart, TrendingDown, TrendingUp, Layers } from 'lucide-react';

const StokBahan = () => {
  const [ingredients, setIngredients] = useState([]);
  const [restockHistory, setRestockHistory] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState(null);
  const [selectedForRestock, setSelectedForRestock] = useState(null);

  const [formData, setFormData] = useState({ nama_bahan: '', stok: '', satuan: 'gram' });
  const [restockFormData, setRestockFormData] = useState({ jumlah_tambah: '', total_harga: '' });

  // STATE ANIMASI
  const [isContentMounted, setIsContentMounted] = useState(false);

  useEffect(() => {
    // JALANKAN ANIMASI SETELAH JEDA 100ms
    setTimeout(() => { setIsContentMounted(true); }, 100);

    fetchIngredients();
    fetchRestockHistory();
  }, []);

  const fetchIngredients = () => {
    fetch('http://127.0.0.1:8000/api/ingredients').then(res => res.json()).then(data => { if (data.success) setIngredients(data.data); });
  };

  const fetchRestockHistory = () => {
    fetch('http://127.0.0.1:8000/api/restocks').then(res => res.json()).then(data => { if (data.success) setRestockHistory(data.data); });
  };

  const openModal = (ingredient = null) => {
    if (ingredient) {
      setEditingIngredient(ingredient);
      setFormData({ nama_bahan: ingredient.nama_bahan, stok: ingredient.stok, satuan: ingredient.satuan });
    } else {
      setEditingIngredient(null);
      setFormData({ nama_bahan: '', stok: '', satuan: 'gram' });
    }
    setIsModalOpen(true);
  };

  const openRestockModal = (ingredient) => {
    setSelectedForRestock(ingredient);
    setRestockFormData({ jumlah_tambah: '', total_harga: '' });
    setIsRestockModalOpen(true);
  };

  const handleSubmitIngredient = (e) => {
    e.preventDefault();
    const method = editingIngredient ? 'PUT' : 'POST';
    const url = editingIngredient ? `http://127.0.0.1:8000/api/ingredients/${editingIngredient.id}` : 'http://127.0.0.1:8000/api/ingredients';
    fetch(url, { method, headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(formData) })
      .then(res => res.json()).then(data => { if (data.success) { setIsModalOpen(false); fetchIngredients(); } });
  };

  const handleSubmitRestock = (e) => {
    e.preventDefault();
    fetch('http://127.0.0.1:8000/api/restocks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ ingredient_id: selectedForRestock.id, jumlah_tambah: parseInt(restockFormData.jumlah_tambah), total_harga: parseInt(restockFormData.total_harga) })
    }).then(res => res.json()).then(data => {
      if (data.success) { setIsRestockModalOpen(false); fetchIngredients(); fetchRestockHistory(); } 
      else { alert("Gagal menyimpan: " + JSON.stringify(data.message)); }
    });
  };

  const handleDelete = (id, nama) => {
    if(window.confirm(`Hapus ${nama}?`)) {
      fetch(`http://127.0.0.1:8000/api/ingredients/${id}`, { method: 'DELETE' }).then(res => res.json()).then(data => { if(data.success) fetchIngredients(); });
    }
  };

  const getStyling = (nama_bahan) => {
    const name = nama_bahan.toLowerCase();
    if (name.includes('kopi')) return { icon: <Coffee size={28} className="text-white" />, gradient: 'from-[#005432] to-green-700', badgeColor: 'bg-green-100 text-green-700', category: 'Biji Kopi Premium' };
    if (name.includes('susu')) return { icon: <Milk size={28} className="text-white" />, gradient: 'from-yellow-400 to-orange-400', badgeColor: 'bg-orange-100 text-orange-700', category: 'Dairy & Milk' };
    if (name.includes('gula')) return { icon: <Droplet size={28} className="text-white" />, gradient: 'from-pink-500 to-red-500', badgeColor: 'bg-red-100 text-red-700', category: 'Sweetener' };
    return { icon: <Package size={28} className="text-white" />, gradient: 'from-blue-500 to-indigo-600', badgeColor: 'bg-blue-100 text-blue-700', category: 'Lainnya' };
  };

  const totalExpenses = restockHistory.reduce((sum, item) => sum + parseInt(item.total_harga || 0), 0);

  return (
    <div 
      className={`font-sans p-2 relative min-h-screen transition-all duration-1000 ease-out transform ${
        isContentMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
    >
      {/* HEADER */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Stok Bahan Baku</h1>
          <p className="text-gray-500 mt-1">Kelola Persediaan & Pengeluaran Restock</p>
        </div>
        <button onClick={() => openModal()} className="flex items-center gap-2 bg-[#005432] text-white px-5 py-3 rounded-2xl font-bold hover:scale-105 transition-all shadow-lg hover:shadow-green-900/30">
          <Plus size={20} /> Tambah Jenis Bahan
        </button>
      </div>

      {/* SUMMARY DASHBOARD KECIL */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center gap-5 shadow-sm">
          <div className="p-4 bg-gray-50 text-gray-500 rounded-2xl"><Layers size={28} strokeWidth={1.5} /></div>
          <div><p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Total Bahan</p><h3 className="text-3xl font-black text-gray-900 mt-1">{ingredients.length} Jenis</h3></div>
        </div>
        <div className="bg-[#005432] p-6 rounded-3xl text-white flex items-center gap-5 shadow-xl shadow-[#005432]/20 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-10"><TrendingDown size={120} /></div>
          <div className="p-4 bg-white/10 text-green-200 rounded-2xl relative z-10"><TrendingDown size={28} strokeWidth={1.5} /></div>
          <div className="relative z-10"><p className="text-[11px] font-bold text-green-200 uppercase tracking-widest">Pengeluaran Restock</p><h3 className="text-3xl font-black mt-1">Rp {totalExpenses.toLocaleString('id-ID')}</h3></div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center gap-5 shadow-sm">
          <div className="p-4 bg-green-50 text-[#005432] rounded-2xl"><TrendingUp size={28} strokeWidth={1.5} /></div>
          <div><p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Stok Aman</p><h3 className="text-3xl font-black text-gray-900 mt-1">{ingredients.filter(i => i.stok > 1000).length} Bahan</h3></div>
        </div>
      </div>

      {/* GRID KARTU STOK ALA FUTURISTIK */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-10">
        {ingredients.map((item) => {
          const style = getStyling(item.nama_bahan);
          const stockLevel = Math.min(Math.round((item.stok / 10000) * 100), 100); 
          const status = item.stok > 1000 ? 'Stok Aman' : 'Stok Menipis';

          return (
            <div key={item.id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex flex-col hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative group overflow-hidden">
              
              {/* IKON & KATEGORI */}
              <div className="flex items-center gap-4 mb-8">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-md bg-gradient-to-br ${style.gradient}`}>
                  {style.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg leading-tight">{item.nama_bahan}</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{style.category}</p>
                </div>
              </div>

              {/* PROGRESS BAR MENDATAR (Lebih Elegan) */}
              <div className="mb-6">
                <div className="flex justify-between items-end mb-2">
                  <h2 className="text-4xl font-black text-gray-800">{stockLevel}%</h2>
                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${style.badgeColor}`}>
                    {status}
                  </span>
                </div>
                
                {/* Background Track */}
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  {/* Fill Track */}
                  <div 
                    className={`h-full bg-gradient-to-r ${style.gradient} rounded-full transition-all duration-1000 ease-out`} 
                    style={{ width: `${stockLevel}%` }}
                  ></div>
                </div>
                
                <p className="text-sm font-bold text-gray-500 mt-3 text-right">
                  {item.stok} <span className="font-normal text-gray-400">{item.satuan}</span>
                </p>
              </div>

              {/* TOMBOL AKSI */}
              <div className="flex gap-2 mt-auto pt-2">
                <button onClick={() => openRestockModal(item)} className="flex-1 bg-gray-900 text-white p-3 rounded-xl hover:bg-[#005432] transition-colors shadow-md flex items-center justify-center gap-2 font-bold text-sm">
                  <ShoppingCart size={16} /> Restock
                </button>
                <button onClick={() => openModal(item)} className="w-12 h-12 bg-gray-100 text-gray-500 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors">
                  <Edit size={16} />
                </button>
                <button onClick={() => handleDelete(item.id, item.nama_bahan)} className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* MODAL (Bentuknya tetap sama, pakai punyamu saja) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white border border-white/50 rounded-[2.5rem] shadow-2xl overflow-hidden">
            <div className="bg-[#005432] p-8 text-white"><h2 className="text-2xl font-black">Konfigurasi Bahan</h2></div>
            <form onSubmit={handleSubmitIngredient} className="p-8 space-y-4">
              <input required value={formData.nama_bahan} onChange={(e) => setFormData({...formData, nama_bahan: e.target.value})} type="text" placeholder="Nama Bahan" className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold" />
              <div className="grid grid-cols-2 gap-4">
                <input required value={formData.stok} onChange={(e) => setFormData({...formData, stok: e.target.value})} type="number" placeholder="Stok" className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold" />
                <select value={formData.satuan} onChange={(e) => setFormData({...formData, satuan: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold"><option value="gram">gram</option><option value="ml">ml</option><option value="pcs">pcs</option></select>
              </div>
              <button type="submit" className="w-full bg-[#005432] text-white py-4 rounded-2xl font-black shadow-lg"><Save size={20} className="inline mr-2" /> Simpan Data</button>
            </form>
          </div>
        </div>
      )}

      {isRestockModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => setIsRestockModalOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white/90 backdrop-blur-2xl border border-white/40 rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="bg-gray-900 p-8 text-white"><h2 className="text-2xl font-black">Restock Log</h2><p className="text-gray-400 text-xs">Mencatat pembelian: {selectedForRestock?.nama_bahan}</p></div>
            <form onSubmit={handleSubmitRestock} className="p-10 space-y-6">
                <input required autoFocus type="number" value={restockFormData.jumlah_tambah} onChange={(e) => setRestockFormData({...restockFormData, jumlah_tambah: e.target.value})} placeholder="Jumlah Beli" className="w-full bg-gray-50 border-none p-5 rounded-2xl font-black text-2xl" />
                <input required type="number" value={restockFormData.total_harga} onChange={(e) => setRestockFormData({...restockFormData, total_harga: e.target.value})} placeholder="Total Harga (Rp)" className="w-full bg-gray-50 border-none p-5 rounded-2xl font-black text-2xl" />
                <button type="submit" className="w-full bg-[#005432] text-white py-5 rounded-[2rem] font-black text-lg shadow-xl hover:-translate-y-1 transition-all">Konfirmasi Belanja</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StokBahan;