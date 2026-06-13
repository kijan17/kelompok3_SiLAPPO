import React, { useState, useEffect } from 'react';
import { Search, Receipt, Eye, Printer, ShoppingBag, X, CheckCircle2, Clock, Calendar as CalendarIcon } from 'lucide-react';

const RiwayatKasir = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // STATE FILTER BARU
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState(''); // State untuk filter tanggal
  
  const [namaKasir, setNamaKasir] = useState('Kasir');
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTrx, setSelectedTrx] = useState(null);
  const [isContentMounted, setIsContentMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => { setIsContentMounted(true); }, 100);

    const storedName = localStorage.getItem('kasir_name');
    if (storedName) setNamaKasir(storedName);

    const kasirId = localStorage.getItem('kasir_id');
    
    fetch(`http://127.0.0.1:8000/api/kasir/${kasirId}/transactions`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTransactions(data.data);
        } else {
          setTransactions([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Gagal load riwayat:", err);
        setTransactions([]); 
        setLoading(false);
      });
  }, []);

  // LOGIKA FILTER GANDA (Pencarian Nota + Filter Tanggal)
  const filteredTrx = transactions.filter(trx => {
    const matchSearch = trx.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDate = filterDate === '' || trx.tanggal === filterDate;
    return matchSearch && matchDate;
  });

  const openDetail = (trx) => {
    setSelectedTrx(trx);
    setIsDetailModalOpen(true);
  };

  const handleCetakStruk = () => {
    alert("Proses mencetak struk ke printer thermal...");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-20">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-[#005432] rounded-full animate-spin"></div>
        <div className="font-bold text-gray-500 text-sm tracking-widest uppercase">Memuat Riwayat...</div>
      </div>
    );
  }

  return (
    <div className="relative font-sans pb-10">
      <div className={`flex flex-col gap-6 transition-all duration-700 ease-out transform ${isContentMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Riwayat <span className="text-[#005432]">Transaksi</span></h1>
            <p className="text-gray-500 mt-1 text-sm">Daftar transaksi yang diproses oleh <span className="font-semibold text-gray-700">{namaKasir}</span> pada shift ini.</p>
          </div>
          
          {/* AREA FILTER */}
          <div className="flex gap-3 w-full md:w-auto">
            {/* Filter Tanggal */}
            <div className="relative">
              <input 
                type="date" 
                value={filterDate} 
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full md:w-40 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 focus:ring-2 focus:ring-[#005432]/20 focus:border-[#005432] outline-none shadow-sm cursor-pointer"
              />
            </div>

            {/* Kolom Pencarian */}
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" placeholder="Cari ID Nota..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#005432]/20 focus:border-[#005432] outline-none transition-all shadow-sm" 
              />
            </div>
          </div>
        </div>

        {/* DATA TABLE SECTION */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
            <div className="flex items-center gap-2">
              <Receipt size={18} className="text-[#005432]" />
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Log Transaksi Kasir</h2>
            </div>
            {filterDate && (
              <button onClick={() => setFilterDate('')} className="text-xs text-red-500 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 font-bold transition-colors">
                Hapus Filter Tanggal ✖
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/80 border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 whitespace-nowrap">ID Nota</th>
                  <th className="px-6 py-4 whitespace-nowrap">Waktu</th>
                  <th className="px-6 py-4 min-w-[200px]">Menu Pesanan</th>
                  <th className="px-6 py-4 text-center whitespace-nowrap">Total Item</th>
                  <th className="px-6 py-4 whitespace-nowrap">Total Harga</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredTrx.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-16 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <ShoppingBag size={48} strokeWidth={1} className="mb-4 opacity-50 text-gray-300" />
                        <p className="font-bold text-gray-500 text-base">Riwayat Kosong</p>
                        <p className="text-xs mt-1">Belum ada transaksi di tanggal ini atau shift masih baru.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredTrx.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50/80 transition-colors group">
                      <td className="px-6 py-4 align-top">
                        <span className="font-mono font-bold text-[11px] text-gray-600 bg-white border border-gray-200 px-2.5 py-1.5 rounded-md shadow-sm whitespace-nowrap">{row.id}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 font-medium text-xs align-top whitespace-nowrap">
                        {row.waktu}
                      </td>
                      <td className="px-6 py-4 align-top">
                        <div className="flex flex-wrap gap-1.5">
                          {row.items && row.items.map((item, idx) => (
                            <span key={idx} className="inline-flex items-center text-[10px] font-bold text-gray-600 bg-gray-100/80 border border-gray-200 px-2 py-1 rounded-md">
                              <span className="text-[#005432] mr-1">{item.qty}x</span> {item.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-gray-700 align-top">
                        {row.total_item}
                      </td>
                      <td className="px-6 py-4 align-top whitespace-nowrap">
                        <span className="font-black text-gray-900">Rp {row.total_pembayaran.toLocaleString('id-ID')}</span>
                      </td>
                      <td className="px-6 py-4 text-center align-top">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold bg-green-50 text-green-700 border border-green-200 uppercase tracking-wide">
                          <CheckCircle2 size={12} /> {row.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right align-top">
                        <button 
                          onClick={() => openDetail(row)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-lg text-xs font-bold hover:text-[#005432] hover:border-[#005432]/30 hover:bg-green-50 transition-all shadow-sm"
                        >
                          <Eye size={14} /> Detail
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL STRUK / DETAIL TRANSAKSI */}
      {isDetailModalOpen && selectedTrx && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setIsDetailModalOpen(false)}></div>
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 border border-gray-100 flex flex-col">
            
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                <Receipt size={16} /> Detail Nota
              </h2>
              <button onClick={() => setIsDetailModalOpen(false)} className="text-gray-400 hover:text-gray-600 bg-white border border-gray-200 p-1.5 rounded-md shadow-sm transition-colors"><X size={16}/></button>
            </div>
            
            <div className="p-6 bg-white flex-1 overflow-y-auto">
              <div className="text-center mb-6">
                <h3 className="font-black text-xl text-gray-900 tracking-tight">LAPPO COFFEE</h3>
                <p className="text-xs text-gray-500 mt-1">Jl. Sudirman, Pekanbaru</p>
                <div className="border-b-2 border-dashed border-gray-200 my-4"></div>
                <div className="flex justify-between text-xs text-gray-500 font-mono">
                  <span>{selectedTrx.waktu}</span>
                  <span>{selectedTrx.id}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 font-mono mt-1">
                  <span>Kasir:</span>
                  <span className="font-bold text-gray-700">{namaKasir}</span>
                </div>
                <div className="border-b-2 border-dashed border-gray-200 my-4"></div>
              </div>

              <div className="space-y-3 mb-6">
                {selectedTrx.items && selectedTrx.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-800">{item.name}</span>
                      <span className="text-xs text-gray-500">{item.qty} x Rp {item.price.toLocaleString('id-ID')}</span>
                    </div>
                    <span className="font-bold text-gray-900 mt-auto">Rp {(item.qty * item.price).toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>

              <div className="border-t-2 border-gray-900 pt-3">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-bold text-gray-600 uppercase tracking-wider">Total Pembayaran</span>
                  <span className="text-2xl font-black text-[#005432]">Rp {selectedTrx.total_pembayaran.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-3">
              <button onClick={() => setIsDetailModalOpen(false)} className="flex-1 bg-white border border-gray-200 text-gray-600 py-3 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors shadow-sm">
                Tutup
              </button>
              <button onClick={handleCetakStruk} className="flex-1 bg-[#005432] text-white py-3 rounded-xl font-bold text-sm hover:bg-green-900 transition-colors shadow-sm flex items-center justify-center gap-2">
                <Printer size={16} /> Cetak Struk
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default RiwayatKasir;