import React, { useState, useEffect } from 'react';
import { Play, Square, Clock, Award, Wallet } from 'lucide-react';

const DashboardKasir = () => {
  const [namaKasir, setNamaKasir] = useState('Kasir');
  const [isShiftActive, setIsShiftActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [pendapatanShift, setPendapatanShift] = useState(0);

  const [isContentMounted, setIsContentMounted] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem('kasir_name');
    const kasirId = localStorage.getItem('kasir_id'); 
    
    if (storedName) setNamaKasir(storedName);

    const shiftActive = localStorage.getItem(`is_shift_active_${kasirId}`);
    const shiftStart = localStorage.getItem(`shift_start_time_${kasirId}`);

    if (shiftActive === 'true' && shiftStart) {
      setIsShiftActive(true);
      const elapsedSeconds = Math.floor((Date.now() - parseInt(shiftStart)) / 1000);
      setSeconds(elapsedSeconds > 0 ? elapsedSeconds : 0);
    } else {
      setIsShiftActive(false);
      setSeconds(0);
    }

    fetchPendapatan();

    // Trigger animasi berurutan setelah 100ms halaman dimuat
    const timer = setTimeout(() => {
        setIsContentMounted(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

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
          setIsShiftActive(false);
          setSeconds(0);
          localStorage.removeItem(`is_shift_active_${kasirId}`);
          localStorage.removeItem(`shift_start_time_${kasirId}`);
        } else {
          setIsShiftActive(true);
          localStorage.setItem(`is_shift_active_${kasirId}`, 'true');
          localStorage.setItem(`shift_start_time_${kasirId}`, Date.now().toString());
        }
      }
    } catch (error) {
      console.error("Error API:", error);
      alert("Gagal menghubungi server.");
    }
  };

  return (
    <div className="relative min-h-screen font-sans pb-10">
      
      {/* HEADER SECTION (Muncul Pertama) */}
      <div className={`border-b border-gray-200 pb-5 transition-all duration-700 ease-out transform ${isContentMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Selamat Datang, <span className="text-[#005432]">{namaKasir}</span></h1>
        <p className="text-gray-500 mt-1 text-sm">Kelola sesi kerja (*shift*) dan pantau performa transaksimu hari ini.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-5xl mt-6">
        
        {/* KARTU PROFIL KASIR (Meluncur Kedua - Delay 200ms) */}
        <div className={`bg-white rounded-2xl p-8 border border-gray-200 shadow-sm flex flex-col relative overflow-hidden group hover:border-[#005432]/30 transition-all duration-[1000ms] delay-[200ms] ease-out transform ${isContentMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="absolute right-0 top-0 w-32 h-32 bg-green-50 rounded-bl-full -z-10"></div>
          
          <div className="flex items-center gap-6 mb-8">
            <div className="relative">
              <div className="w-24 h-24 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center text-3xl font-bold text-slate-700 shadow-sm uppercase">
                {getInitials(namaKasir)}
              </div>
              <div className={`absolute bottom-1 right-1 w-6 h-6 border-4 border-white rounded-full shadow-sm ${isShiftActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 leading-tight">{namaKasir}</h2>
              <div className="flex items-center gap-1.5 mt-1">
                <Award size={14} className="text-[#005432]" />
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Kasir Utama</p>
              </div>
            </div>
          </div>

          <div className="mt-auto bg-gray-50/80 border border-gray-100 rounded-xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 text-[#005432] rounded-lg"><Wallet size={20}/></div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Pendapatan Shift Ini</p>
                <p className="text-2xl font-black text-gray-900">
                  Rp {pendapatanShift.toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* KARTU DURASI & TOMBOL SHIFT (Meluncur Ketiga - Delay 400ms) */}
        <div className={`bg-white rounded-2xl p-8 border border-gray-200 shadow-sm flex flex-col justify-between hover:border-[#005432]/30 transition-all duration-[1000ms] delay-[400ms] ease-out transform ${isContentMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Clock size={18} className="text-gray-400" />
              <h3 className="text-xs font-bold text-gray-500 tracking-widest uppercase">Durasi Shift Aktif</h3>
            </div>
            
            <div className="w-full bg-gray-50 border border-gray-100 rounded-xl py-8 flex items-center justify-center mb-8 shadow-inner">
              <span className="text-5xl font-black text-gray-800 tracking-wider font-mono">
                {formatTime(seconds)}
              </span>
            </div>
          </div>

          <div>
            <button 
              onClick={handleToggleShift}
              className={`w-full text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md mb-3 
                ${isShiftActive ? 'bg-red-600 hover:bg-red-700' : 'bg-Power bg-[#005432] hover:bg-[#004225]'}`}
            >
              {isShiftActive ? <Square fill="currentColor" size={18} /> : <Play fill="currentColor" size={18} />} 
              {isShiftActive ? 'Akhiri Sesi Shift' : 'Mulai Sesi Shift'}
            </button>
            
            <p className="text-xs text-center font-medium text-gray-400">
              {isShiftActive ? <span className="text-green-600">Sistem POS Terkunci Terbuka. Anda sedang bekerja.</span> : 'Sistem POS Terkunci. Shift belum dimulai.'}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardKasir;