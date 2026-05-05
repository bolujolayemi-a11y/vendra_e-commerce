"use client";
import { ShieldCheck, Lock, EyeOff, Share2 } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <>
      <h1 className="text-4xl font-black uppercase tracking-tighter mb-10 text-black">Privacy Policy</h1>
      
      <div className="space-y-12 pb-10">
        {/* Section 1: Data Collection */}
        <section>
          <h3 className="text-sm font-black uppercase tracking-widest text-black mb-4 flex items-center gap-2">
             1. Data Collection
          </h3>
          <p className="text-gray-500 text-sm font-medium leading-relaxed">
            We collect information that you provide directly to us. This includes your name, email address, store name, store description, and WhatsApp number. When you use Vendra, we also collect technical data such as your IP address and browser type to ensure the security of our platform.
          </p>
        </section>

        {/* Section 2: Payment Data */}
        <section className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
          <h3 className="text-sm font-black uppercase tracking-widest text-black mb-4 flex items-center gap-2">
            <ShieldCheck size={18} className="text-green-600" /> 2. Payment Processing
          </h3>
          <p className="text-gray-600 text-sm font-medium leading-relaxed">
            Vendra integrates with <strong>Paystack</strong> to process payments. We do not store or process your customers' debit/credit card details on our servers. All financial data is handled securely by Paystack in accordance with their own privacy standards and PCI-DSS compliance.
          </p>
        </section>

        {/* Section 3: Third-Party Services */}
        <section>
          <h3 className="text-sm font-black uppercase tracking-widest text-black mb-4 flex items-center gap-2">
            <Share2 size={18} /> 3. Third-Party Sharing
          </h3>
          <p className="text-gray-500 text-sm font-medium leading-relaxed">
            We do not sell your personal data. We only share information with third parties necessary to provide our services:
          </p>
          <ul className="mt-4 space-y-2 text-gray-500 text-sm font-medium list-disc ml-5">
            <li><strong>WhatsApp:</strong> To facilitate direct communication between you and your customers.</li>
            <li><strong>Supabase:</strong> For secure database hosting and user authentication.</li>
            <li><strong>Vercel:</strong> For hosting and delivery of the Vendra platform.</li>
          </ul>
        </section>

        {/* Section 4: Cookies */}
        <section>
          <h3 className="text-sm font-black uppercase tracking-widest text-black mb-4 flex items-center gap-2">
            <EyeOff size={18} /> 4. Cookies & Tracking
          </h3>
          <p className="text-gray-500 text-sm font-medium leading-relaxed">
            We use essential cookies to keep you logged in and to remember your store settings. We do not use tracking cookies for third-party advertising. You can disable cookies in your browser settings, but some parts of Vendra may stop functioning correctly.
          </p>
        </section>

        {/* Section 5: Data Retention */}
        <section>
          <h3 className="text-sm font-black uppercase tracking-widest text-black mb-4">5. Data Retention</h3>
          <p className="text-gray-500 text-sm font-medium leading-relaxed">
            We retain your store information for as long as your account is active. If you choose to delete your account via the Settings dashboard, all your store data and product listings will be permanently removed from our active databases.
          </p>
        </section>

        {/* Security Highlight */}
        <section className="bg-black text-white p-8 rounded-[2rem] flex items-start gap-4 shadow-xl shadow-black/10">
          <Lock className="shrink-0 text-white mt-1" size={24} />
          <div>
            <h3 className="font-black uppercase tracking-tight mb-2">Your Security is our Priority</h3>
            <p className="text-gray-400 text-sm font-medium leading-relaxed">
              Vendra uses end-to-end SSL encryption and Supabase Row Level Security (RLS) to ensure that only you can access and modify your store's private information.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}