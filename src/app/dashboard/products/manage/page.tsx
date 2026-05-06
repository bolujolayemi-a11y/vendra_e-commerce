"use client";
import { useEffect, useState, useMemo, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Trash2, Loader2, ChevronLeft, Plus, Minus, 
  Star, Tag, Archive, Search, ShoppingBag, Sparkles
} from 'lucide-react';
import Link from 'next/link';

export default function ManageProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: store } = await supabase.from('stores').select('id').eq('owner_id', user.id).single();
      if (store) {
        const { data } = await supabase.from('products')
          .select('*')
          .eq('store_id', store.id)
          .order('created_at', { ascending: false });
        setProducts(data || []);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [products, searchQuery]);

  const totalStockValue = useMemo(() => {
    return products.reduce((acc, p) => acc + (p.price * p.stock_count), 0);
  }, [products]);

  const updateProduct = async (id: string, updates: any, actionId: string) => {
    const loadingKey = id + actionId;
    setActionLoading(loadingKey);

    try {
      const { error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setProducts(prev => 
        prev.map(p => p.id === id ? { ...p, ...updates } : p)
      );

    } catch (err: any) {
      console.error("Update failed:", err.message);
      alert("Sync failed. Check your connection.");
      await fetchProducts(); 
    } finally {
      setActionLoading(null);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Permanently remove this item from your inventory?")) return;
    setActionLoading(id);
    await supabase.from('products').delete().eq('id', id);
    setProducts(prev => prev.filter(p => p.id !== id));
    setActionLoading(null);
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white space-y-4">
      <Loader2 className="animate-spin text-black" size={40} />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Opening Vault</p>
    </div>
  );

  return (
    <>
      {/* 1. MAIN SCROLLING CONTENT */}
      <main className="max-w-6xl mx-auto py-16 px-6 pb-40">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="space-y-2">
              <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-black mb-4 font-black uppercase text-[10px] tracking-widest transition">
                  <ChevronLeft size={14} /> Back to Dashboard
              </Link>
              <h1 className="text-6xl font-black uppercase tracking-tighter text-black leading-none">Inventory</h1>
              <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest leading-relaxed">Master Collection</p>
          </div>
          
          <div className="bg-black text-white p-6 rounded-[2.5rem] flex items-center gap-6 shadow-2xl">
              <div className="bg-white/10 p-3 rounded-2xl"><ShoppingBag size={20}/></div>
              <div>
                  <p className="text-[9px] font-black uppercase opacity-50 tracking-widest">Stock Valuation</p>
                  <p className="text-2xl font-black tracking-tighter">₦{totalStockValue.toLocaleString()}</p>
              </div>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="relative mb-8 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" size={20} />
          <input 
              type="text"
              placeholder="Search items..."
              className="w-full pl-16 pr-8 py-6 bg-gray-50 rounded-[2rem] border border-transparent focus:bg-white focus:border-gray-100 outline-none font-bold text-sm transition-all shadow-inner"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* PRODUCTS LIST */}
        <div className="grid gap-4">
          {filteredProducts.length === 0 ? (
            <div className="bg-gray-50 py-32 rounded-[3.5rem] border-2 border-dashed border-gray-100 text-center space-y-4">
              <Archive size={48} className="mx-auto text-gray-200" />
              <p className="font-black uppercase text-gray-300 tracking-[0.3em]">Vault is Empty</p>
            </div>
          ) : (
            filteredProducts.map((product, index) => {
              const isNewArrival = index < 4 && !product.is_clearance;
              
              return (
                <div key={product.id} className={`group bg-white p-6 rounded-[3rem] border transition-all duration-500 flex flex-col lg:flex-row items-center justify-between gap-8 ${product.is_sold_out ? 'opacity-40 border-gray-50' : 'border-gray-100 hover:shadow-xl hover:border-transparent'}`}>
                  
                  <div className="flex items-center gap-6 w-full lg:w-auto">
                    <div className="w-24 h-24 bg-gray-100 rounded-[2rem] overflow-hidden flex-shrink-0 relative">
                      <img src={product.image_url} alt="" className="w-full h-full object-cover" />
                      {isNewArrival && (
                        <div className="absolute top-1 right-1 bg-blue-500 text-white p-1 rounded-full shadow-lg">
                          <Sparkles size={10} />
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap gap-2 mb-1">
                          {isNewArrival && <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-lg text-[8px] font-black uppercase">New Arrival</span>}
                          {product.is_featured && <span className="bg-amber-50 text-amber-600 px-2 py-0.5 rounded-lg text-[8px] font-black uppercase flex items-center gap-1"><Star size={10} fill="currentColor" /> Featured</span>}
                          {product.is_clearance && <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded-lg text-[8px] font-black uppercase flex items-center gap-1"><Tag size={10} /> Clearance</span>}
                      </div>
                      <h3 className="font-black text-2xl text-black uppercase tracking-tighter leading-none">{product.name}</h3>
                      <p className="text-sm font-black text-gray-400 italic tracking-wide">₦{product.price.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-4 w-full lg:w-auto">
                    <div className="flex items-center bg-gray-50 p-1.5 rounded-[1.8rem] border border-gray-100">
                      <button 
                        onClick={() => updateProduct(product.id, { stock_count: Math.max(0, product.stock_count - 1), is_sold_out: product.stock_count - 1 <= 0 }, 'minus')}
                        className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl shadow-sm hover:bg-black hover:text-white transition-all active:scale-90"
                      >
                        <Minus size={16} />
                      </button>
                      <div className="px-6 text-center min-w-[70px]">
                        <span className="text-[9px] font-black uppercase text-gray-300 block mb-1">In Stock</span>
                        <span className="text-xl font-black leading-none">{product.stock_count}</span>
                      </div>
                      <button 
                        onClick={() => updateProduct(product.id, { stock_count: product.stock_count + 1, is_sold_out: false }, 'plus')}
                        className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl shadow-sm hover:bg-black hover:text-white transition-all active:scale-90"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => updateProduct(product.id, { is_featured: !product.is_featured }, 'featured')}
                        disabled={actionLoading === product.id + 'featured'}
                        className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-all border ${product.is_featured ? 'bg-amber-400 text-white border-transparent shadow-lg shadow-amber-200/20' : 'bg-white text-gray-200 border-gray-100'}`}
                      >
                        {actionLoading === product.id + 'featured' ? <Loader2 size={18} className="animate-spin"/> : <Star size={20} fill={product.is_featured ? "currentColor" : "none"} />}
                      </button>

                      <button 
                        onClick={() => updateProduct(product.id, { is_clearance: !product.is_clearance }, 'clearance')}
                        disabled={actionLoading === product.id + 'clearance'}
                        className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-all border ${product.is_clearance ? 'bg-red-500 text-white border-transparent shadow-lg shadow-red-200/20' : 'bg-white text-gray-200 border-gray-100'}`}
                      >
                        {actionLoading === product.id + 'clearance' ? <Loader2 size={18} className="animate-spin"/> : <Tag size={20} />}
                      </button>

                      <button 
                        onClick={() => updateProduct(product.id, { is_sold_out: !product.is_sold_out }, 'status')}
                        className={`h-14 px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${product.is_sold_out ? 'bg-gray-200 text-gray-400' : 'bg-black text-white'}`}
                      >
                        {product.is_sold_out ? "Restock" : "Active"}
                      </button>
                    </div>

                    <button 
                      onClick={() => deleteProduct(product.id)}
                      className="h-14 w-14 flex items-center justify-center text-gray-200 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* 2. FIXED FLOATING BUTTON - OUTSIDE THE MAIN CONTAINER */}
      <div className="fixed bottom-10 left-0 right-0 flex justify-center z-[999] pointer-events-none">
        <Link 
          href="/dashboard/products" 
          className="pointer-events-auto bg-black/90 backdrop-blur-xl text-white px-10 py-6 rounded-full font-black uppercase text-[10px] tracking-[0.3em] shadow-[0_20px_50px_rgba(0,0,0,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center gap-3 group border border-white/10"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" /> 
          Add New Item
        </Link>
      </div>
    </>
  );
}