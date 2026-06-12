import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, BarChart2, Users, Clock, Activity, CheckCircle2, X, Save } from 'lucide-react';

const KelolaKasir = () => {
  const [kasirs, setKasirs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKasir, setEditingKasir] = useState(null);
  
  const [formData, setFormData] = useState({ 
    nama_lengkap: '', 
    id_staf: '', 
    status: 'Aktif (Offline)',
    username: '',
    password: ''
  });

  // Ambil data saat halaman pertama kali dimuat
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

  // Buka Modal (Bisa untuk Tambah atau Edit)
  const openModal = (kasir = null) => {
    if (kasir) {
      setEditingKasir(kasir);
      setFormData({ 
        nama_lengkap: kasir.nama_lengkap, 
        id_staf: kasir.id_staf, 
        status: kasir.status,
        username: kasir.username || '',
        password: '' // Dikosongkan saat edit agar password lama tidak tertimpa jika tidak diisi
      });
    } else {
      setEditingKasir(null);
      setFormData({ 
        nama_lengkap: '', 
        id_staf: `LC-KSR-${String(kasirs.length + 1).padStart(3, '0')}`, 
        status: 'Aktif (Offline)',
        username: '',
        password: ''
      });
    }
    setIsModalOpen(true);
  };

  // Simpan Data (POST untuk tambah baru, PUT untuk edit)
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

  // Hapus Data
  const handleDelete = (id, nama) => {
    if(window.confirm(`Yakin ingin menghapus staf kasir: ${nama}?`)) {
      fetch(`http://127.0.0.1:8000/api/kasirs/${id}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(data => { if(data.success) fetchKasirs(); });
    }
  };

  // Fungsi Pembuat Inisial Nama (Misal: "Nadine Putri" -> "NP")
  const getInitials = (name) => {
    if (!name) return "UK";
    const words = name.split(' ');
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  // Hitung Data Statistik Dinamis
  const totalKasir = kasirs.length;
  const kasirSedangJaga = kasirs.filter(k => k.status === 'Sedang Jaga').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-sans relative min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Selamat Datang, <span className="text-[#005432]">Owner</span></h1>
          <p className="text-gray-500 mt-1">Kelola Staf Kasir Anda di Sini</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2.5 bg-white border border-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-[#005432] outline-none shadow-sm" />
          </div>
          <button onClick={() => openModal()} className="flex items-center gap-2 bg-[#005432] text-white px-4 py-2.5 rounded-lg font-bold hover:scale-105 transition-all shadow-md">
            <Plus size={18} /> Tambah Kasir Baru
          </button>
        </div>
      </div>

      {/* Tabel Header (Imitasi) */}
      <div className="grid grid-cols-12 px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
        <div className="col-span-4">Foto & Nama Lengkap</div>
        <div className="col-span-2">ID Staf</div>
        <div className="col-span-2 text-center">Status Saat Ini</div>
        <div className="col-span-2">Riwayat Shift</div>
        <div className="col-span-2 text-right">Aksi</div>
      </div>

      {/* List Kasir Dinamis */}
      <div className="space-y-4">
        {kasirs.length === 0 ? (
            <div className="bg-white p-10 rounded-2xl text-center text-gray-400 border border-gray-100">
                Belum ada data staf kasir. Klik "Tambah Kasir Baru" untuk memulai.
            </div>
        ) : (
            kasirs.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center grid grid-cols-12 hover:shadow-md transition-shadow">
                {/* Kolom 1: Avatar & Nama */}
                <div className="col-span-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center font-black text-gray-600">
                    {getInitials(item.nama_lengkap)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{item.nama_lengkap}</h3>
                  <p className="text-xs text-gray-400">@{item.username}</p>
                </div>
                </div>

                {/* Kolom 2: ID */}
                <div className="col-span-2 text-gray-500 font-medium">
                {item.id_staf}
                </div>

                {/* Kolom 3: Status Badge */}
                <div className="col-span-2 flex justify-center">
                <span className={`px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 w-fit
                    ${item.status === 'Sedang Jaga' ? 'bg-green-100 text-green-700' : 
                    item.status === 'Aktif (Offline)' ? 'bg-yellow-100 text-yellow-700' : 
                    'bg-red-100 text-red-700'}`}>
                    {item.status === 'Sedang Jaga' ? <CheckCircle2 size={12}/> : <Clock size={12}/>} 
                    {item.status}
                </span>
                </div>

                {/* Kolom 4: Dummy Info Shift (karena tabel kasir aslinya belum punya relasi transaksi) */}
                <div className="col-span-2 text-xs text-gray-500">
                {item.status === 'Sedang Jaga' ? 'Total Shift: 12 | Transaksi: 45' : 'Terakhir Jaga: 2 jam lalu'}
                </div>

                {/* Kolom 5: Aksi */}
                <div className="col-span-2 flex justify-end gap-2">
                <button className="flex items-center gap-1 px-3 py-1.5 border border-blue-100 text-blue-600 bg-blue-50 rounded-lg text-xs font-bold hover:bg-blue-600 hover:text-white transition-colors">
                    <BarChart2 size={14}/> Statistik
                </button>
                <button onClick={() => openModal(item)} className="flex items-center gap-1 px-3 py-1.5 border border-green-100 text-green-600 bg-green-50 rounded-lg text-xs font-bold hover:bg-green-600 hover:text-white transition-colors">
                    <Edit size={14}/> Edit
                </button>
                <button onClick={() => handleDelete(item.id, item.nama_lengkap)} className="flex items-center gap-1 px-3 py-1.5 border border-red-100 text-red-500 bg-red-50 rounded-lg text-xs font-bold hover:bg-red-500 hover:text-white transition-colors">
                    <Trash2 size={14}/>
                </button>
                </div>
            </div>
            ))
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-center">
          <p className="text-xs font-bold text-gray-400 uppercase mb-2">Total Kasir Terdaftar</p>
          <div className="flex justify-between items-end">
              <h3 className="text-4xl font-black text-gray-900">{totalKasir}</h3>
              <Users className="text-blue-100" size={48} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-center">
          <p className="text-xs font-bold text-gray-400 uppercase mb-2">Kasir Sedang Jaga</p>
          <div className="flex justify-between items-end">
              <h3 className="text-4xl font-black text-gray-900">{kasirSedangJaga}</h3>
              <Clock className="text-yellow-100" size={48} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-center">
          <p className="text-xs font-bold text-gray-400 uppercase mb-2">Performa Rata-rata Tim</p>
          <div className="flex justify-between items-end">
              <h3 className="text-4xl font-black text-[#005432]">Stabil</h3>
              <Activity className="text-green-100" size={48} />
          </div>
        </div>
      </div>

      {/* MODAL TAMBAH / EDIT KASIR */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white border border-white/50 rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="bg-[#005432] p-6 text-white flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-black">{editingKasir ? 'Edit Data Kasir' : 'Registrasi Kasir Baru'}</h2>
                    <p className="text-green-200 text-xs mt-1">Sistem Manajemen Lappo Coffee</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-green-200 hover:text-white"><X size={24}/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-4">
              <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Nama Lengkap</label>
                  <input required value={formData.nama_lengkap} onChange={(e) => setFormData({...formData, nama_lengkap: e.target.value})} type="text" placeholder="Masukkan nama..." className="w-full bg-gray-50 border-none rounded-xl p-3 font-bold text-gray-800 focus:ring-2 focus:ring-[#005432] outline-none" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Username</label>
                      <input required value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} type="text" placeholder="contoh: asya" className="w-full bg-gray-50 border-none rounded-xl p-3 font-bold text-gray-800 focus:ring-2 focus:ring-[#005432] outline-none" />
                  </div>
                  <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Password</label>
                      <input required={!editingKasir} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} type="password" placeholder={editingKasir ? "(Kosongkan jika tetap)" : "Min. 6 karakter"} className="w-full bg-gray-50 border-none rounded-xl p-3 font-bold text-gray-800 focus:ring-2 focus:ring-[#005432] outline-none" />
                  </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">ID Staf</label>
                    <input required value={formData.id_staf} onChange={(e) => setFormData({...formData, id_staf: e.target.value})} type="text" placeholder="LC-KSR-XXX" className="w-full bg-gray-50 border-none rounded-xl p-3 font-bold text-gray-800 focus:ring-2 focus:ring-[#005432] outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Status Aktif</label>
                    <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl p-3 font-bold text-gray-800 focus:ring-2 focus:ring-[#005432] outline-none">
                        <option value="Aktif (Offline)">Aktif (Offline)</option>
                        <option value="Sedang Jaga">Sedang Jaga</option>
                        <option value="Nonaktif / Cuti">Nonaktif / Cuti</option>
                    </select>
                  </div>
              </div>
              
              <button type="submit" className="w-full bg-[#005432] text-white py-4 rounded-xl font-black shadow-lg hover:bg-green-900 transition-colors mt-2">
                  <Save size={18} className="inline mr-2" /> Simpan Data Staf
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default KelolaKasir;