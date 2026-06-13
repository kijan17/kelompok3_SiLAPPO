import React, { useState, useEffect } from 'react';

const Header = () => {
  const [userName, setUserName] = useState('Kasir');
  const [userRole, setUserRole] = useState('kasir');

  useEffect(() => {
    // Ambil nama dan role dari localStorage saat komponen dimuat
    const name = localStorage.getItem('kasir_name');
    const role = localStorage.getItem('role');
    
    if (name) setUserName(name);
    if (role) setUserRole(role);
  }, []);

  // FUNGSI PEMBUAT INISIAL OTOMATIS
  const getInitials = (name) => {
    if (!name) return "KS";
    const words = name.trim().split(' ');
    // Jika nama terdiri dari 2 kata atau lebih, ambil huruf pertama dari 2 kata pertama
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    // Jika cuma 1 kata, ambil 2 huruf pertamanya
    return name.substring(0, 2).toUpperCase();
  };

  // Format tanggal hari ini (Contoh: Minggu, 14 Juni 2026)
  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center sticky top-0 z-40">
      
      {/* BAGIAN KIRI: Tanggal */}
      <div className="text-gray-600 font-medium text-sm">
        {today}
      </div>

      {/* BAGIAN KANAN: Profil Info & Inisial */}
      <div className="flex items-center gap-3 bg-white border border-gray-100 shadow-sm py-1.5 px-1.5 rounded-full hover:shadow-md transition-shadow cursor-default">
        
        {/* Teks Nama & Status */}
        <div className="flex flex-col text-right pl-4">
          <span className="font-bold text-gray-900 text-sm leading-tight">{userName}</span>
          <span className="text-[10px] font-bold text-[#005432] uppercase tracking-widest mt-0.5">
            {userRole === 'owner' ? 'Owner Aktif' : 'Kasir Aktif'}
          </span>
        </div>
        
        {/* LINGKARAN INISIAL (Pengganti Gambar) */}
        <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm shadow-inner">
          {getInitials(userName)}
        </div>

      </div>
    </header>
  );
};

export default Header;