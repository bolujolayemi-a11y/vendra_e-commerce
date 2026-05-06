"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Settings, Plus, ExternalLink, 
  Loader2, ClipboardList, CreditCard, CheckCircle2,
  LogOut, Hash, FileText
} from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const [store, setStore] = useState<any>(null);
  const [productCount, setProductCount] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function getDashboardData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: storeData } = await supabase.from('stores').select('*').eq('owner_id', user.id).single();
        setStore(storeData);

        if (storeData) {
          const { count } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('store_id', storeData.id);
          setProductCount(count || 0);

          const { data: ordersData } = await supabase
            .from('orders')
            .select('total_price')
            .eq('store_id', storeData.id);
          
          const total = ordersData?.reduce((acc, curr) => acc + curr.total_price, 0);
          setTotalSales(total || 0);
        }
      }
      setLoading(false);
    }
    getDashboardData();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert(error.message);
    } else {
      router.push('/login');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="animate-spin text-black" size={40} />
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 p-6 flex flex-col justify-between font-medium text-gray-500">
        <div className="flex flex-col gap-8">
          <h2 className="text-xl font-black uppercase tracking-tighter text-black">Vendra</h2>
          <nav className="flex flex-col gap-2">
            <Link href="/dashboard" className="flex items-center gap-3 p-3 bg-black text-white rounded-xl font-bold shadow-lg shadow-black/10">
              <LayoutDashboard size={20} /> Overview
            </Link>
            
            {/* UPDATED PATH: /dashboard/product/add */}
            <Link href="/dashboard/product/add" className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition">
              <Plus size={20} /> Add Product
            </Link>
            
            {/* UPDATED PATH: /dashboard/product/manage */}
            <Link href="/dashboard/product/manage" className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition">
              <ClipboardList size={20} /> Manage Stock
            </Link>
            
            <Link href="/dashboard/orders" className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition">
              <Hash size={20} /> Order History
            </Link>
            
            <Link href="/dashboard/settings" className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition">
              <Settings size={20} /> Settings
            </Link>
          </nav>
        </div>

        <button onClick={handleLogout} className="flex items-center gap-3 p-3 text-red-500 hover:bg-red-50 rounded-lg transition font-bold mt-auto">
          <LogOut size={20} /> Logout
        </button>
      </aside>

      <main className="flex-1 p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-black uppercase tracking-tight leading-none mb-2">{store?.name || "My Shop"}</h1>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest leading-relaxed">Control Center &bull; Live at {store?.slug}.vendra.ng</p>
          </div>
          <div className="flex gap-4">
            <Link href={`/s/${store?.slug}`} target="_blank" className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-gray-50 transition shadow-sm">
              <ExternalLink size={14} /> View Store
            </Link>
          </div>
        </header>

        {/* Status Alert for Paystack */}
        {!store?.paystack_public_key && (
          <div className="bg-orange-50 border border-orange-100 p-8 rounded-[2.5rem] mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="bg-orange-500 p-4 rounded-[1.5rem] text-white shadow-xl shadow-orange-500/20"><CreditCard size={24} /></div>
              <div>
                <p className="text-orange-900 font-black uppercase text-xs tracking-[0.1em] mb-1">Payments Restricted</p>
                <p className="text-orange-800/70 text-sm font-medium">Your customers cannot checkout yet. Connect your Paystack Public Key to enable sales.</p>
              </div>
            </div>
            <Link href="/dashboard/settings" className="w-full md:w-auto text-center text-orange-900 text-[10px] font-black uppercase tracking-[0.2em] bg-white px-8 py-4 rounded-xl border border-orange-200 hover:bg-orange-100 transition shadow-sm">Connect Now</Link>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Gross Revenue</p>
            <h3 className="text-4xl font-black tracking-tighter">₦{totalSales.toLocaleString()}</h3>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Total Inventory</p>
            <h3 className="text-4xl font-black tracking-tighter">{productCount} <span className="text-sm text-gray-300 font-bold ml-1">SKUs</span></h3>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Visibility</p>
            <div className="flex items-center gap-3">
                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.6)]"></span>
                <h3 className="text-2xl font-black uppercase tracking-tight">Active</h3>
            </div>
          </div>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/dashboard/product/add" className="group bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm hover:border-black transition-all hover:shadow-2xl">
                <Plus className="text-blue-600 mb-8" size={32} />
                <h3 className="text-xl font-black uppercase tracking-tight mb-2">Add Item</h3>
                <p className="text-gray-400 text-sm font-medium leading-relaxed">List a new material or accessory to your collection.</p>
            </Link>

            <Link href="/dashboard/product/manage" className="group bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm hover:border-black transition-all hover:shadow-2xl">
                <ClipboardList className="text-black mb-8" size={32} />
                <h3 className="text-xl font-black uppercase tracking-tight mb-2">Inventory</h3>
                <p className="text-gray-400 text-sm font-medium leading-relaxed">Adjust stock levels, set clearance prices, or feature items.</p>
            </Link>

            <Link href="/dashboard/settings" className="group bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm hover:border-black transition-all hover:shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                    <CreditCard className={`${store?.paystack_public_key ? 'text-green-600' : 'text-gray-300'}`} size={32} />
                    {store?.paystack_public_key && <CheckCircle2 size={24} className="text-green-600" />}
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight mb-2">Banking</h3>
                <p className="text-gray-400 text-sm font-medium leading-relaxed">
                    {store?.paystack_public_key ? 'Payment gateway is active and secure.' : 'Link your Paystack keys to enable checkout.'}
                </p>
            </Link>
        </div>
      </main>
    </div>
  );
}