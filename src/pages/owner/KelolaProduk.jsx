import React, { useState } from 'react';
import { Plus, Edit2, Coffee, Trash2, Info } from 'lucide-react';

const KelolaProduk = () => {
  // Data produk sekarang memiliki "recipe" untuk memotong stok otomatis nanti
  const [products] = useState([
    {
      id: 1,
      name: 'Americano Hot',
      description: 'Espresso murni yang diekstrak sempurna dicampur dengan air panas.',
      originalPrice: 20000,
      price: 15000,
      status: 'Tersedia',
      // INI ADALAH JEMBATAN KE HALAMAN STOK BAHAN BAKU
      recipe: [
        { ingredient: 'Biji Arabica Gayo', qty: '18g' },
        { ingredient: 'Paper Cup 16oz', qty: '1 pcs' }
      ]
    },
    {
      id: 2,
      name: 'Lappo Signature Aren',
      description: 'Kopi susu gula aren racikan rahasia Lappo dengan double espresso.',
      originalPrice: 25000,
      price: 20000,
      status: 'Tersedia',
      recipe: [
        { ingredient: 'Biji Arabica Gayo', qty: '18g' },
        { ingredient: 'Susu UHT', qty: '120ml' },
        { ingredient: 'Gula Aren Bubuk', qty: '20g' }
      ]
    },
    {
      id: 3,
      name: 'Matcha Latte',
      description: 'Premium matcha green tea dicampur dengan susu segar murni.',
      originalPrice: null,
      price: 30000,
      status: 'Habis',
      recipe: [
        { ingredient: 'Matcha Powder', qty: '25g' },
        { ingredient: 'Susu UHT', qty: '150ml' }
      ]
    },
    {
      id: 4,
      name: 'Caramel Macchiato',
      description: 'Espresso dengan sirup vanilla, susu, dan saus karamel di atasnya.',
      originalPrice: 35000,
      price: 28000,
      status: 'Tersedia',
      recipe: [
        { ingredient: 'Biji Arabica Gayo', qty: '18g' },
        { ingredient: 'Susu UHT', qty: '100ml' },
        { ingredient: 'Sirup Karamel', qty: '15ml' }
      ]
    }
  ]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header Halaman */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Kelola Produk</h1>
          <p className="text-gray-500 mt-1">Atur menu, harga, dan resep komposisi bahan</p>
        </div>
        <button className="flex items-center gap-2 bg-[#005432] text-white px-5 py-3 rounded-xl font-bold hover:bg-[#004225] transition-all shadow-sm">
          <Plus size={20} />
          Tambah Produk
        </button>
      </div>

      {/* Grid Produk ala Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col relative group hover:shadow-md transition-all">
            
            {/* Bagian Atas: Gambar dan Info Utama */}
            <div className="flex gap-4 mb-3">
              {/* Placeholder Gambar Produk */}
              <div className="w-24 h-24 bg-gray-50 rounded-xl flex items-center justify-center text-gray-300 flex-shrink-0">
                <Coffee size={40} strokeWidth={1.5} />
              </div>
              
              {/* Detail Teks */}
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 leading-tight">{product.name}</h3>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>

            {/* INFO RESEP (BOM) BARU DITAMBAHKAN */}
            <div className="mb-4 bg-green-50/50 p-2.5 rounded-lg border border-green-100/50">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Info size={12} className="text-[#005432]" />
                <span className="text-[10px] font-bold text-[#005432] uppercase tracking-wider">Komposisi Resep (Auto-Deduct)</span>
              </div>
              <p className="text-[11px] text-gray-600 leading-snug">
                {product.recipe.map(r => `${r.qty} ${r.ingredient}`).join(', ')}
              </p>
            </div>

            {/* Bagian Bawah: Status, Harga, dan Tombol Edit */}
            <div className="flex justify-between items-end mt-auto pt-3 border-t border-gray-50">
              
              {/* Badge Status */}
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${product.status === 'Tersedia' ? 'bg-[#005432]' : 'bg-red-500'}`}></div>
                <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                  {product.status}
                </span>
              </div>

              {/* Harga */}
              <div className="text-right mr-12">
                {product.originalPrice && (
                  <p className="text-[10px] text-gray-400 line-through">
                    Rp {product.originalPrice.toLocaleString('id-ID')}
                  </p>
                )}
                <p className="font-bold text-lg text-gray-900">
                  Rp {product.price.toLocaleString('id-ID')}
                </p>
              </div>
            </div>

            {/* Tombol Aksi Bundar */}
            <button className="absolute bottom-4 right-4 w-10 h-10 bg-green-50 text-[#005432] rounded-full flex items-center justify-center hover:bg-[#005432] hover:text-white transition-colors">
              <Edit2 size={18} />
            </button>

          </div>
        ))}
      </div>
    </div>
  );
};

export default KelolaProduk;