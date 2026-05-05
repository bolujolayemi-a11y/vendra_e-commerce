"use client";
import Link from 'next/link';
import { 
  ShoppingBag, 
  Zap, 
  ShieldCheck, 
  Smartphone, 
  ArrowRight, 
  Store 
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-6 py-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-black text-white p-1.5 rounded-lg shadow-lg shadow-black/10">
            <Store size={20} />
          </div>
          <span className="text-xl font-black uppercase tracking-tighter text-black">Vendra</span>
        </div>
        
        <div className="flex items-center gap-3">
          {/* TOGGLE UPDATE: Added ?mode=login */}
          <Link 
            href="/login?mode=login" 
            className="text-[10px] font-black uppercase tracking-widest border border-gray-200 px-5 py-2.5 rounded-full hover:bg-gray-50 transition"
          >
            Login
          </Link>
          {/* TOGGLE UPDATE: Added ?mode=signup */}
          <Link 
            href="/login?mode=signup" 
            className="text-[10px] font-black uppercase tracking-widest bg-black text-white px-5 py-2.5 rounded-full hover:bg-gray-800 transition shadow-lg shadow-black/10"
          >
            Create Account
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="px-6 py-20 text-center max-w-4xl mx-auto">
        <div className="inline-block bg-gray-100 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">
          The Future of Nigerian Commerce
        </div>
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-8">
          Turn your products <br />
          <span className="text-gray-300">into a business.</span>
        </h1>
        <p className="text-lg text-gray-500 font-medium mb-10 max-w-xl mx-auto">
          The simplest way to sell online in Nigeria. Professional storefronts, Paystack payments, and WhatsApp orders—all in one place.
        </p>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          {/* TOGGLE UPDATE: Added ?mode=signup */}
          <Link 
            href="/login?mode=signup" 
            className="w-full md:w-auto bg-black text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-105 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-black/20"
          >
            Create Your Account <ArrowRight size={18} />
          </Link>
          <Link 
            href="/s/demo" 
            className="w-full md:w-auto border border-gray-200 px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-gray-50 transition"
          >
            View Demo Store
          </Link>
        </div>
      </header>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="bg-blue-50 text-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight text-black">Instant Setup</h3>
            <p className="text-gray-500 text-sm leading-relaxed">No coding needed. Just enter your store name, upload your products, and start selling immediately.</p>
          </div>

          <div className="space-y-4">
            <div className="bg-green-50 text-green-600 w-12 h-12 rounded-2xl flex items-center justify-center">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight text-black">Secure Payments</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Integrated with Paystack. Money goes directly to your bank account with industry-standard security.</p>
          </div>

          <div className="space-y-4">
            <div className="bg-orange-50 text-orange-600 w-12 h-12 rounded-2xl flex items-center justify-center">
              <Smartphone size={24} />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight text-black">WhatsApp Ready</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Get paid orders delivered straight to your WhatsApp. Chat with customers and close deals faster.</p>
          </div>
        </div>
      </section>

      {/* Preview Section */}
      {/* Preview Section */}
      <section className="bg-gray-50 py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-6 text-black">Designed for <br /> modern vendors.</h2>
            <p className="text-gray-500 font-medium mb-8">
              Whether you sell fabrics, gadgets, or food, Vendra gives you a professional look that builds trust with your customers.
            </p>
            <ul className="space-y-4">
              {['Custom Store URLs', 'Inventory Tracking', 'Mobile Responsive', 'One-click Checkout'].map((item) => (
                <li key={item} className="flex items-center gap-3 font-bold text-sm text-black">
                  <div className="bg-black text-white p-1 rounded-full"><ArrowRight size={10} /></div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* UPDATED: Added Link to dashboard-preview */}
          <Link href="/dashboard-preview" className="relative group cursor-pointer">
            <div className="bg-white p-4 rounded-[3rem] shadow-2xl border border-gray-100 rotate-3 group-hover:rotate-0 transition-transform duration-500">
               <div className="bg-gray-100 aspect-video rounded-[2rem] flex items-center justify-center text-gray-300 font-black uppercase tracking-widest gap-2">
                  <ShoppingBag size={24} />
                  <span>Explore Dashboard</span>
               </div>
            </div>
            
            {/* The Sales Tag */}
            <div className="absolute -bottom-10 -left-10 bg-black text-white p-8 rounded-[2rem] hidden md:block shadow-2xl group-hover:scale-110 transition-transform">
               <p className="text-3xl font-black tracking-tighter">₦100,000+</p>
               <p className="text-[10px] font-bold uppercase tracking-widest opacity-50">Processed this week</p>
            </div>

            {/* Subtle "Click to view" indicator */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
               View Live Demo
            </div>
          </Link>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 text-center px-6">
        <h2 className="text-4xl font-black uppercase tracking-tighter mb-8 text-black">Ready to grow your business?</h2>
        {/* TOGGLE UPDATE: Added ?mode=signup */}
        <Link 
          href="/login?mode=signup" 
          className="bg-black text-white px-12 py-6 rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-110 transition-all shadow-2xl shadow-black/40"
        >
          Create My Store Now
        </Link>
      </section>

      {/* Footer */}
      {/* Footer */}
      <footer className="py-20 border-t border-gray-100 text-center">
        {/* LEGAL LINKS */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-10">
          <Link href="/about" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition">
            About Us
          </Link>
          <Link href="/agreement" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition">
            User Agreement
          </Link>
          <Link href="/privacy" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition">
            Privacy Policy
          </Link>
        </div>

        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-200">
          Vendra &bull; Made for Entrepreneurs
        </p>
      </footer>
    </div>
  );
}