import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // <-- BrowserRouter dihapus dari sini

// Layout
import MainLayout from './layouts/MainLayout'; 

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
    // <-- Tag <Router> sudah dihilangkan dari sini
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen bg-gray-50 text-[#005432] font-bold">
        Memuat halaman...
      </div>
    }>
      <Routes>
        
        {/* Default Route */}
        <Route path="/" element={<Navigate to="/dashboardOwner" replace />} />

        {/* === RUTE YANG MENGGUNAKAN SIDEBAR (MainLayout) === */}
        <Route path="/login" element={<Login />} />
        <Route path="/dashboardOwner" element={<MainLayout><DashboardOwner /></MainLayout>} />
        <Route path="/kelola-produk" element={<MainLayout><KelolaProduk /></MainLayout>} />
        <Route path="/stok-bahan" element={<MainLayout><StokBahan /></MainLayout>} /> 
        <Route path="/kelola-kasir" element={<MainLayout><KelolaKasir /></MainLayout>} />
        <Route path="/laporan" element={<MainLayout><Laporan /></MainLayout>} />
        <Route path="/dashboardKasir" element={<MainLayout><DashboardKasir /></MainLayout>} /> 

        {/* === RUTE KASIR FULL SCREEN (Tanpa Sidebar Owner) === */}
        <Route path="/pos" element={<MainLayout><TransaksiBaru /></MainLayout>} />
        

       {/* === RUTE LOGIN === */}
        <Route path="/login" element={
          <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
            <h1 className="text-4xl font-bold text-[#005432] mb-2">Lappo Coffee</h1>
            <p className="text-gray-500">Halaman Login sedang dalam tahap pembuatan...</p>
          </div>
        } />
        
      </Routes>
    </Suspense>
  );
};

export default App;