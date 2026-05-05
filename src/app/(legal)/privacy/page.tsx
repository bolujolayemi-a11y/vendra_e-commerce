"use client";
import { Suspense } from 'react'; // Added for build stability
import { ShieldCheck, Lock, EyeOff, Share2, Loader2, Database } from 'lucide-react';

function PrivacyContent() {
  return (
    <div className="max-w-3xl mx-auto py-24 px-8 min-h-screen">
      <header className="mb-20 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="bg-black text-white p-5 rounded-[1.5rem] inline-block mb-8 shadow-2xl shadow-black/20">
          <Lock size={32} />
        </div>
        <h1 className="text-6xl font-black uppercase tracking-tighter text-black leading-none">
          Privacy <br /> Policy
        </h1>
        <p className="mt-6 text-gray-400 font-bold uppercase text-[10px] tracking-[0.4em]">
          Data Protection & Integrity
        </p>
      </header>
      
      <div className="space-y-16">
        {/* Section 1: Data Collection */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-black mb-6 flex items-center gap-3">
             <Database size={18} /> 01. Information We Collect
          </h3>
          <p className="text-gray-500 text-sm md:text-base font-medium leading-relaxed">
            We collect information provided directly by you during store creation. This includes your name, email, store description, and WhatsApp number. Technical data such as IP addresses is collected solely for security auditing and platform stability.
          </p>
        </section>

        {/* Section 2: Payment Data - Dark Mode Card */}
        <section className="bg-black text-white p-12 rounded-[3.5rem] shadow-2xl shadow-black/10 animate-in zoom-in duration-700">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
            <ShieldCheck size={18} className="text-green-400" /> 02. Financial Security
          </h3>
          <p className="text-gray-400 text-sm md:text-base font-medium leading-relaxed">
            Payments are processed via **Paystack**. Vendra does not store, see, or process your customers' debit card details. All financial transactions are handled by Paystack in compliance with PCI-DSS standards.
          </p>
        </section>

        {/* Section 3: Third-Party Services */}
        <section className="animate-in fade-in slide-in-from-bottom-6 duration-800">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-black mb-6 flex items-center gap-3">
            <Share2 size={18} /> 03. Infrastructure Partners
          </h3>
          <p className="text-gray-500 text-sm md:text-base font-medium leading-relaxed mb-6">
            We never sell your data. We only share information with partners necessary to maintain your store:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {['WhatsApp (Customer Leads)', 'Supabase (Secure Database)', 'Vercel (Platform Hosting)', 'Paystack (Payments)'].map((partner) => (
                <div key={partner} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-black bg-gray-50 p-4 rounded-2xl">
                   <div className="h-1.5 w-1.5 bg-black rounded-full" /> {partner}
                </div>
             ))}
          </div>
        </section>

        {/* Section 4: Cookies */}
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-black mb-6 flex items-center gap-3">
            <EyeOff size={18} /> 04. Digital Footprint
          </h3>
          <p className="text-gray-500 text-sm md:text-base font-medium leading-relaxed">
            We use essential cookies to maintain your session. We do not use tracking pixels or third-party advertising cookies. Your privacy is protected by design, not by choice.
          </p>
        </section>

        {/* Data Retention Highlight */}
        <section className="bg-gray-50 p-10 rounded-[3rem] border border-gray-100">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-black mb-4">05. Right to Erasure</h3>
          <p className="text-gray-400 text-sm font-medium leading-relaxed">
            You maintain full control. If you choose to delete your account, all associated store data, product listings, and images are purged from our active databases in accordance with NDPR (Nigeria Data Protection Regulation) guidelines.
          </p>
        </section>
      </div>

      <footer className="py-24 text-center opacity-10">
         <p className="text-[9px] font-black uppercase tracking-[2em]">Vendra Private</p>
      </footer>
    </div>
  );
}

// Wrap in Suspense to fix the Vercel Prerender Bailout
export default function PrivacyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-black" size={32} />
      </div>
    }>
      <PrivacyContent />
    </Suspense>
  );
}