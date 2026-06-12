import React, { useState, useEffect } from 'react';
import { Play, Square } from 'lucide-react';

const DashboardKasir = () => {
  const [namaKasir, setNamaKasir] = useState('Kasir');
  const [isShiftActive, setIsShiftActive] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const [pendapatanShift, setPendapatanShift] = useState(0);    

  // 1. INISIALISASI (Tarik data dari localStorage saat halaman dibuka ulang)
  useEffect(() => {
    const storedName = localStorage.getItem('kasir_name');
    if (storedName) setNamaKasir(storedName);

    // Cek apakah shift sedang aktif di memori
    const shiftActive = localStorage.getItem('is_shift_active');
    const shiftStart = localStorage.getItem('shift_start_time');

    if (shiftActive === 'true' && shiftStart) {
      setIsShiftActive(true);
      // Hitung selisih detik dari waktu mulai sampai sekarang
      const elapsedSeconds = Math.floor((Date.now() - parseInt(shiftStart)) / 1000);
      setSeconds(elapsedSeconds > 0 ? elapsedSeconds : 0);
    }
   fetchPendapatan();
  }, []);

  const fetchPendapatan = async () => {
    const kasirId = localStorage.getItem('kasir_id');
    if (!kasirId) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/kasir/${kasirId}/pendapatan`);
      const data = await response.json();
      if (data.success) {
        setPendapatanShift(data.pendapatan);
      }
    } catch (error) {
      console.error("Gagal mengambil pendapatan:", error);
    }
  };

  // 2. STOPWATCH EFFECT
  useEffect(() => {
    let interval = null;
    if (isShiftActive) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (!isShiftActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isShiftActive, seconds]);

  const formatTime = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const getInitials = (name) => {
    if (!name) return "KS";
    const words = name.trim().split(' ');
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  // 3. FUNGSI KLIK TOMBOL MULAI / AKHIRI SHIFT
  const handleToggleShift = async () => {
    const kasirId = localStorage.getItem('kasir_id');
    
    if (!kasirId) {
      alert("Sesi tidak valid, silakan login ulang!");
      return;
    }

    const endpoint = isShiftActive 
      ? `http://127.0.0.1:8000/api/kasir/${kasirId}/end-shift`
      : `http://127.0.0.1:8000/api/kasir/${kasirId}/start-shift`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Accept': 'application/json' }
      });
      
      const data = await response.json();

      if (data.success) {
        if (isShiftActive) {
          // SHIFT DIAKHIRI -> Hapus data dari memori browser
          setIsShiftActive(false);
          setSeconds(0);
          localStorage.removeItem('is_shift_active');
          localStorage.removeItem('shift_start_time');
        } else {
          // SHIFT DIMULAI -> Simpan waktu mulai ke memori browser
          setIsShiftActive(true);
          localStorage.setItem('is_shift_active', 'true');
          localStorage.setItem('shift_start_time', Date.now().toString());
        }
      }
    } catch (error) {
      console.error("Error API:", error);
      alert("Gagal menghubungi server.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-sans p-2">
      
      {/* HEADER TITLE */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Selamat Datang, <span className="text-[#005432]">{namaKasir}</span></h1>
        <p className="text-gray-500 mt-2">Kelola Shift kerja dan pantau Performamu hari ini</p>
      </div>

      {/* CARDS CONTAINER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 w-full max-w-5xl">
        
        {/* CARD 1: PROFILE KASIR */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-center justify-center relative">
          <div className="relative mb-5">
            <div className="w-32 h-32 bg-[#005432] rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-md uppercase">
              {getInitials(namaKasir)}
            </div>
            <div className={`absolute bottom-2 right-2 w-7 h-7 border-4 border-white rounded-full shadow-sm ${isShiftActive ? 'bg-green-400' : 'bg-gray-400'}`}></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{namaKasir}</h2>
          <p className="text-gray-400 text-sm mb-8 font-medium">Kasir Utama Shift Pagi</p>
        {/* UBAH BAGIAN INI */}
<div className="w-full bg-green-50/50 border border-green-100 rounded-2xl py-4 flex items-center justify-center">
  <span className="text-2xl font-bold text-[#005432]">
    Rp {pendapatanShift.toLocaleString('id-ID')}
  </span>
</div>
        </div>

        {/* CARD 2: STATUS SHIFT */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <h3 className="text-sm font-bold text-gray-500 tracking-widest uppercase mb-6">Status Shift</h3>
          
          <div className="w-full bg-gray-50/80 border border-gray-100 rounded-2xl py-8 flex items-center justify-center mb-8">
            <span className="text-5xl font-black text-gray-800 tracking-widest font-mono">
              {formatTime(seconds)}
            </span>
          </div>

          <button 
            onClick={handleToggleShift}
            className={`w-full text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 mb-4 
              ${isShiftActive ? 'bg-red-600 hover:bg-red-700' : 'bg-[#005432] hover:bg-[#004225]'}`}
          >
            {isShiftActive ? <Square fill="currentColor" size={20} /> : <Play fill="currentColor" size={20} />} 
            {isShiftActive ? 'Akhiri Shift' : 'Mulai Shift'}
          </button>
          
          <p className="text-sm text-gray-400 italic">
            {isShiftActive ? 'Shift sedang berjalan...' : 'Shift belum dimulai.'}
          </p>
        </div>

      </div>
    </div>
  );
};

export default DashboardKasir;