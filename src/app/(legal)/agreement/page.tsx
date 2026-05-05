"use client";
import { Suspense } from 'react';
import { Scale, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';

function AgreementContent() {
  return (
    <div className="max-w-3xl mx-auto py-24 px-8 min-h-screen">
      {/* Header with improved tracking */}
      <header className="mb-20 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="bg-black text-white p-5 rounded-[1.5rem] inline-block mb-8 shadow-2xl shadow-black/20">
          <Scale size={32} />
        </div>
        <h1 className="text-6xl font-black uppercase tracking-tighter text-black leading-none">
          User <br /> Agreement
        </h1>
        <p className="mt-6 text-gray-400 font-bold uppercase text-[10px] tracking-[0.4em]">
          Vendra Operations &bull; Terms of Service
        </p>
      </header>
      
      <div className="space-y-16">
        {/* Core Terms - High Contrast */}
        <section className="border-l-[6px] border-black pl-10 py-2 animate-in fade-in slide-in-from-left-4 duration-500">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-black mb-6">01. Service Scope</h3>
          <p className="text-gray-500 text-sm md:text-base font-medium leading-relaxed">
            By activating a Vendra store, you agree to operate with integrity. You are solely responsible for the legality of your goods, the fulfillment of WhatsApp orders, and the maintenance of your Paystack merchant status.
          </p>
        </section>

        {/* Prohibited Use - Clean Warning */}
        <section className="pl-11 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-black mb-6 flex items-center gap-3">
            <AlertCircle size={18} className="text-red-500" /> 
            02. Prohibited Conduct
          </h3>
          <p className="text-gray-500 text-sm md:text-base font-medium leading-relaxed">
            Counterfeit items, illegal substances, and fraudulent financial services are strictly forbidden. Vendra reserves the right to terminate access to any storefront found in violation of Nigerian commercial laws.
          </p>
        </section>

        {/* Fees - Boutique Style Card */}
        <section className="bg-black text-white p-12 rounded-[3.5rem] shadow-2xl shadow-black/10 animate-in zoom-in duration-1000">
           <div className="flex items-center gap-3 mb-6">
             <ShieldCheck className="text-green-400" size={20} />
             <h3 className="text-xs font-black uppercase tracking-[0.3em]">03. Fees & Transparency</h3>
           </div>
           <p className="text-gray-400 text-sm md:text-base font-medium leading-relaxed mb-8">
             Vendra is a commission-free platform. We do not touch your revenue. All transaction processing is handled directly by **Paystack** at their standard merchant rates.
           </p>
           <div className="pt-8 border-t border-white/10">
              <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.3em]">
                Updated: May 2026 &bull; Lagos, NG
              </p>
           </div>
        </section>
      </div>

      <footer className="py-32 text-center opacity-10">
         <div className="h-[1px] w-20 bg-black mx-auto mb-8" />
         <p className="text-[9px] font-black uppercase tracking-[2em]">Vendra</p>
      </footer>
    </div>
  );
}

export default function AgreementPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
        <Loader2 className="animate-spin text-black" size={40} />
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">Loading Terms</p>
      </div>
    }>
      <AgreementContent />
    </Suspense>
  );
}