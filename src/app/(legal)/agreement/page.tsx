"use client";
import { Suspense } from 'react'; // Required to fix the Vercel build error
import { Scale, AlertCircle, Loader2 } from 'lucide-react';

function AgreementContent() {
  return (
    <div className="max-w-3xl mx-auto py-24 px-8 min-h-screen">
      <header className="mb-16">
        <div className="bg-black text-white p-4 rounded-2xl inline-block mb-6 shadow-xl">
          <Scale size={28} />
        </div>
        <h1 className="text-5xl font-black uppercase tracking-tighter text-black leading-none">
          User Agreement
        </h1>
        <p className="mt-4 text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em]">
          Vendra Platform Terms & Conditions
        </p>
      </header>
      
      <div className="space-y-12">
        <section className="border-l-4 border-black pl-8 py-2">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-black mb-4">Core Terms</h3>
          <p className="text-gray-500 text-sm font-medium leading-relaxed">
            By using Vendra, you agree to sell only legal goods and services. You are responsible for fulfilling orders received via WhatsApp and managing your Paystack integration correctly.
          </p>
        </section>

        <section className="pl-9">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-black mb-4 flex items-center gap-2">
            <AlertCircle size={16} className="text-red-500" /> Prohibited Use
          </h3>
          <p className="text-gray-500 text-sm font-medium leading-relaxed">
            You may not use Vendra to sell counterfeit items, illegal substances, or fraudulent services. Vendra reserves the right to suspend stores that violate these terms immediately.
          </p>
        </section>

        <section className="bg-gray-50 p-10 rounded-[3rem] border border-gray-100">
           <h3 className="text-xs font-black uppercase tracking-[0.2em] text-black mb-4">Fees & Payments</h3>
           <p className="text-gray-500 text-sm font-medium leading-relaxed mb-6">
             Vendra does not take a commission on your sales. All transaction fees are handled directly by Paystack according to their Nigerian merchant pricing.
           </p>
           <p className="text-black/30 text-[9px] font-black uppercase tracking-[0.2em]">
             Effective: May 2026 &bull; Lagos, Nigeria
           </p>
        </section>
      </div>

      <footer className="py-24 text-center opacity-20">
         <p className="text-[9px] font-black uppercase tracking-[1em]">Vendra Legal</p>
      </footer>
    </div>
  );
}

// Default export with Suspense to handle the CSR bailout error
export default function AgreementPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-gray-200" size={32} />
      </div>
    }>
      <AgreementContent />
    </Suspense>
  );
}