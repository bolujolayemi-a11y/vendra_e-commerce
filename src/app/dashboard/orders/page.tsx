"use client";
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Package, 
  Loader2, 
  ChevronLeft, 
  User, 
  Hash, 
  TrendingUp,
  CreditCard,
  Search
} from 'lucide-react';
import Link from 'next/link';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Get Session instead of just User (More reliable in Next.js)
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.error("No active session found");
        setLoading(false);
        return;
      }

      // 2. Get the store first
      const { data: storeData, error: storeError } = await supabase
        .from('stores')
        .select('id')
        .eq('owner_id', session.user.id)
        .single();
      
      if (storeError || !storeData) throw storeError;

      // 3. Fetch orders for this store
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('store_id', storeData.id)
        .order('created_at', { ascending: false });
      
      if (ordersError) throw ordersError;
      setOrders(ordersData || []);

    } catch (err: any) {
      console.error("Fetch error:", err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Filter orders based on search (ID or Email)
  const filteredOrders = orders.filter(o => 
    o.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customer_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = orders.reduce((acc, order) => acc + order.total_price, 0);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
      <Loader2 className="animate-spin text-black" size={40} />
      <p className="font-black uppercase text-[10px] tracking-[0.3em] text-gray-400">Loading Records</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12">
        <div className="flex-1">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-black mb-6 font-black uppercase text-[10px] tracking-widest transition group">
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition" /> Dashboard
          </Link>
          <h1 className="text-5xl font-black uppercase tracking-tighter text-black leading-none mb-2">Orders</h1>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Sales & Fulfillment History</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          {/* Revenue Summary Card */}
          <div className="bg-black text-white px-8 py-6 rounded-[2.5rem] flex items-center gap-6 shadow-2xl shadow-black/20">
            <div className="bg-green-500/20 p-3 rounded-2xl">
              <TrendingUp size={24} className="text-green-400" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">Gross Sales</p>
              <p className="text-3xl font-black leading-none">₦{totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-10 group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition" size={20} />
        <input 
          type="text"
          placeholder="Search by Order ID or Customer Email..."
          className="w-full pl-16 pr-8 py-6 bg-white border border-gray-100 rounded-[2rem] text-sm font-bold shadow-sm focus:ring-4 focus:ring-black/5 outline-none transition"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* List Section */}
      <div className="space-y-6">
        {filteredOrders.length === 0 ? (
          <div className="bg-gray-50/50 p-24 rounded-[4rem] text-center border-2 border-dashed border-gray-100">
            <Package className="mx-auto text-gray-200 mb-6" size={64} />
            <p className="font-black uppercase text-gray-400 tracking-[0.2em] text-sm">No match found</p>
            <p className="text-gray-400 text-xs mt-2 font-medium">Try searching for a different ID or email.</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-white p-8 rounded-[3rem] border border-gray-50 shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all duration-500 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="bg-black text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                    <Hash size={12} /> {order.order_id}
                  </span>
                  <span className="text-gray-300 text-[10px] font-black uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                    {new Date(order.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                
                <h3 className="text-2xl font-black uppercase tracking-tight text-black">{order.product_name}</h3>
                
                <div className="flex flex-wrap items-center gap-6 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                  <span className="flex items-center gap-2"><User size={14} className="text-blue-500" /> {order.customer_email}</span>
                  <span className="flex items-center gap-2"><CreditCard size={14} className="text-purple-500" /> {order.paystack_ref}</span>
                </div>
              </div>

              <div className="text-right w-full md:w-auto border-t md:border-0 pt-6 md:pt-0 border-gray-50">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Transaction Total</p>
                <p className="text-4xl font-black text-black mb-1">₦{order.total_price.toLocaleString()}</p>
                <div className="flex justify-end gap-2">
                  <span className="bg-green-50 text-green-600 px-3 py-1 rounded-lg text-[9px] font-black uppercase">Qty: {order.quantity}</span>
                  <span className="bg-gray-50 text-gray-400 px-3 py-1 rounded-lg text-[9px] font-black uppercase">Paid</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}