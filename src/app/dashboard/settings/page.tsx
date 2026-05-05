"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { 
  Store, 
  Phone, 
  Key, 
  Save, 
  Loader2, 
  ChevronLeft, 
  CheckCircle,
  ExternalLink,
  AlertTriangle,
  Trash2,
  FileText 
} from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    name: '',
    whatsapp_number: '',
    paystack_public_key: '',
    description: ''
  });

  useEffect(() => {
    async function getStoreSettings() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('stores')
          .select('*')
          .eq('owner_id', user.id)
          .single();
        
        if (data) {
          setFormData({
            name: data.name || '',
            whatsapp_number: data.whatsapp_number || '',
            paystack_public_key: data.paystack_public_key || '',
            description: data.description || ''
          });
        }
      }
      setLoading(false);
    }
    getStoreSettings();
  }, []);

  const handleUpdateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase
      .from('stores')
      .update({
        name: formData.name,
        whatsapp_number: formData.whatsapp_number,
        paystack_public_key: formData.paystack_public_key,
        description: formData.description
      })
      .eq('owner_id', user?.id);

    if (error) {
      alert(error.message);
    } else {
      setMessage("Settings updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    }
    setSaving(false);
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "CRITICAL: Are you sure? This will permanently delete your store, all products, and your account. This cannot be undone."
    );

    if (!confirmed) return;

    setDeleting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error: storeError } = await supabase
        .from('stores')
        .delete()
        .eq('owner_id', user.id);

      if (storeError) throw storeError;
      await supabase.auth.signOut();
      router.push('/');
      alert("Account successfully deleted.");
      
    } catch (error: any) {
      alert("Error deleting account: " + error.message);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="animate-spin text-black" size={40} />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 pb-32">
      <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-black mb-8 font-black uppercase text-xs tracking-widest transition">
        <ChevronLeft size={18} /> Dashboard
      </Link>

      <div className="mb-10">
        <h1 className="text-4xl font-black uppercase tracking-tighter text-black">Store Settings</h1>
        <p className="text-gray-500 font-medium">Update your business profile and payment integrations.</p>
      </div>

      <form onSubmit={handleUpdateStore} className="space-y-8">
        {/* Business Info Section */}
        <section className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-50 text-blue-600 p-2 rounded-lg"><Store size={20}/></div>
            <h2 className="text-lg font-black uppercase tracking-tight text-black">Business Profile</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Store Name</label>
              <input 
                type="text"
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-black font-bold text-black"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">WhatsApp Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                <input 
                  type="text"
                  placeholder="234..."
                  className="w-full pl-12 p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-black font-bold text-black"
                  value={formData.whatsapp_number}
                  onChange={(e) => setFormData({...formData, whatsapp_number: e.target.value})}
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Store Description</label>
              <textarea 
                rows={3}
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-black font-medium text-black"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </div>
        </section>

        {/* Payment Integration Section */}
        <section className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                <div className="bg-green-50 text-green-600 p-2 rounded-lg"><Key size={20}/></div>
                <h2 className="text-lg font-black uppercase tracking-tight text-black">Paystack Integration</h2>
            </div>
            <Link 
                href="https://dashboard.paystack.com/#/settings/developer" 
                target="_blank" 
                className="text-[10px] font-black text-blue-500 hover:underline flex items-center gap-1"
            >
                Get your key <ExternalLink size={10} />
            </Link>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Public Key</label>
            <input 
              type="password"
              placeholder="pk_test_xxxxxxxxxxxx"
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-black font-mono text-sm text-black"
              value={formData.paystack_public_key}
              onChange={(e) => setFormData({...formData, paystack_public_key: e.target.value})}
            />
          </div>
        </section>

        {/* Save Button */}
        <div className="flex items-center justify-between">
            {message && (
                <div className="flex items-center gap-2 text-green-600 font-bold text-sm">
                    <CheckCircle size={18} /> {message}
                </div>
            )}
            <button 
                disabled={saving}
                type="submit"
                className="ml-auto bg-black text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-gray-800 transition active:scale-95 flex items-center gap-3 shadow-xl shadow-black/20"
            >
                {saving ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Save Settings</>}
            </button>
        </div>
      </form>

      {/* LEGAL DOCUMENTS SECTION */}
      <section className="mt-16 bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gray-50 text-gray-500 p-2 rounded-lg"><FileText size={20}/></div>
          <h2 className="text-lg font-black uppercase tracking-tight text-black">Legal & Transparency</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/about?from=dashboard" className="p-4 rounded-xl border border-gray-50 hover:border-black transition flex items-center justify-between group">
            <span className="text-xs font-black uppercase tracking-widest text-gray-400 group-hover:text-black">About Vendra</span>
            <ExternalLink size={14} className="text-gray-300 group-hover:text-black" />
          </Link>

          <Link href="/agreement?from=dashboard" className="p-4 rounded-xl border border-gray-50 hover:border-black transition flex items-center justify-between group">
            <span className="text-xs font-black uppercase tracking-widest text-gray-400 group-hover:text-black">User Agreement</span>
            <ExternalLink size={14} className="text-gray-300 group-hover:text-black" />
          </Link>

          <Link href="/privacy?from=dashboard" className="p-4 rounded-xl border border-gray-50 hover:border-black transition flex items-center justify-between group">
            <span className="text-xs font-black uppercase tracking-widest text-gray-400 group-hover:text-black">Privacy Policy</span>
            <ExternalLink size={14} className="text-gray-300 group-hover:text-black" />
          </Link>
        </div>
      </section>

      {/* DANGER ZONE SECTION */}
      <hr className="my-16 border-gray-100" />

      <section className="bg-red-50/30 p-8 rounded-[2rem] border border-red-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-red-100 text-red-600 p-2 rounded-lg"><AlertTriangle size={20}/></div>
          <h2 className="text-lg font-black uppercase tracking-tight text-red-600">Danger Zone</h2>
        </div>
        <p className="text-sm text-red-500 font-medium mb-6">
          Once you delete your account, there is no going back.
        </p>
        <button 
          onClick={handleDeleteAccount}
          disabled={deleting}
          className="bg-white text-red-600 border border-red-200 px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-red-600 hover:text-white transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
        >
          {deleting ? <Loader2 className="animate-spin" size={16} /> : <><Trash2 size={16} /> Delete My Account Permanently</>}
        </button>
      </section>
    </div>
  );
}