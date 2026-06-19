import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layout
import MainLayout from './layouts/MainLayout'; 
import RiwayatKasir from './pages/kasir/RiwayatKasir'; 

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

// =====================================================================
// SISTEM PENJAGA PINTU (PROTECTED ROUTE)
// =====================================================================
const ProtectedRoute = ({ children, allowedRoles }) => {
  const role = localStorage.getItem('role');
  
  // 1. Jika belum login, tendang paksa ke halaman Login
  if (!role) {
    return <Navigate to="/login" replace />;
  }
  
  // 2. Jika perannya tidak sesuai (misal Kasir nyasar ke URL Owner)
  // Tendang kembali ke dashboard masing-masing
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={role === 'owner' ? '/dashboardOwner' : '/dashboardKasir'} replace />;
  }
  
  // 3. Jika aman, persilakan masuk ke halaman yang dituju
  return children;
};

// =====================================================================
// PENGARAH HALAMAN AWAL (ROOT REDIRECT)
// =====================================================================
const RootRedirect = () => {
  const role = localStorage.getItem('role');
  
  if (role === 'owner') return <Navigate to="/dashboardOwner" replace />;
  if (role === 'kasir') return <Navigate to="/dashboardKasir" replace />;
  
  // Jika tidak ada data role, arahkan ke login
  return <Navigate to="/login" replace />;
};


const App = () => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen bg-gray-50 text-[#005432] font-bold">
        Memuat halaman...
      </div>
    }>
      <Routes>
        
        {/* Default Route: Akan otomatis mengecek status login */}
        <Route path="/" element={<RootRedirect />} />

        {/* === RUTE AUTH (Tanpa Sidebar & Penjaga) === */}
        <Route path="/login" element={<Login />} />


        {/* ========================================== */}
        {/* === RUTE KHUSUS OWNER (Wajib Login) ==== */}
        {/* ========================================== */}
        <Route path="/dashboardOwner" element={
          <ProtectedRoute allowedRoles={['owner']}><MainLayout><DashboardOwner /></MainLayout></ProtectedRoute>
        } />
        <Route path="/kelola-produk" element={
          <ProtectedRoute allowedRoles={['owner']}><MainLayout><KelolaProduk /></MainLayout></ProtectedRoute>
        } />
        <Route path="/stok-bahan" element={
          <ProtectedRoute allowedRoles={['owner']}><MainLayout><StokBahan /></MainLayout></ProtectedRoute>
        } /> 
        <Route path="/kelola-kasir" element={
          <ProtectedRoute allowedRoles={['owner']}><MainLayout><KelolaKasir /></MainLayout></ProtectedRoute>
        } />
        <Route path="/laporan" element={
          <ProtectedRoute allowedRoles={['owner']}><MainLayout><Laporan /></MainLayout></ProtectedRoute>
        } />
        

        {/* ========================================== */}
        {/* === RUTE KHUSUS KASIR (Wajib Login) ==== */}
        {/* ========================================== */}
        <Route path="/dashboardKasir" element={
          <ProtectedRoute allowedRoles={['kasir']}><MainLayout><DashboardKasir /></MainLayout></ProtectedRoute>
        } /> 
        <Route path="/pos" element={
          <ProtectedRoute allowedRoles={['kasir']}><MainLayout><TransaksiBaru /></MainLayout></ProtectedRoute>
        } />
        <Route path="/riwayat-transaksi" element={
          <ProtectedRoute allowedRoles={['kasir']}><MainLayout><RiwayatKasir /></MainLayout></ProtectedRoute>
        } />

        {/* 
            RUTE NYASAR (404 NOT FOUND) 
            Jika ada yang iseng ngetik URL asal-asalan, balikan ke jalur yang benar 
        */}
        <Route path="*" element={<RootRedirect />} />

      </Routes>
    </Suspense>
  );
};

export default App;