import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';

// Gunakan path yang sangat spesifik
const Login = lazy(() => import('./pages/auth/Login'));
const DashboardKasir = lazy(() => import('./pages/kasir/DashboardKasir'));
const DashboardOwner = lazy(() => import('./pages/owner/DashboardOwner'));
const KelolaProduk = lazy(() => import('./pages/owner/KelolaProduk'));
const StokBahan = lazy(() => import('./pages/owner/StokBahan'));
const KelolaKasir = lazy(() => import('./pages/owner/KelolaKasir'));
const Laporan = lazy(() => import('./pages/owner/Laporan'));

function App() {
  return (
    // Suspense dengan fallback Loading yang jelas
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-gray-50 text-[#005432] font-bold">
        Memuat Lappo Coffee...
      </div>
    }>
      <Routes>
        {/* Halaman Login dengan AuthLayout */}
        <Route 
          path="/login" 
          element={
            <AuthLayout>
              <Login />
            </AuthLayout>
          } 
        />

        {/* Halaman Dashboard Kasir dengan MainLayout */}
        <Route 
          path="/dashboardKasir" 
          element={
            <MainLayout>
              <DashboardKasir />
            </MainLayout>
          } 
        />

        <Route path="/kelola-produk" element={<MainLayout><KelolaProduk /></MainLayout>} />

        <Route path="/stok-bahan" element={<MainLayout><StokBahan /></MainLayout>} />

        <Route path="/kelola-kasir" element={<MainLayout><KelolaKasir /></MainLayout>} />

      {/* 3. TAMBAHKAN Route untuk Dashboard Owner */}
        <Route path="/dashboardOwner" element={<MainLayout><DashboardOwner /></MainLayout>} />

        <Route path="/laporan" element={<MainLayout><Laporan /></MainLayout>} />

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<div className="p-10">Halaman Tidak Ditemukan</div>} />
      </Routes>
    </Suspense>
  );
}

export default App;