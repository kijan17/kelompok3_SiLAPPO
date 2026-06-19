import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertCircle } from 'lucide-react'; // Tambahkan import icon

// Pastikan lokasi import logo ini sesuai dengan letak folder assets kamu
import LappoLogo from '../../assets/LappoLogo.jpg'; 

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // STATE UNTUK ANIMASI PINTU TERBUKA
  const [isAnimating, setIsAnimating] = useState(false);

  // STATE KHUSUS UNTUK POP-UP NOTIFIKASI (TOAST)
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  // FUNGSI PEMANGGIL NOTIFIKASI
  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    // Otomatis hilang setelah 3 detik
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3000);
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault(); 
    
    const inputUsername = username.trim();
    
    // 1. Jalur Khusus Owner
    if (inputUsername.toLowerCase() === 'owner') {
      localStorage.setItem('role', 'owner');
      localStorage.setItem('kasir_name', 'Owner Lappo');
      
      // 🔥 TRIK JITU: Kosongkan password & username seketika 
      // agar tidak terdeteksi sebagai kebocoran data oleh Google Chrome
      setUsername('');
      setPassword('');
      
      showToast("Selamat datang, Owner Lappo!", "success");
      
      // Jeda 1 detik agar toast terbaca, baru jalankan animasi pintu
      setTimeout(() => {
        setIsAnimating(true);
        setTimeout(() => navigate('/dashboardOwner'), 700); 
      }, 1000);
      return;
    }

    // 2. Jalur Login Kasir Nyata
    try {
      const response = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          username: inputUsername,
          password: password
        })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('role', 'kasir');
        localStorage.setItem('kasir_name', data.data.nama_lengkap);
        localStorage.setItem('kasir_id', data.data.id);
        
        // Ganti alert dengan showToast
        showToast(`Selamat datang, ${data.data.nama_lengkap}! Status Anda kini: Sedang Jaga.`, "success");
        
        // Jeda 1.5 detik agar tulisan terbaca, lalu jalankan animasi
        setTimeout(() => {
          setIsAnimating(true);
          setTimeout(() => navigate('/dashboardKasir'), 700);
        }, 1500);

      } else {
        // Notifikasi error jika password/username salah
        showToast("Gagal Login: " + data.message, "error");
      }
    } catch (error) {
      console.error("Error Login:", error);
      showToast("Tidak dapat terhubung ke server. Pastikan server Laravel sudah dinyalakan!", "error");
    }
  };

  return (
    <div className="min-h-screen flex font-sans overflow-hidden bg-gray-50 relative">
      
      {/* TOAST NOTIFICATION POP-UP */}
      <div className={`fixed top-6 right-6 z-[9999] transition-all duration-500 transform ${toast.visible ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-20 opacity-0 scale-95 pointer-events-none'}`}>
        <div className={`flex items-start gap-3 px-5 py-4 rounded-2xl shadow-2xl border ${toast.type === 'success' ? 'bg-white border-green-100' : 'bg-white border-red-100'}`}>
          <div className={`p-2 rounded-full shrink-0 ${toast.type === 'success' ? 'bg-green-50 text-[#005432]' : 'bg-red-50 text-red-600'}`}>
            {toast.type === 'success' ? <CheckCircle2 size={20} strokeWidth={2.5} /> : <AlertCircle size={20} strokeWidth={2.5} />}
          </div>
          <div className="pr-2">
            <p className={`text-sm font-bold ${toast.type === 'success' ? 'text-gray-900' : 'text-red-700'}`}>
              {toast.type === 'success' ? 'Berhasil Login!' : 'Peringatan Sistem'}
            </p>
            <p className="text-xs text-gray-500 font-medium mt-0.5">{toast.message}</p>
          </div>
        </div>
      </div>

      {/* BAGIAN KIRI: Background Hijau & Logo */}
      <div 
        className={`hidden lg:flex flex-col justify-center items-center w-1/2 bg-[#005432] z-10 transition-transform duration-700 ease-in-out ${
          isAnimating ? '-translate-x-full' : 'translate-x-0'
        }`}
      >
        <img 
          src={LappoLogo} 
          alt="Lappo Coffee" 
          className="w-64 object-contain drop-shadow-xl" 
        />
      </div>

      {/* BAGIAN KANAN: Form Login */}
      <div 
        className={`w-full lg:w-1/2 flex flex-col justify-center bg-white px-8 md:px-20 lg:px-32 relative z-10 transition-transform duration-700 ease-in-out ${
          isAnimating ? 'translate-x-full' : 'translate-x-0'
        }`}
      >
        <div className="w-full max-w-md mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-5xl font-extrabold text-[#005432] mb-3 tracking-tight">Login</h1>
            <p className="text-lg text-gray-800 font-semibold">Selamat datang kembali</p>
          </div>

          <div className="space-y-6">
            {/* Input Username */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wider">
                Username 
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan Username Anda"
                className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#005432] focus:ring-1 focus:ring-[#005432] transition-colors"
                required
              />
            </div>

            {/* Input Password */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan Password Anda"
                autoComplete="new-password"
                className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#005432] focus:ring-1 focus:ring-[#005432] transition-colors"
                required
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleLogin(e);
                }}
              />
            </div>

            {/* Tombol Login */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleLogin}
                className="w-full bg-[#005432] text-white font-bold text-lg py-4 rounded-2xl hover:bg-[#004225] transition-all shadow-[0_8px_20px_-6px_rgba(0,84,50,0.5)]"
              >
                Login
              </button>
            </div>
            
          </div>

          {/* Note kecil untuk pengujian */}
         <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500 font-medium">
              Sistem Informasi Internal Lappo Coffee &copy; 2026
            </p>
            <p className="text-[11px] text-gray-400 mt-1">
              Akses sistem ini terbatas hanya untuk staf yang memiliki otorisasi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;