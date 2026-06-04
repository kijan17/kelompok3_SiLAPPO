import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  // 1. Panggil hook useNavigate untuk berpindah halaman
  const navigate = useNavigate();
  
  // 2. Buat state untuk menangkap ketikan user di kolom email dan password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 3. Fungsi yang akan berjalan saat tombol Login ditekan
 const handleLogin = (e) => {
    e.preventDefault();

    if (email === 'owner@lappo.com' && password === 'owner123') {
      // Simpan sesi sebagai owner
      localStorage.setItem('role', 'owner'); 
      alert('Login Berhasil sebagai Owner!');
      navigate('/dashboardOwner'); 
      
    } else if (email === 'kasir@lappo.com' && password === 'kasir123') {
      // Simpan sesi sebagai kasir
      localStorage.setItem('role', 'kasir'); 
      alert('Login Berhasil sebagai Kasir!');
      navigate('/dashboardKasir'); 
      
    } else {
      alert('Email atau Password salah!');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 w-full max-w-md">
        
        <h2 className="text-3xl font-bold text-center text-[#005432] mb-8">Login Lappo</h2>
        
        {/* 4. Pastikan form menggunakan onSubmit={handleLogin} */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Tangkap ketikan email
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#005432] focus:ring-1 focus:ring-[#005432] transition-all"
              placeholder="contoh@lappo.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Tangkap ketikan password
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#005432] focus:ring-1 focus:ring-[#005432] transition-all"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#005432] text-white py-4 rounded-xl font-bold hover:bg-[#004225] transition-all shadow-md"
          >
            Masuk
          </button>
        </form>

      </div>
    </div>
  );
};

export default Login;