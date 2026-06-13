import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layout
import MainLayout from './layouts/MainLayout'; 
import RiwayatKasir from './pages/kasir/RiwayatKasir'; // Tetap menggunakan import biasa sesuai kodemu

// === LAZY IMPORT HALAMAN OWNER ===
const DashboardOwner = lazy(() => import('./pages/owner/DashboardOwner'));
const KelolaProduk = lazy(() => import('./pages/owner/KelolaProduk'));
const StokBahan = lazy(() => import('./pages/owner/StokBahan')); 
const KelolaKasir = lazy(() => import('./pages/owner/KelolaKasir'));
const Laporan = lazy(() => import('./pages/owner/Laporan'));
const Login = lazy(() => import('./pages/auth/Login'));

// === LAZY IMPORT HALAMAN KASIR ===
const TransaksiBaru = lazy(() => import('./pages/kasir/TransaksiBaru'));
// Dummy untuk Dashboard Kasir jika belum ada filenya, agar rute tidak pecah
const DashboardKasir = lazy(() => import('./pages/kasir/DashboardKasir').catch(() => ({
  default: () => <div className="p-8"><h1 className="text-2xl font-bold text-gray-800">Dashboard Kasir</h1><p className="text-gray-500 mt-2">Halaman utama operasional shift kasir.</p></div>
})));

const App = () => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen bg-gray-50 text-[#005432] font-bold">
        Memuat halaman...
      </div>
    }>
      <Routes>
        
        {/* Default Route */}
        <Route path="/" element={<Navigate to="/dashboardOwner" replace />} />

        {/* === RUTE AUTH (Tanpa Sidebar) === */}
        <Route path="/login" element={<Login />} />

        {/* === RUTE YANG MENGGUNAKAN SIDEBAR (MainLayout) === */}
        <Route path="/dashboardOwner" element={<MainLayout><DashboardOwner /></MainLayout>} />
        <Route path="/kelola-produk" element={<MainLayout><KelolaProduk /></MainLayout>} />
        <Route path="/stok-bahan" element={<MainLayout><StokBahan /></MainLayout>} /> 
        <Route path="/kelola-kasir" element={<MainLayout><KelolaKasir /></MainLayout>} />
        <Route path="/laporan" element={<MainLayout><Laporan /></MainLayout>} />
        
        <Route path="/dashboardKasir" element={<MainLayout><DashboardKasir /></MainLayout>} /> 
        <Route path="/pos" element={<MainLayout><TransaksiBaru /></MainLayout>} />
        
        {/* 👇 INI YANG KITA PERBAIKI: Membungkus RiwayatKasir dengan MainLayout 👇 */}
        <Route path="/riwayat-transaksi" element={<MainLayout><RiwayatKasir /></MainLayout>} />

      </Routes>
    </Suspense>
  );
};

export default App;