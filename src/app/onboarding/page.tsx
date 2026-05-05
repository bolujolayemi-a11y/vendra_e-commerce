"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Store, Globe, Smartphone, Loader2, ChevronLeft, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function Onboarding() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false); // New state for legal check
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    whatsapp: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Safety check for legal terms
    if (!acceptedTerms) {
      alert("Please accept the User Agreement and Privacy Policy to continue.");
      return;
    }

    setLoading(true);

    const { data, error: userError } = await supabase.auth.getUser();
    const user = data?.user;

    if (userError || !user) {
      alert("Please login to launch your store.");
      setLoading(false);
      return;
    }

    const { error: dbError } = await supabase
      .from('stores')
      .insert([
        { 
          owner_id: user.id,
          name: formData.name,
          slug: formData.slug.toLowerCase().trim().replace(/\s+/g, '-'),
          whatsapp_number: formData.whatsapp 
        }
      ]);
      
    if (dbError) {
      if (dbError.code === '23505') {
        alert("This Store Handle is already taken.");
      } else {
        alert(dbError.message);
      }
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6 relative">
      {/* BACK BUTTON */}
      <Link 
        href="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-black transition font-black uppercase text-xs tracking-widest"
      >
        <ChevronLeft size={18} /> Exit
      </Link>

      <div className="max-w-xl mx-auto bg-white p-10 rounded-[2.5rem] shadow-xl shadow-black/5 border border-gray-100">
        <div className="mb-10 text-center">
          <div className="bg-black text-white p-3 rounded-2xl inline-block mb-4">
            <Store size={28} />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-black uppercase">Launch Vendra Shop</h1>
          <p className="text-gray-500 mt-2 font-medium">Create your professional storefront in seconds.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Store Name Input */}
          <div>
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
              Store Name
            </label>
            <input 
              required
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Enter Store Name"
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-black outline-none transition font-bold"
            />
          </div>

          {/* Store Handle Input */}
          <div>
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
              Store Handle
            </label>
            <div className="flex">
              <span className="bg-gray-100 border border-r-0 border-gray-200 p-4 text-gray-400 rounded-l-2xl text-xs font-bold flex items-center">vendra.shop/</span>
              <input 
                required
                type="text" 
                value={formData.slug}
                onChange={(e) => setFormData({...formData, slug: e.target.value})}
                placeholder="my-shop"
                className="w-full p-4 border border-gray-200 rounded-r-2xl focus:ring-2 focus:ring-black outline-none transition font-bold"
              />
            </div>
          </div>

          {/* WhatsApp Number Input */}
          <div>
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
              WhatsApp Number
            </label>
            <div className="relative">
              <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input 
                required
                type="tel" 
                value={formData.whatsapp}
                onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                placeholder="234..."
                className="w-full pl-12 p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-black outline-none transition font-bold"
              />
            </div>
          </div>

          {/* LEGAL SECTION */}
          <div className="pt-4 border-t border-gray-50">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input 
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-gray-300 text-black focus:ring-black accent-black cursor-pointer"
              />
              <span className="text-xs text-gray-500 leading-relaxed font-medium group-hover:text-black transition">
                I agree to the <Link href="/agreement" className="text-black font-black hover:underline">User Agreement</Link> and <Link href="/privacy" className="text-black font-black hover:underline">Privacy Policy</Link>. 
                I understand that Vendra facilitates payments via Paystack.
              </span>
            </label>
          </div>

          <button 
            disabled={loading || !acceptedTerms}
            className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-3 shadow-xl ${
              loading || !acceptedTerms 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none' 
              : 'bg-black text-white hover:bg-gray-800 active:scale-95 shadow-black/20'
            }`}
          >
            {loading ? <Loader2 className="animate-spin" /> : "LAUNCH MY SHOP"}
          </button>
        </form>
      </div>
    </div>
  );
}