"use client";
import { useState } from 'react';
import { 
  ShoppingBag, 
  ChevronLeft, 
  MessageCircle, 
  Zap, 
  ShieldCheck, 
  ArrowRight,
  Star,
  CreditCard
} from 'lucide-react';
import Link from 'next/link';

const DEMO_PRODUCTS = [
  { id: 1, name: "Premium Cotton Fabric", price: 15000, category: "Textiles", image: "🧵" },
  { id: 2, name: "Vintage Leather Bag", price: 45000, category: "Accessories", image: "💼" },
  { id: 3, name: "Golden Silk Wrap", price: 22000, category: "Textiles", image: "🧣" },
  { id: 4, name: "Handcrafted Sandals", price: 12500, category: "Footwear", image: "👡" },
];

export default function DemoStore() {
  const [cartCount, setCartCount] = useState(0);

  const handleMockPayment = (productName: string) => {
    alert(`DEMO: Redirecting to Paystack for ${productName}... \n\n(In a real store, this would open the Paystack checkout modal)`);
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      {/* DEMO BANNER */}
      <div className="bg-black text-white py-2 px-6 text-[10px] font-black uppercase tracking-[0.3em] text-center sticky top-0 z-50">
        Preview Mode: This is a Sample Vendra Store
      </div>

      <nav className="flex justify-between items-center px-6 py-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition text-black">
            <ChevronLeft size={20} />
          </Link>
          <h1 className="text-2xl font-black uppercase tracking-tighter">Lara's Boutique</h1>
        </div>
        
        <div className="relative bg-gray-100 p-3 rounded-2xl">
          <ShoppingBag size={20} className="text-black" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
              {cartCount}
            </span>
          )}
        </div>
      </nav>

      <header className="px-6 py-12 max-w-7xl mx-auto">
        <div className="bg-gray-50 rounded-[3rem] p-12 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-orange-500 mb-4">
              <Star size={16} fill="currentColor" />
              <span className="text-xs font-black uppercase tracking-widest">Top Rated Vendor</span>
            </div>
            <h2 className="text-5xl font-black uppercase tracking-tighter leading-[0.9] mb-6">
              Quality Materials <br /> <span className="text-gray-300">Sourced Locally.</span>
            </h2>
            <p className="text-gray-500 font-medium mb-8 leading-relaxed">
              Welcome to our digital showroom. We specialize in premium fabrics and handcrafted accessories delivered across Nigeria.
            </p>
            <button className="bg-black text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:scale-105 transition shadow-xl shadow-black/20">
              Browse Collection <ArrowRight size={16} />
            </button>
          </div>
          <div className="w-64 h-64 bg-white rounded-[2.5rem] shadow-2xl flex items-center justify-center text-7xl rotate-3 border border-gray-100">
            ✨
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex justify-between items-end mb-12">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">New Arrivals</p>
            <h3 className="text-3xl font-black uppercase tracking-tighter">Featured Items</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {DEMO_PRODUCTS.map((product) => (
            <div key={product.id} className="group flex flex-col">
              <div className="aspect-square bg-gray-50 rounded-[2.5rem] mb-4 flex items-center justify-center text-6xl group-hover:scale-[1.02] transition-transform duration-500 relative overflow-hidden border border-gray-100">
                {product.image}
                {/* Cart Toggle */}
                <button 
                  onClick={() => setCartCount(prev => prev + 1)}
                  className="absolute top-4 right-4 bg-white p-3 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-black hover:text-white"
                >
                  <PlusIcon />
                </button>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{product.category}</p>
              <h4 className="font-black uppercase tracking-tight text-lg mb-1">{product.name}</h4>
              <p className="font-bold text-gray-900 mb-4">₦{product.price.toLocaleString()}</p>
              
              <button 
                onClick={() => handleMockPayment(product.name)}
                className="w-full py-3 bg-gray-100 text-black rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-colors"
              >
                <CreditCard size={14} /> Buy Now
              </button>
            </div>
          ))}
        </div>
      </main>

      <div className="fixed bottom-8 right-8 z-50">
        <button className="bg-[#25D366] text-white p-6 rounded-[2rem] shadow-2xl hover:scale-110 transition-all flex items-center gap-3 font-black uppercase tracking-widest text-xs group">
          <MessageCircle size={24} fill="white" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 whitespace-nowrap font-black">
            Order on WhatsApp
          </span>
        </button>
      </div>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}