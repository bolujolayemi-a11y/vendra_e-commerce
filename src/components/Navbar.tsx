"use client"; // CRITICAL: Navbar must be a client component for interactivity
import { Suspense } from 'react';
import Link from 'next/link';
import { ShoppingBag, User, Search, MessageSquare } from 'lucide-react';

// 1. Move the UI into a sub-component
function NavbarContent() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="text-2xl font-black tracking-tighter">
          VENDRA
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-gray-400">
          <Link href="/explore" className="hover:text-black transition">Explore</Link>
          <Link href="/categories" className="hover:text-black transition">Categories</Link>
          <Link href="/login?mode=signup" className="text-black border-b-2 border-black pb-1">
            Sell on Vendra
          </Link>
        </div>

        {/* Icons / Actions */}
        <div className="flex items-center gap-5">
          <button className="p-2 hover:bg-gray-50 rounded-full transition text-gray-400 hover:text-black">
            <Search size={20} strokeWidth={2} />
          </button>
          <Link href="/messages" className="p-2 hover:bg-gray-50 rounded-full transition text-gray-400 hover:text-black">
            <MessageSquare size={20} strokeWidth={2} />
          </Link>
          <Link href="/cart" className="p-2 hover:bg-gray-50 rounded-full transition relative text-gray-400 hover:text-black">
            <ShoppingBag size={20} strokeWidth={2} />
            <span className="absolute top-1.5 right-1.5 bg-black text-white text-[8px] font-black w-3.5 h-3.5 flex items-center justify-center rounded-full">
              0
            </span>
          </Link>
          <Link href="/login" className="hidden sm:block text-gray-400 hover:text-black">
            <User size={20} strokeWidth={2} />
          </Link>
        </div>
      </div>
    </nav>
  );
}

// 2. Export with Suspense wrapper
export default function Navbar() {
  return (
    <Suspense fallback={<div className="h-16 bg-white border-b border-gray-100" />}>
      <NavbarContent />
    </Suspense>
  );
}