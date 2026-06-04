import React from 'react';
import Logo from '../assets/LappoLogo.jpg';

const AuthLayout = ({ children }) => {
  return (
    <div className="flex h-screen w-full font-sans">
      {/* SISI KIRI: Background Hijau & Logo */}
      <div className="hidden md:flex w-1/2 bg-[#045232] items-center justify-center">
        <div className="text-center">
          <img 
            src={Logo} 
            alt="Lappo Coffee Logo" 
            className="w-64 h-auto object-contain"
          />
        </div>
      </div>

      {/* SISI KANAN: Tempat Content (Login Form) */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white px-8 lg:px-24">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;