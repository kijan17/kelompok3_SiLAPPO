import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Coffee, Milk, Droplet, Package, X, Save, ShoppingCart, TrendingDown, TrendingUp, Layers } from 'lucide-react';

const StokBahan = () => {
  const [ingredients, setIngredients] = useState([]);
  const [restockHistory, setRestockHistory] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState(null);
  const [selectedForRestock, setSelectedForRestock] = useState(null);

  const [formData, setFormData] = useState({ nama_bahan: '', stok: '', satuan: 'gram' });
  const [restockFormData, setRestockFormData] = useState({ jumlah_tambah: '', total_harga: '' });

  const [isContentMounted, setIsContentMounted] = useState(false);

  useEffect(() => {
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
    if(window.confirm(`Yakin menghapus bahan baku ${nama}?`)) {
      fetch(`http://127.0.0.1:8000/api/ingredients/${id}`, { method: 'DELETE' }).then(res => res.json()).then(data => { if(data.success) fetchIngredients(); });
    }
  };

  const getStyling = (nama_bahan) => {
    const name = nama_bahan.toLowerCase();
    if (name.includes('kopi')) return { icon: <Coffee size={24} className="text-white" />, gradient: 'from-[#005432] to-green-700', badgeColor: 'bg-green-100 text-green-700', category: 'Biji Kopi Premium' };
    if (name.includes('susu')) return { icon: <Milk size={24} className="text-white" />, gradient: 'from-yellow-400 to-orange-400', badgeColor: 'bg-orange-100 text-orange-700', category: 'Dairy & Milk' };
    if (name.includes('gula')) return { icon: <Droplet size={24} className="text-white" />, gradient: 'from-pink-500 to-red-500', badgeColor: 'bg-red-100 text-red-700', category: 'Sweetener' };
    return { icon: <Package size={24} className="text-white" />, gradient: 'from-blue-500 to-indigo-600', badgeColor: 'bg-blue-100 text-blue-700', category: 'Lainnya' };
  };

  const totalExpenses = restockHistory.reduce((sum, item) => sum + parseInt(item.total_harga || 0), 0);

  return (
    <div className="font-sans relative min-h-screen pb-10">
      
      {/* KONTEN DENGAN ANIMASI BUNGKUS TERPISAH */}
      <div className={`space-y-6 transition-all duration-700 ease-out transform ${isContentMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-6 border-b border-gray-100 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Stok Bahan Baku</h1>
            <p className="text-gray-500 mt-1 text-sm">Kelola persediaan dan pencatatan pengeluaran modal (Restock).</p>
          </div>
          <button onClick={() => openModal()} className="flex items-center justify-center gap-2 bg-[#005432] text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-green-900 transition-all shadow-sm shadow-green-900/20">
            <Plus size={18} /> Tambah Jenis Bahan
          </button>
        </div>

        {/* SUMMARY DASHBOARD KECIL */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 flex items-center gap-4 shadow-sm">
            <div className="p-3 bg-gray-50 border border-gray-100 text-gray-500 rounded-xl"><Layers size={24} /></div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Total Bahan</p>
              <h3 className="text-2xl font-bold text-gray-900">{ingredients.length} Jenis</h3>
            </div>
          </div>
          
          <div className="bg-[#005432] p-5 rounded-2xl text-white flex items-center gap-4 shadow-md relative overflow-hidden">
            <div className="absolute right-0 top-0 w-24 h-24 bg-white/5 rounded-bl-full -z-10"></div>
            <div className="p-3 bg-white/10 border border-white/20 text-green-100 rounded-xl relative z-10"><TrendingDown size={24} /></div>
            <div className="relative z-10">
              <p className="text-xs font-semibold text-green-100 uppercase tracking-wider mb-0.5">Pengeluaran Restock</p>
              <h3 className="text-2xl font-bold">Rp {totalExpenses.toLocaleString('id-ID')}</h3>
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-2xl border border-gray-200 flex items-center gap-4 shadow-sm">
            <div className="p-3 bg-green-50 border border-green-100 text-[#005432] rounded-xl"><TrendingUp size={24} /></div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Kondisi Aman</p>
              <h3 className="text-2xl font-bold text-gray-900">{ingredients.filter(i => i.stok > 1000).length} Bahan</h3>
            </div>
          </div>
        </div>

        {/* GRID KARTU STOK */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {ingredients.map((item) => {
            const style = getStyling(item.nama_bahan);
            const stockLevel = Math.min(Math.round((item.stok / 10000) * 100), 100); 
            const status = item.stok > 1000 ? 'Stok Aman' : 'Stok Menipis';

            return (
              <div key={item.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 flex flex-col hover:border-[#005432]/30 hover:shadow-md transition-all duration-300">
                <div className="flex items-start gap-4 mb-5">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm bg-gradient-to-br ${style.gradient}`}>
                    {style.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-base leading-tight mb-1">{item.nama_bahan}</h3>
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">{style.category}</p>
                  </div>
                </div>

                <div className="mb-5">
                  <div className="flex justify-between items-end mb-2">
                    <h2 className="text-2xl font-bold text-gray-800">{stockLevel}%</h2>
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${style.badgeColor}`}>
                      {status}
                    </span>
                  </div>
                  
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${style.gradient} rounded-full`} style={{ width: `${stockLevel}%` }}></div>
                  </div>
                  
                  <p className="text-xs font-bold text-gray-500 mt-2 text-right">
                    {item.stok} <span className="font-medium text-gray-400">{item.satuan}</span>
                  </p>
                </div>

                <div className="flex gap-2 mt-auto pt-4 border-t border-gray-50">
                  <button onClick={() => openRestockModal(item)} className="flex-1 bg-gray-800 text-white py-2 rounded-lg hover:bg-[#005432] transition-colors flex items-center justify-center gap-1.5 font-semibold text-xs">
                    <ShoppingCart size={14} /> Beli Restock
                  </button>
                  <button onClick={() => openModal(item)} className="w-9 h-9 bg-gray-50 text-gray-500 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-[#005432] hover:text-white hover:border-[#005432] transition-colors">
                    <Edit size={14} />
                  </button>
                  <button onClick={() => handleDelete(item.id, item.nama_bahan)} className="w-9 h-9 bg-red-50 text-red-500 rounded-lg border border-red-100 flex items-center justify-center hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL 1: TAMBAH/EDIT BAHAN (TAMPIL FULL SCREEN KARENA DILUAR DIV TRANSFORM) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 border border-gray-100">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                  <h2 className="text-lg font-bold text-gray-900">{editingIngredient ? 'Edit Bahan Baku' : 'Registrasi Bahan Baru'}</h2>
                  <p className="text-gray-500 text-xs mt-1">Lengkapi nama dan takaran awal bahan baku.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 bg-white border border-gray-200 p-2 rounded-full shadow-sm transition-colors"><X size={16}/></button>
            </div>
            
            <form onSubmit={handleSubmitIngredient} className="p-6 space-y-5">
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Nama Bahan</label>
                <input required value={formData.nama_bahan} onChange={(e) => setFormData({...formData, nama_bahan: e.target.value})} type="text" placeholder="Contoh: Susu Full Cream" className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-gray-800 focus:ring-2 focus:ring-[#005432]/20 focus:border-[#005432] outline-none transition-all" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Jumlah Stok</label>
                  <input required value={formData.stok} onChange={(e) => setFormData({...formData, stok: e.target.value})} type="number" placeholder="0" className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-gray-800 focus:ring-2 focus:ring-[#005432]/20 focus:border-[#005432] outline-none transition-all" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Satuan Takaran</label>
                  <select value={formData.satuan} onChange={(e) => setFormData({...formData, satuan: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-gray-800 focus:ring-2 focus:ring-[#005432]/20 focus:border-[#005432] outline-none transition-all">
                    <option value="gram">Gram (gr)</option>
                    <option value="ml">Mililiter (ml)</option>
                    <option value="pcs">Pieces (pcs)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button type="submit" className="w-full bg-[#005432] text-white py-3.5 rounded-xl font-bold hover:bg-green-900 transition-colors flex justify-center items-center gap-2">
                  <Save size={18} /> Simpan Data Bahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: RESTOCK LOG */}
      {isRestockModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsRestockModalOpen(false)}></div>
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 border border-gray-100">
            <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
              <div>
                  <h2 className="text-lg font-bold text-gray-900">Catat Belanja Restock</h2>
                  <p className="text-[#005432] font-semibold text-sm mt-1">{selectedForRestock?.nama_bahan}</p>
              </div>
              <button onClick={() => setIsRestockModalOpen(false)} className="text-gray-400 hover:text-gray-600 bg-white border border-gray-200 p-2 rounded-full shadow-sm transition-colors"><X size={16}/></button>
            </div>
            
            <form onSubmit={handleSubmitRestock} className="p-6 space-y-5">
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Jumlah Ditambahkan ({selectedForRestock?.satuan})</label>
                  <input required autoFocus type="number" value={restockFormData.jumlah_tambah} onChange={(e) => setRestockFormData({...restockFormData, jumlah_tambah: e.target.value})} placeholder="Contoh: 1000" className="w-full bg-white border border-gray-200 rounded-xl p-3 text-lg font-bold text-gray-800 focus:ring-2 focus:ring-[#005432]/20 focus:border-[#005432] outline-none transition-all" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Total Harga Beli (Rp)</label>
                  <input required type="number" value={restockFormData.total_harga} onChange={(e) => setRestockFormData({...restockFormData, total_harga: e.target.value})} placeholder="Rp..." className="w-full bg-white border border-gray-200 rounded-xl p-3 text-lg font-bold text-gray-800 focus:ring-2 focus:ring-[#005432]/20 focus:border-[#005432] outline-none transition-all" />
                </div>

                <div className="pt-4">
                  <button type="submit" className="w-full bg-[#005432] text-white py-3.5 rounded-xl font-bold hover:bg-green-900 transition-colors shadow-sm">
                    Konfirmasi Pembelian
                  </button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StokBahan;