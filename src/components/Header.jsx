import React, { useState, useEffect } from 'react';

const Navbar = () => {
  const [currentDate, setCurrentDate] = useState('');
  
  // Mengambil data 'role' dari memori pelayar (diset semasa Login)
  // Jika tiada, ia akan anggap pengguna sebagai 'kasir' secara lalai
  const userRole = localStorage.getItem('role') || 'kasir';

  useEffect(() => {
    const today = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    setCurrentDate(today.toLocaleDateString('id-ID', options));
  }, []);

  return (
    <div className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8 w-full shrink-0">
      
      {/* BAHAGIAN KIRI: Tarikh */}
      <div className="text-sm font-medium text-gray-600">
        {currentDate}
      </div>

      {/* BAHAGIAN KANAN: Foto Profil Dinamik */}
      <div className="flex items-center gap-3 bg-white px-4 py-1.5 rounded-full border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer shadow-sm">
        <div className="text-right hidden sm:block">
          {/* Nama berubah mengikut role */}
          <p className="text-sm font-bold text-gray-900 leading-none">
            {userRole === 'owner' ? 'Owner Lappo' : 'Asya'}
          </p>
          {/* Status berubah mengikut role */}
          <p className="text-[10px] text-[#005432] font-bold mt-1 uppercase">
            {userRole === 'owner' ? 'Owner Aktif' : 'Kasir Aktif'}
          </p>
        </div>
        
        {/* Gambar juga berubah mengikut role */}
        <img 
          src={
            userRole === 'owner' 
              ? "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100&h=100" // Gambar lelaki korporat untuk Owner
              : "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100" // Gambar perempuan untuk Kasir
          } 
          alt="Profile" 
          className="w-8 h-8 rounded-full object-cover border border-gray-200"
        />
      </div>

    </div>
  );
};

export default Navbar;