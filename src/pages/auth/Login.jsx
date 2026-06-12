import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Pastikan lokasi import logo ini sesuai dengan letak folder assets kamu
import LappoLogo from '../../assets/LappoLogo.jpg'; 

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    
    const inputUsername = username.trim();
    
    // 1. Jalur Khusus Owner (Bypass lokal agar owner tetap bisa masuk tanpa tabel khusus)
    if (inputUsername.toLowerCase() === 'owner') {
      localStorage.setItem('role', 'owner');
      localStorage.setItem('kasir_name', 'Owner Lappo');
      navigate('/dashboardOwner'); 
      return;
    }

    // 2. Jalur Login Kasir Nyata (Koneksi ke Database Laravel)
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
        // Simpan data kasir yang login ke localStorage agar dibaca oleh DashboardKasir.jsx
        localStorage.setItem('role', 'kasir');
        localStorage.setItem('kasir_name', data.data.nama_lengkap);
        localStorage.setItem('kasir_id', data.data.id);
        
        alert(`Selamat datang, ${data.data.nama_lengkap}! Status Anda kini: Sedang Jaga.`);
        navigate('/dashboardKasir'); 
      } else {
        alert("Gagal Login: " + data.message);
      }
    } catch (error) {
      console.error("Error Login:", error);
      alert("Tidak dapat terhubung ke server. Pastikan server Laravel sudah dinyalakan!");
    }
  };

  return (
    <div className="min-h-screen flex font-sans">
      
      {/* BAGIAN KIRI: Background Hijau & Logo */}
      <div className="hidden lg:flex flex-col justify-center items-center w-1/2 bg-[#005432]">
        <img 
          src={LappoLogo} 
          alt="Lappo Coffee" 
          className="w-64 object-contain drop-shadow-xl" 
        />
      </div>

      {/* BAGIAN KANAN: Form Login */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center bg-white px-8 md:px-20 lg:px-32 relative">
        
        <div className="w-full max-w-md mx-auto">
          {/* Header Form */}
          <div className="mb-10">
            <h1 className="text-5xl font-extrabold text-[#005432] mb-3 tracking-tight">Login</h1>
            <p className="text-lg text-gray-800 font-semibold">Selamat datang kembali</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Input Username */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wider">
                Username Kasir
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
                className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#005432] focus:ring-1 focus:ring-[#005432] transition-colors"
                required
              />
            </div>

            {/* Tombol Login */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-[#005432] text-white font-bold text-lg py-4 rounded-2xl hover:bg-[#004225] transition-all shadow-[0_8px_20px_-6px_rgba(0,84,50,0.5)]"
              >
                Login
              </button>
            </div>
            
          </form>

          {/* Note kecil untuk pengujian */}
          <p className="text-xs text-center text-gray-400 mt-8">
            *Ketik <b>owner</b> untuk akses Owner, atau gunakan <b>Username Kasir</b> yang telah didaftarkan.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;