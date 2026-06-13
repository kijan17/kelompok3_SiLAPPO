import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, BarChart2, Users, Clock, Activity, CheckCircle2, X, Save, MoreHorizontal } from 'lucide-react';

const KelolaKasir = () => {
  const [kasirs, setKasirs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKasir, setEditingKasir] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  
  const [statistikModal, setStatistikModal] = useState({ isOpen: false, data: null, pendapatan: 0 });
  
  const [formData, setFormData] = useState({ 
    nama_lengkap: '', 
    id_staf: '', 
    status: 'Aktif (Offline)',
    username: '',
    password: ''
  });

  useEffect(() => {
    fetchKasirs();
  }, []);

  const fetchKasirs = () => {
    fetch('http://127.0.0.1:8000/api/kasirs')
      .then(res => res.json())
      .then(data => { 
        if (data.success) setKasirs(data.data); 
      })
      .catch(err => console.error("Error fetching kasir:", err));
  };

  const openModal = (kasir = null) => {
    if (kasir) {
      setEditingKasir(kasir);
      setFormData({ 
        nama_lengkap: kasir.nama_lengkap, 
        id_staf: kasir.id_staf, 
        status: kasir.status,
        username: kasir.username || '',
        password: '' 
      });
    } else {
      setEditingKasir(null);
      let maxId = 0;
      kasirs.forEach(k => {
        const num = parseInt(k.id_staf.replace(/[^0-9]/g, ''));
        if (!isNaN(num) && num > maxId) {
            maxId = num;
        }
      });
      const nextId = `LC-KSR-${String(maxId + 1).padStart(3, '0')}`;

      setFormData({ 
        nama_lengkap: '', 
        id_staf: nextId, 
        status: 'Aktif (Offline)',
        username: '',
        password: ''
      });
    }
    setIsModalOpen(true);
  };

  const openStatistik = async (kasir) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/kasir/${kasir.id}/pendapatan`);
      const data = await res.json();
      
      setStatistikModal({
        isOpen: true,
        data: kasir,
        pendapatan: data.success ? data.pendapatan : 0
      });
    } catch (error) {
      console.error("Gagal mengambil statistik", error);
      alert("Gagal mengambil data statistik kasir.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const method = editingKasir ? 'PUT' : 'POST';
    const url = editingKasir 
      ? `http://127.0.0.1:8000/api/kasirs/${editingKasir.id}` 
      : 'http://127.0.0.1:8000/api/kasirs';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(data => { 
      if (data.success) { 
        setIsModalOpen(false); 
        fetchKasirs(); 
      } else {
        alert("Gagal menyimpan: Cek apakah ID Staf/Username sudah digunakan.");
      }
    })
    .catch(err => {
      console.error("Error:", err);
      alert("Terjadi kesalahan koneksi ke server.");
    });
  };

  const handleDelete = (id, nama) => {
    if(window.confirm(`Yakin ingin menghapus staf kasir: ${nama}?`)) {
      fetch(`http://127.0.0.1:8000/api/kasirs/${id}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(data => { if(data.success) fetchKasirs(); });
    }
  };

  const getInitials = (name) => {
    if (!name) return "KS";
    const words = name.split(' ');
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return "Belum ada riwayat";
    const past = new Date(dateString);
    const now = new Date();
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Baru saja";
    if (diffMins < 60) return `${diffMins} mnt lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    return `${diffDays} hari lalu`;
  };

  const filteredKasirs = kasirs.filter(kasir => 
    kasir.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
    kasir.id_staf.toLowerCase().includes(searchTerm.toLowerCase()) ||
    kasir.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalKasir = kasirs.length;
  const kasirSedangJaga = kasirs.filter(k => k.status === 'Sedang Jaga').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans relative min-h-screen pb-10">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Manajemen <span className="text-[#005432]">Staf Kasir</span></h1>
          <p className="text-gray-500 mt-1 text-sm">Pantau aktivitas dan kelola akses tim kasir Lappo Coffee.</p>
        </div>
        <button onClick={() => openModal()} className="flex items-center justify-center gap-2 bg-[#005432] text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-green-900 transition-all shadow-sm shadow-green-900/20">
          <Plus size={18} /> Tambah Kasir Baru
        </button>
      </div>

      {/* KPI METRICS (Dinaikkan ke atas agar profesional) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-blue-100 transition-colors">
          <div>
            <p className="text-sm font-semibold text-gray-500 mb-1">Total Staf Terdaftar</p>
            <h3 className="text-3xl font-bold text-gray-900">{totalKasir}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
            <Users size={24} />
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-yellow-100 transition-colors">
          <div>
            <p className="text-sm font-semibold text-gray-500 mb-1">Kasir Sedang Jaga</p>
            <h3 className="text-3xl font-bold text-gray-900">{kasirSedangJaga}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600 group-hover:scale-110 transition-transform">
            <Clock size={24} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-green-100 transition-colors">
          <div>
            <p className="text-sm font-semibold text-gray-500 mb-1">Performa Tim</p>
            <h3 className="text-3xl font-bold text-[#005432]">Stabil</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-[#005432] group-hover:scale-110 transition-transform">
            <Activity size={24} />
          </div>
        </div>
      </div>

      {/* DATA TABLE SECTION */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white">
          <h2 className="text-lg font-bold text-gray-800">Daftar Staf</h2>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Cari nama, ID, atau username..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-[#005432] outline-none transition-all" 
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-bold">
                <th className="p-5 w-2/5">Profil Staf</th>
                <th className="p-5 w-1/5">ID Staf</th>
                <th className="p-5 w-1/5">Status & Riwayat</th>
                <th className="p-5 w-1/5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredKasirs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-10 text-center text-gray-400">
                    {searchTerm ? "Staf tidak ditemukan." : "Belum ada data staf kasir."}
                  </td>
                </tr>
              ) : (
                filteredKasirs.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center font-bold text-gray-600 text-sm">
                          {getInitials(item.nama_lengkap)}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-sm">{item.nama_lengkap}</h3>
                          <p className="text-xs text-gray-500">@{item.username}</p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="p-5">
                      <span className="font-mono text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-md">{item.id_staf}</span>
                    </td>
                    
                    <td className="p-5">
                      <div className="flex flex-col gap-1.5 items-start">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit
                            ${item.status === 'Sedang Jaga' ? 'bg-green-100 text-green-700' : 
                            item.status === 'Aktif (Offline)' ? 'bg-yellow-100 text-yellow-700' : 
                            'bg-red-100 text-red-700'}`}>
                            {item.status === 'Sedang Jaga' ? <CheckCircle2 size={10}/> : <Clock size={10}/>} 
                            {item.status}
                        </span>
                        <span className="text-[11px] text-gray-400 flex items-center gap-1">
                          <Activity size={10}/>
                          {item.status === 'Sedang Jaga' ? 'Aktif di POS' : formatTimeAgo(item.updated_at)}
                        </span>
                      </div>
                    </td>
                    
                    <td className="p-5">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openStatistik(item)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all tooltip" title="Lihat Statistik">
                          <BarChart2 size={16}/>
                        </button>
                        <button onClick={() => openModal(item)} className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all" title="Edit Staf">
                          <Edit size={16}/>
                        </button>
                        <button onClick={() => handleDelete(item.id, item.nama_lengkap)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Hapus Staf">
                          <Trash2 size={16}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL STATISTIK KASIR */}
      {statistikModal.isOpen && statistikModal.data && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setStatistikModal({ isOpen: false, data: null, pendapatan: 0 })}></div>
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 border border-gray-100">
            <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-bold">Statistik Kasir</h2>
                    <p className="text-slate-400 text-xs mt-1">Performa Shift Hari Ini</p>
                </div>
                <button onClick={() => setStatistikModal({ isOpen: false, data: null, pendapatan: 0 })} className="text-slate-400 hover:text-white transition-colors"><X size={20}/></button>
            </div>
            
            <div className="p-8 text-center space-y-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center font-bold text-slate-800 text-2xl">
                    {getInitials(statistikModal.data.nama_lengkap)}
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 text-xl">{statistikModal.data.nama_lengkap}</h3>
                    <p className="text-sm text-gray-500 font-mono mt-1">{statistikModal.data.id_staf}</p>
                </div>

                <div className="bg-green-50/50 p-5 rounded-2xl border border-green-100">
                    <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-2">Total Pendapatan</p>
                    <p className="text-3xl font-black text-[#005432]">
                        Rp {statistikModal.pendapatan.toLocaleString('id-ID')}
                    </p>
                </div>

                <button onClick={() => setStatistikModal({ isOpen: false, data: null, pendapatan: 0 })} className="w-full bg-gray-50 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors border border-gray-200">
                    Tutup Statistik
                </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH / EDIT KASIR */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 border border-gray-100">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">{editingKasir ? 'Edit Data Staf' : 'Registrasi Kasir Baru'}</h2>
                    <p className="text-gray-500 text-xs mt-1">Lengkapi informasi kredensial di bawah ini.</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 bg-white p-2 rounded-full shadow-sm"><X size={18}/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Nama Lengkap</label>
                  <input required value={formData.nama_lengkap} onChange={(e) => setFormData({...formData, nama_lengkap: e.target.value})} type="text" placeholder="Masukkan nama staf..." className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-gray-800 focus:ring-2 focus:ring-[#005432]/20 focus:border-[#005432] outline-none transition-all" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Username Akun</label>
                      <input required value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} type="text" placeholder="contoh: asya" className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-gray-800 focus:ring-2 focus:ring-[#005432]/20 focus:border-[#005432] outline-none transition-all" />
                  </div>
                  <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Password POS</label>
                      <input required={!editingKasir} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} type="password" placeholder={editingKasir ? "(Biarkan kosong)" : "Min. 6 karakter"} className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-gray-800 focus:ring-2 focus:ring-[#005432]/20 focus:border-[#005432] outline-none transition-all" />
                  </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">ID Staf (Otomatis)</label>
                    <input required readOnly value={formData.id_staf} onChange={(e) => setFormData({...formData, id_staf: e.target.value})} type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-500 outline-none font-mono cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Status Akses</label>
                    <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-gray-800 focus:ring-2 focus:ring-[#005432]/20 focus:border-[#005432] outline-none transition-all">
                        <option value="Aktif (Offline)">Aktif (Offline)</option>
                        <option value="Sedang Jaga">Sedang Jaga</option>
                        <option value="Nonaktif / Cuti">Nonaktif / Cuti</option>
                    </select>
                  </div>
              </div>
              
              <div className="pt-2">
                <button type="submit" className="w-full bg-[#005432] text-white py-3.5 rounded-xl font-bold hover:bg-green-900 transition-colors flex justify-center items-center gap-2">
                    <Save size={18} /> {editingKasir ? 'Simpan Perubahan' : 'Daftarkan Staf'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default KelolaKasir;