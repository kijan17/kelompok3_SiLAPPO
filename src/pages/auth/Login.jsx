import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Pastikan lokasi import logo ini sesuai dengan letak folder assets kamu
import LappoLogo from '../../assets/LappoLogo.jpg'; 

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Fungsi untuk memproses login bohongan
  const handleLogin = (e) => {
    e.preventDefault();
    
    // Hilangkan spasi berlebih dan ubah semua huruf jadi kecil
    const inputEmail = email.toLowerCase().trim();
    
    // Logika pembagian peran: Asalkan mengandung kata 'owner', masuk ke Dasbor Owner
    if (inputEmail.includes('owner')) {
      localStorage.setItem('role', 'owner');
      navigate('/dashboardOwner'); 
    } else {
      // Selain owner (termasuk kasir, admin, dsb), masuk ke Dasbor Kasir
      localStorage.setItem('role', 'kasir');
      navigate('/dashboardKasir'); 
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
            
            {/* Input Email */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wider">
                Email
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan Email Anda"
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
            *Ketik <b>owner</b> atau <b>kasir</b> di email untuk testing.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;