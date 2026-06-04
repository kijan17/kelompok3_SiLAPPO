import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Clock, CheckCircle, BarChart2, X } from 'lucide-react';

const KelolaKasir = () => {
  // State untuk mengontrol Pop-up (Modal) Performa
  const [selectedKasir, setSelectedKasir] = useState(null);

  // Data dummy staf kasir dengan tambahan status "kesimpulan"
  const [kasirList] = useState([
    {
      id: 1,
      nama: 'Nadine Putri Aisyah',
      idStaf: 'LC-KSR-001',
      status: 'Sedang Jaga',
      riwayat: 'Total Shift: 45 | Transaksi: 230',
      foto: 'https://ui-avatars.com/api/?name=Nadine+Putri&background=F3F4F6&color=374151',
      performa: { 
        akurasi: '98%', 
        kecepatan: '1.5 Menit/Pesanan', 
        selisihKas: '0 (Aman)',
        kesimpulan: 'Sangat Baik'
      }
    },
    {
      id: 2,
      nama: 'Raditya Kusuma Putra',
      idStaf: 'LC-KSR-002',
      status: 'Aktif (Offline)',
      riwayat: 'Terakhir Jaga: 2 jam lalu',
      foto: 'https://ui-avatars.com/api/?name=Raditya+Kusuma&background=F3F4F6&color=374151',
      performa: { 
        akurasi: '85%', 
        kecepatan: '3 Menit/Pesanan', 
        selisihKas: '-Rp 15.000 (Kurang)',
        kesimpulan: 'Perlu Evaluasi'
      }
    },
    {
      id: 3,
      nama: 'Ahmad Fauzi Rahman',
      idStaf: 'LC-KSR-003',
      status: 'Sedang Jaga',
      riwayat: 'Total Shift: 32 | Transaksi: 180',
      foto: 'https://ui-avatars.com/api/?name=Ahmad+Fauzi&background=F3F4F6&color=374151',
      performa: { 
        akurasi: '95%', 
        kecepatan: '2 Menit/Pesanan', 
        selisihKas: '+Rp 2.000 (Lebih)',
        kesimpulan: 'Stabil'
      }
    }
  ]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-sans relative">
      
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Selamat Datang, <span className="text-[#005432]">Owner</span></h1>
          <p className="text-gray-500 mt-1">Kelola Staf Kasir Anda di Sini</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 bg-[#005432] text-white px-5 py-2.5 rounded-lg font-medium hover:bg-[#004225] transition-all shadow-sm">
            <Plus size={18} />
            Tambah Kasir Baru
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search" 
              className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#005432] w-64 shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Tabel Kasir */}
      <div className="w-full">
        {/* Header Tabel */}
        <div className="grid grid-cols-12 gap-4 px-6 py-3 text-sm font-bold text-gray-700">
          <div className="col-span-3">Foto & Nama Lengkap</div>
          <div className="col-span-2">ID Staf</div>
          <div className="col-span-2">Status Saat Ini</div>
          <div className="col-span-2">Riwayat Shift</div>
          <div className="col-span-3 text-center">Aksi</div>
        </div>

        {/* Baris Data Kasir */}
        <div className="space-y-3">
          {kasirList.map((kasir) => (
            <div key={kasir.id} className="grid grid-cols-12 gap-4 items-center bg-white rounded-2xl p-4 shadow-sm border border-gray-100 transition-all hover:shadow-md">
              
              <div className="col-span-3 flex items-center gap-4">
                <img src={kasir.foto} alt={kasir.nama} className="w-12 h-12 rounded-xl object-cover border border-gray-100" />
                <span className="font-semibold text-gray-800">{kasir.nama}</span>
              </div>

              <div className="col-span-2 text-gray-600 font-medium">
                {kasir.idStaf}
              </div>

              <div className="col-span-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold ${
                  kasir.status === 'Sedang Jaga' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {kasir.status === 'Sedang Jaga' ? <Clock size={14} /> : <CheckCircle size={14} />}
                  {kasir.status}
                </span>
              </div>

              <div className="col-span-2 text-sm text-gray-600 line-clamp-1">
                {kasir.riwayat}
              </div>

              {/* Tombol Aksi */}
              <div className="col-span-3 flex gap-2 justify-center">
                <button 
                  onClick={() => setSelectedKasir(kasir)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg text-xs font-bold hover:bg-blue-100 transition-all"
                >
                  <BarChart2 size={14} /> Statistik
                </button>
                <button className="flex items-center gap-1.5 px-3 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg text-xs font-bold hover:bg-green-100 transition-all">
                  <Edit2 size={14} /> Edit
                </button>
                <button className="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-bold hover:bg-red-100 transition-all">
                  <Trash2 size={14} />
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Summary Cards Global */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <span className="font-bold text-gray-700 mb-1">Total Kasir Terdaftar</span>
          <span className="font-bold text-4xl text-gray-900">12</span>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <span className="font-bold text-gray-700 mb-1">Kasir Sedang Jaga</span>
          <span className="font-bold text-4xl text-gray-900">3</span>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center relative overflow-hidden">
          <span className="font-bold text-gray-700 mb-1 z-10">Performa Rata-rata Tim</span>
          <span className="font-bold text-4xl text-green-700 z-10">Stabil</span>
          <div className="absolute -bottom-6 -right-4 w-32 h-32 bg-green-50 rounded-full blur-2xl"></div>
        </div>
      </div>

      {/* POP-UP MODAL PERFORMA KASIR */}
      {selectedKasir && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                <BarChart2 className="text-[#005432]" size={20} />
                Rapor Performa Kasir
              </h3>
              <button 
                onClick={() => setSelectedKasir(null)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Profil Singkat & Badge Kesimpulan */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <img src={selectedKasir.foto} alt="Foto" className="w-16 h-16 rounded-2xl border-2 border-gray-100" />
                  <div>
                    <h4 className="font-bold text-gray-900">{selectedKasir.nama}</h4>
                    <p className="text-sm text-gray-500">{selectedKasir.idStaf}</p>
                  </div>
                </div>
                
                {/* Badge Kesimpulan */}
                <div className={`px-3 py-1.5 rounded-lg text-xs font-bold text-center ${
                  selectedKasir.performa.kesimpulan === 'Sangat Baik' ? 'bg-green-100 text-green-700' :
                  selectedKasir.performa.kesimpulan === 'Stabil' ? 'bg-blue-100 text-blue-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {selectedKasir.performa.kesimpulan}
                </div>
              </div>

              {/* Data Metrik */}
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex justify-between items-center">
                  <span className="text-sm text-gray-600 font-medium">Akurasi Transaksi</span>
                  <span className="font-bold text-[#005432]">{selectedKasir.performa.akurasi}</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex justify-between items-center">
                  <span className="text-sm text-gray-600 font-medium">Kecepatan Pelayanan</span>
                  <span className="font-bold text-gray-800">{selectedKasir.performa.kecepatan}</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex justify-between items-center">
                  <span className="text-sm text-gray-600 font-medium">Rekap Selisih Kas</span>
                  <span className={`font-bold ${selectedKasir.performa.selisihKas.includes('-') ? 'text-red-600' : 'text-[#005432]'}`}>
                    {selectedKasir.performa.selisihKas}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default KelolaKasir;     