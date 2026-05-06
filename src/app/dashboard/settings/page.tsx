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
  FileText,
  Upload,
  Image as ImageIcon 
} from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");
  
  // Logo States
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    whatsapp_number: '',
    paystack_public_key: '',
    description: '',
    logo_url: ''
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
            description: data.description || '',
            logo_url: data.logo_url || ''
          });
          if (data.logo_url) setLogoPreview(data.logo_url);
        }
      }
      setLoading(false);
    }
    getStoreSettings();
  }, []);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) return alert("Logo must be under 2MB");
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let finalLogoUrl = formData.logo_url;

      // 1. Upload Logo if a new file is chosen
      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop();
        // Path matches our Policy: bucket/user_id/filename
        const filePath = `${user.id}/logo-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('logo')
          .upload(filePath, logoFile, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from('logo').getPublicUrl(filePath);
        finalLogoUrl = urlData.publicUrl;
      }

      // 2. Update Database
      const { error } = await supabase
        .from('stores')
        .update({
          name: formData.name,
          whatsapp_number: formData.whatsapp_number,
          paystack_public_key: formData.paystack_public_key,
          description: formData.description,
          logo_url: finalLogoUrl
        })
        .eq('owner_id', user.id);

      if (error) throw error;

      setMessage("Settings updated successfully!");
      setFormData(prev => ({ ...prev, logo_url: finalLogoUrl }));
      setTimeout(() => setMessage(""), 3000);
    } catch (error: any) {
      alert("Error saving: " + error.message);
    } finally {
      setSaving(false);
    }
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
        <p className="text-gray-500 font-medium">Refine your brand identity and integrations.</p>
      </div>

      <form onSubmit={handleUpdateStore} className="space-y-8">
        
        {/* BRAND LOGO SECTION */}
        <section className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-amber-50 text-amber-600 p-2 rounded-lg"><ImageIcon size={20}/></div>
            <h2 className="text-lg font-black uppercase tracking-tight text-black">Brand Identity</h2>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden shadow-inner">
                {logoPreview ? (
                  <img src={logoPreview} className="w-full h-full object-cover" alt="Logo preview" />
                ) : (
                  <Store className="text-gray-300" size={40} />
                )}
              </div>
              <label className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white text-[10px] font-black uppercase tracking-widest text-center px-4">
                <div className="flex flex-col items-center">
                  <Upload size={20} className="mb-2" />
                  <span>Update Logo</span>
                </div>
                <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
              </label>
            </div>
            <div className="text-center md:text-left space-y-2">
              <p className="font-black uppercase text-xs tracking-widest text-black">Store Logo</p>
              <p className="text-gray-400 text-[10px] font-bold uppercase leading-relaxed max-w-[240px]">
                Square images (500x500px) work best. JPEG, PNG or JPG supported.
              </p>
            </div>
          </div>
        </section>

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
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-black font-medium text-black resize-none"
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
          Once you delete your account, there is no going back. All store data will be erased.
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