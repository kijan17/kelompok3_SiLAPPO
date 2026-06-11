import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Coffee, Milk, Droplet, Package, Box, X, Save, ShoppingCart, TrendingDown, TrendingUp, Layers } from 'lucide-react';

const StokBahan = () => {
  const [ingredients, setIngredients] = useState([]);
  const [restockHistory, setRestockHistory] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState(null);
  const [selectedForRestock, setSelectedForRestock] = useState(null);

  const [formData, setFormData] = useState({ nama_bahan: '', stok: '', satuan: 'gram' });
  const [restockFormData, setRestockFormData] = useState({ jumlah_tambah: '', total_harga: '' });

  useEffect(() => {
    fetchIngredients();
    fetchRestockHistory();
  }, []);

  const fetchIngredients = () => {
    fetch('http://127.0.0.1:8000/api/ingredients')
      .then(res => res.json())
      .then(data => { if (data.success) setIngredients(data.data); });
  };

  const fetchRestockHistory = () => {
    fetch('http://127.0.0.1:8000/api/restocks')
      .then(res => res.json())
      .then(data => { if (data.success) setRestockHistory(data.data); });
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
    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(formData)
    }).then(res => res.json()).then(data => { if (data.success) { setIsModalOpen(false); fetchIngredients(); } });
  };

  const handleSubmitRestock = (e) => {
    e.preventDefault();
    fetch('http://127.0.0.1:8000/api/restocks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        ingredient_id: selectedForRestock.id,
        jumlah_tambah: parseInt(restockFormData.jumlah_tambah),
        total_harga: parseInt(restockFormData.total_harga)
      })
    }).then(res => res.json()).then(data => {
      if (data.success) {
        setIsRestockModalOpen(false);
        fetchIngredients();
        fetchRestockHistory();
      } else {
        alert("Gagal menyimpan: " + JSON.stringify(data.message));
      }
    });
  };

  const handleDelete = (id, nama) => {
    if(window.confirm(`Hapus ${nama}?`)) {
      fetch(`http://127.0.0.1:8000/api/ingredients/${id}`, { method: 'DELETE' }).then(res => res.json()).then(data => { if(data.success) fetchIngredients(); });
    }
  };

  const getStyling = (nama_bahan) => {
    const name = nama_bahan.toLowerCase();
    if (name.includes('kopi')) return { icon: <Coffee size={24} className="text-[#005432]" />, color: 'bg-green-300', textColor: 'text-green-700', badgeColor: 'bg-green-100', category: 'Kopi' };
    if (name.includes('susu')) return { icon: <Milk size={24} className="text-yellow-600" />, color: 'bg-yellow-300', textColor: 'text-yellow-700', badgeColor: 'bg-yellow-100', category: 'Susu' };
    if (name.includes('gula')) return { icon: <Droplet size={24} className="text-red-600" />, color: 'bg-red-300', textColor: 'text-red-700', badgeColor: 'bg-red-100', category: 'Gula' };
    return { icon: <Package size={24} className="text-[#005432]" />, color: 'bg-green-300', textColor: 'text-green-700', badgeColor: 'bg-green-100', category: 'Kemasan' };
  };

  // Kalkulasi total pengeluaran dari history
  const totalExpenses = restockHistory.reduce((sum, item) => sum + parseInt(item.total_harga || 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-sans relative min-h-screen">
      <div className="flex justify-between items-start">
        <div><h1 className="text-3xl font-bold text-gray-900">Selamat Datang, <span className="text-[#005432]">Owner</span></h1><p className="text-gray-500 mt-1">Kelola Persediaan & Pengeluaran Bahan Baku</p></div>
        <button onClick={() => openModal()} className="flex items-center gap-2 bg-[#005432] text-white px-4 py-2.5 rounded-lg font-bold hover:scale-105 transition-all shadow-md"><Plus size={18} /> Tambah Jenis Bahan</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {ingredients.map((item) => {
          const style = getStyling(item.nama_bahan);
          const stockLevel = Math.min(Math.round((item.stok / 10000) * 100), 100); 
          const status = item.stok > 1000 ? 'Stok Aman' : 'Stok Menipis';

          return (
            <div key={item.id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex flex-col hover:shadow-xl transition-all duration-300 relative group">
              <div className="flex gap-4 mb-6">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-green-50 transition-colors">{style.icon}</div>
                <div><h3 className="font-bold text-gray-800 text-sm">{item.nama_bahan}</h3><p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{style.category}</p></div>
              </div>

              <div className="flex justify-between items-end mb-6">
                <div className="flex items-center gap-4">
                  <div className="relative w-10 h-28 bg-gray-100 rounded-full overflow-hidden flex flex-col justify-end shrink-0">
                    <div className={`w-full ${style.color} rounded-full transition-all duration-1000`} style={{ height: `${stockLevel}%` }}></div>
                  </div>
                  <div className="flex flex-col justify-between py-1 h-full">
                     <span className={`w-fit text-[10px] px-2 py-1 rounded-md font-bold ${style.badgeColor} ${style.textColor} mb-2`}>{status}</span>
                     <h2 className="text-3xl font-black text-gray-800 leading-none">{stockLevel}%</h2>
                     <p className="text-sm font-bold text-gray-600 mt-2">{item.stok} <span className="font-normal text-gray-400">{item.satuan}</span></p>
                  </div>
                </div>
                <button onClick={() => openRestockModal(item)} className="bg-[#deff9a] text-[#005432] p-3 rounded-2xl hover:bg-[#005432] hover:text-white transition-all shadow-sm shrink-0"><ShoppingCart size={20} /></button>
              </div>

              <div className="flex gap-2 mt-auto border-t border-gray-50 pt-4">
                <button onClick={() => openModal(item)} className="p-2 text-gray-400 hover:text-[#005432] transition-colors flex-1 flex justify-center items-center gap-2 text-xs font-bold"><Edit size={14} /> Edit</button>
                <div className="w-px bg-gray-100"></div>
                <button onClick={() => handleDelete(item.id, item.nama_bahan)} className="p-2 text-gray-400 hover:text-red-500 transition-colors flex-1 flex justify-center items-center gap-2 text-xs font-bold"><Trash2 size={14} /> Hapus</button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Layers size={24} /></div>
          <div><p className="text-xs font-bold text-gray-400 uppercase">Total Bahan</p><h3 className="text-2xl font-black text-gray-900">{ingredients.length} Jenis</h3></div>
        </div>
        <div className="bg-[#005432] p-6 rounded-3xl text-white flex items-center gap-4 shadow-lg shadow-green-900/20">
          <div className="p-3 bg-white/10 text-[#deff9a] rounded-2xl"><TrendingDown size={24} /></div>
          <div><p className="text-xs font-bold text-green-200 uppercase">Total Pengeluaran</p><h3 className="text-2xl font-black">Rp {totalExpenses.toLocaleString('id-ID')}</h3></div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-[#deff9a] text-[#005432] rounded-2xl"><TrendingUp size={24} /></div>
          <div><p className="text-xs font-bold text-gray-400 uppercase">Stok Aman</p><h3 className="text-2xl font-black text-gray-900">{ingredients.filter(i => i.stok > 1000).length} Bahan</h3></div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white/95 border border-white/50 rounded-[2.5rem] shadow-2xl overflow-hidden">
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