import { Scale, AlertCircle } from 'lucide-react';

export default function AgreementPage() {
  return (
    <>
      <h1 className="text-4xl font-black uppercase tracking-tighter mb-10 text-black">User Agreement</h1>
      
      <div className="space-y-10">
        <section className="border-l-4 border-black pl-6">
          <h3 className="text-sm font-black uppercase tracking-widest text-black mb-4">Core Terms</h3>
          <p className="text-gray-500 text-sm font-medium leading-relaxed">
            By using Vendra, you agree to sell only legal goods and services. You are responsible for fulfilling orders received via WhatsApp and managing your Paystack integration correctly.
          </p>
        </section>

        <section>
          <h3 className="text-sm font-black uppercase tracking-widest text-black mb-4 flex items-center gap-2">
            <AlertCircle size={16} /> Prohibited Use
          </h3>
          <p className="text-gray-500 text-sm font-medium leading-relaxed">
            You may not use Vendra to sell counterfeit items, illegal substances, or fraudulent services. Vendra reserves the right to suspend stores that violate these terms.
          </p>
        </section>

        <section className="bg-blue-50 p-6 rounded-2xl">
           <p className="text-blue-700 text-[10px] font-black uppercase tracking-widest">
             Effective: May 2026 &bull; Lagos, Nigeria
           </p>
        </section>
      </div>
    </>
  );
}