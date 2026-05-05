"use client"; // Added this to ensure hooks in layout don't clash
import { Store, Zap, Heart, Globe } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto py-20 px-6">
      <header className="mb-16 text-center">
        <div className="bg-black text-white p-4 rounded-3xl inline-block mb-6 shadow-xl shadow-black/10">
          <Store size={32} />
        </div>
        <h1 className="text-5xl font-black uppercase tracking-tighter mb-4 text-black leading-none">
            About Vendra
        </h1>
        <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em]">
            Empowering Nigerian Commerce
        </p>
      </header>

      <div className="space-y-12">
        {/* Mission Section */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-xl font-black uppercase tracking-tight mb-4 flex items-center gap-2 text-black">
            <Zap className="text-amber-400" size={20} fill="currentColor" /> Our Mission
          </h2>
          <p className="text-gray-500 leading-relaxed font-medium text-sm">
            Vendra was built with a simple goal: to remove the technical barriers that stop talented Nigerian entrepreneurs from selling online. We provide a professional, zero-ad environment where anyone can launch a high-end storefront in under 60 seconds.
          </p>
        </section>

        {/* Values Section */}
        <section className="bg-gray-50 p-10 rounded-[3rem] animate-in fade-in slide-in-from-bottom-6 duration-700">
          <h2 className="text-xl font-black uppercase tracking-tight mb-4 flex items-center gap-2 text-black">
            <Heart className="text-red-500" size={20} fill="currentColor" /> Built for You
          </h2>
          <p className="text-gray-500 leading-relaxed font-medium text-sm">
            We prioritize local solutions for local businesses. By combining seamless WhatsApp communication with secure Paystack payments, we ensure that the shopping experience is familiar, trusted, and efficient for both vendors and customers.
          </p>
        </section>

        {/* Vision Section */}
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h2 className="text-xl font-black uppercase tracking-tight mb-4 flex items-center gap-2 text-black">
            <Globe className="text-blue-500" size={20} /> Transparency First
          </h2>
          <p className="text-gray-500 leading-relaxed font-medium text-sm">
            At Vendra, we believe in a clean web. That means no intrusive ads, no selling of user data, and total transparency in how we operate. Our platform is designed to let your brand shine, not ours.
          </p>
        </section>
      </div>

      <footer className="pt-20 text-center opacity-20">
         <p className="text-[10px] font-black uppercase tracking-[1em]">Vendra 2026</p>
      </footer>
    </div>
  );
}