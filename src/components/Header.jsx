import React, { useState, useEffect } from 'react';

const Navbar = () => {
  const [currentDate, setCurrentDate] = useState('');
  // Tambahkan state baru untuk menyimpan nama
  const [userName, setUserName] = useState('');
  
  // Mengambil data 'role' dari memori browser
  const userRole = localStorage.getItem('role') || 'kasir';

  useEffect(() => {
    // 1. Logika untuk Tanggal
    const today = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    setCurrentDate(today.toLocaleDateString('id-ID', options));

    // 2. Logika untuk mengambil Nama Kasir/Owner dari localStorage
    const storedName = localStorage.getItem('kasir_name');
    if (storedName) {
      setUserName(storedName);
    } else {
      // Fallback jika kosong
      setUserName(userRole === 'owner' ? 'Owner Lappo' : 'Kasir');
    }
  }, [userRole]);

  return (
    <div className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8 w-full shrink-0">
      
      {/* BAHAGIAN KIRI: Tarikh */}
      <div className="text-sm font-medium text-gray-600">
        {currentDate}
      </div>

      {/* BAHAGIAN KANAN: Foto Profil Dinamik */}
      <div className="flex items-center gap-3 bg-white px-4 py-1.5 rounded-full border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer shadow-sm">
        <div className="text-right hidden sm:block">
          
          {/* NAMA KINI DINAMIS: Akan menampilkan Aditya, Asya, dll sesuai yang login */}
          <p className="text-sm font-bold text-gray-900 leading-none">
            {userName}
          </p>
          
          {/* Status berubah mengikut role */}
          <p className="text-[10px] text-[#005432] font-bold mt-1 uppercase">
            {userRole === 'owner' ? 'Owner Aktif' : 'Kasir Aktif'}
          </p>
        </div>
        
        {/* Gambar berubah mengikut role */}
        <img 
          src={
            userRole === 'owner' 
              ? "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100&h=100" 
              : "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100" 
          } 
          alt="Profile" 
          className="w-8 h-8 rounded-full object-cover border border-gray-200"
        />
      </div>

    </div>
  );
};

export default Navbar;