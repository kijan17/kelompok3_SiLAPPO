import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Layers, Users, FileText, ShoppingCart, LogOut } from 'lucide-react';
import LappoLogo from '../assets/LappoLogo.jpg'; 

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Ambil data sesi dari localStorage (Default ke 'kasir' jika kosong)
  const userRole = localStorage.getItem('role') || 'kasir';
  const isOwner = userRole === 'owner';

  // 2. Menu Khusus Owner
  const menuOwner = [
    { name: 'Dashboard Owner', icon: <LayoutDashboard size={20} />, path: '/dashboardOwner' },
    { name: 'Katalog Produk', icon: <Package size={20} />, path: '/kelola-produk' },
    { name: 'Stok Bahan Baku', icon: <Layers size={20} />, path: '/stok-bahan' },
    { name: 'Kelola Kasir', icon: <Users size={20} />, path: '/kelola-kasir' },
    { name: 'Laporan Keuangan', icon: <FileText size={20} />, path: '/laporan' },
  ];

  // 3. Menu Khusus Kasir
  const menuKasir = [
    { name: 'Dashboard Kasir', icon: <LayoutDashboard size={20} />, path: '/dashboardKasir' },
    { name: 'Transaksi Baru', icon: <ShoppingCart size={20} />, path: '/pos' },
  ];

  // 4. Tentukan menu mana yang dirender
  const activeMenus = isOwner ? menuOwner : menuKasir;

  // 5. Fungsi Log Out untuk menghapus sesi
  const handleLogout = () => {
    localStorage.removeItem('role'); // Hapus memori role
    navigate('/login'); // Kembalikan ke halaman login
  };

  return (
    <div className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0 shadow-sm font-sans z-50">
      
      {/* AREA LOGO */}
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden border border-gray-100 shadow-sm p-1">
            <img src={LappoLogo} alt="Lappo Coffee Logo" className="w-full h-full object-contain" />
        </div>
        <div className="flex items-center gap-1">
            <span className="text-2xl font-bold text-[#005432] tracking-tight">Lappo</span>
            <span className="text-2xl font-normal text-[#005432] tracking-tight">Coffee</span>
        </div>
      </div>

      {/* NAVIGATION MENU */}
      <nav className="flex-1 px-4 space-y-3 pt-6">
        {activeMenus.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group ${
                isActive 
                  ? 'bg-green-50 text-[#005432] font-semibold shadow-sm' 
                  : 'text-gray-400 hover:bg-green-50/50 hover:text-[#005432]'
              }`}
            >
              <span className={`transition-colors duration-300 ${isActive ? 'text-[#005432]' : 'text-gray-400 group-hover:text-[#005432]'}`}>
                {item.icon}
              </span>
              <span className="text-base tracking-wide">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* LOGOUT AREA */}
      <div className="p-6">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-4 px-6 py-4 w-full bg-red-50 text-red-700 font-bold rounded-2xl hover:bg-red-100 transition-all duration-200 shadow-sm border border-red-100"
        >
          <LogOut size={20} className="rotate-180" />
          <span className="text-sm tracking-tight">
            Log Out {isOwner ? 'Asya' : 'Kasir'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;