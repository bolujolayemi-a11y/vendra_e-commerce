import Link from 'next/link';
import { ShoppingBag, User, Search, MessageSquare } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="text-2xl font-black tracking-tighter text-vendra-black">
          VENDRA
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link href="/explore" className="hover:text-black transition">Explore</Link>
          <Link href="/categories" className="hover:text-black transition">Categories</Link>
          <Link href="/onboarding" className="text-vendra-black font-semibold border-b-2 border-black pb-1">
            Sell on Vendra
          </Link>
        </div>

        {/* Icons / Actions */}
        <div className="flex items-center gap-5">
          <button className="p-2 hover:bg-gray-50 rounded-full transition">
            <Search size={20} strokeWidth={1.5} />
          </button>
          <Link href="/messages" className="p-2 hover:bg-gray-50 rounded-full transition">
            <MessageSquare size={20} strokeWidth={1.5} />
          </Link>
          <Link href="/cart" className="p-2 hover:bg-gray-50 rounded-full transition relative">
            <ShoppingBag size={20} strokeWidth={1.5} />
            <span className="absolute top-1 right-1 bg-black text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
              0
            </span>
          </Link>
          <Link href="/login" className="hidden sm:block">
            <User size={20} strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </nav>
  );
}