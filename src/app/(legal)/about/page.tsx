"use client";
import { Suspense } from 'react'; // MUST IMPORT THIS
import { Store, Zap, Heart, Globe, Loader2 } from 'lucide-react';

// 1. Move your UI into a separate component function
function AboutContent() {
  return (
    <div className="max-w-3xl mx-auto py-24 px-8 min-h-screen">
      <header className="mb-20 text-center animate-in fade-in zoom-in duration-700">
        <div className="bg-black text-white p-5 rounded-[1.5rem] inline-block mb-8 shadow-2xl shadow-black/20">
          <Store size={32} />
        </div>
        <h1 className="text-6xl font-black uppercase tracking-tighter mb-4 text-black leading-none">
            Our Story
        </h1>
        <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.4em]">
            Elevating the Nigerian Vendor
        </p>
      </header>

      <div className="space-y-16">
        <section className="animate-in fade-in slide-in-from-bottom-6 duration-500 fill-mode-both">
          <h2 className="text-xl font-black uppercase tracking-tight mb-4 flex items-center gap-3 text-black">
            <Zap className="text-amber-500" size={20} fill="currentColor" /> 
            The Mission
          </h2>
          <p className="text-gray-500 leading-relaxed font-medium text-sm md:text-base">
            Vendra was built with a simple goal: to remove the technical barriers that stop talented Nigerian entrepreneurs from selling online.
          </p>
        </section>

        <section className="bg-black text-white p-12 rounded-[3.5rem] animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both shadow-2xl shadow-black/10">
          <h2 className="text-xl font-black uppercase tracking-tight mb-4 flex items-center gap-3">
            <Heart className="text-red-500" size={20} fill="currentColor" /> 
            Crafted for Growth
          </h2>
          <p className="text-gray-400 leading-relaxed font-medium text-sm md:text-base">
            By combining seamless WhatsApp communication with secure Paystack payments, we ensure the shopping experience is trusted and efficient.
          </p>
        </section>

        <section className="animate-in fade-in slide-in-from-bottom-10 duration-1000 fill-mode-both">
          <h2 className="text-xl font-black uppercase tracking-tight mb-4 flex items-center gap-3 text-black">
            <Globe className="text-black" size={20} /> 
            Digital Transparency
          </h2>
          <p className="text-gray-500 leading-relaxed font-medium text-sm md:text-base">
            At Vendra, we believe in a clean web. No intrusive ads, no selling of user data, and total transparency.
          </p>
        </section>
      </div>

      <footer className="py-24 text-center">
         <div className="h-[1px] w-12 bg-gray-100 mx-auto mb-8" />
         <p className="text-[9px] font-black uppercase tracking-[1.5em] text-gray-200">
            Vendra &bull; Est. 2026
         </p>
      </footer>
    </div>
  );
}

// 2. The default export wraps the content in a Suspense Boundary
export default function AboutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-gray-200" size={32} />
      </div>
    }>
      <AboutContent />
    </Suspense>
  );
}