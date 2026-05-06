"use client";
import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  MessageCircle, Loader2, Store, Plus, Minus, 
  X, Send, ArrowRight, ShoppingBag, ChevronRight, 
  Tag, Sparkles, Clock, LayoutGrid, Share2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PublicStore() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  
  const [store, setStore] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<{ [key: string]: any }>({});
  const [isBubbleOpen, setIsBubbleOpen] = useState(false);
  const [bubbleMessage, setBubbleMessage] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchStorefront() {
      if (!slug) return;
      const { data: storeData } = await supabase.from('stores').select('*').eq('slug', slug).single();
      if (storeData) {
        setStore(storeData);
        const { data: productsData } = await supabase
          .from('products')
          .select('*')
          .eq('store_id', storeData.id)
          .order('created_at', { ascending: false });
        setProducts(productsData || []);
      }
      setLoading(false);
    }
    fetchStorefront();
  }, [slug]);

  // --- SECTION LOGIC ---
  const featuredProducts = products.filter(p => p.is_featured === true);
  const clearanceProducts = products.filter(p => p.is_clearance === true);
  const remainingProducts = products.filter(p => !p.is_featured && !p.is_clearance);
  const newArrivals = remainingProducts.slice(0, 4);
  const generalProducts = remainingProducts.slice(4);

  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: store?.name, url: shareUrl }); } 
      catch (err) { console.log("Cancelled"); }
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const addToCart = (product: any) => {
    setCart(prev => {
      const currentQty = prev[product.id]?.quantity || 0;
      if (currentQty >= product.stock_count) return prev;
      return { ...prev, [product.id]: { ...product, quantity: currentQty + 1 } };
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[productId].quantity > 1) newCart[productId].quantity -= 1;
      else delete newCart[productId];
      return newCart;
    });
  };

  const { cartTotal, totalItems } = useMemo(() => {
    const items = Object.values(cart);
    return {
      cartTotal: items.reduce((acc, item) => acc + (item.price * item.quantity), 0),
      totalItems: items.reduce((acc, item) => acc + item.quantity, 0)
    };
  }, [cart]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-black" size={32} /></div>;

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white pb-40">
      
      {/* 1. HERO SECTION */}
      <header className="pt-24 pb-20 px-6 text-center border-b border-gray-50 relative">
        <button 
          onClick={handleShare}
          className="absolute top-10 right-6 md:right-12 flex items-center gap-2 bg-gray-50 border border-gray-100 px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all active:scale-95 shadow-sm"
        >
          <Share2 size={14} /> {copied ? "Link Copied!" : "Share Store"}
        </button>

        <div className="max-w-4xl mx-auto flex flex-col items-center">
            {store?.logo_url && (
              <div className="w-24 h-24 md:w-32 md:h-32 mb-8">
                <img src={store.logo_url} alt="Logo" className="w-full h-full object-contain rounded-full shadow-sm" />
              </div>
            )}
            <div className="space-y-4">
                <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-none">{store?.name}</h1>
                <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.5em]">{store?.description || "Curated Selection • Vendra Boutique"}</p>
            </div>
        </div>
      </header>

      {/* SECTIONS */}
      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-24 bg-amber-50/20 rounded-[3rem] my-10 border border-amber-50">
          <div className="flex items-center gap-4 mb-12">
              <Sparkles size={20} className="text-amber-500" />
              <h2 className="text-2xl font-black uppercase tracking-tighter">Editor's Choice</h2>
              <div className="h-[1px] flex-1 bg-amber-100"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {featuredProducts.map((p) => <ProductCard key={p.id} product={p} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} setBubbleMessage={setBubbleMessage} setIsBubbleOpen={setIsBubbleOpen} />)}
          </div>
        </section>
      )}

      {newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="flex items-center gap-4 mb-12"><Clock size={20} className="text-blue-500" /><h2 className="text-2xl font-black uppercase tracking-tighter">New Arrivals</h2><div className="h-[1px] flex-1 bg-gray-100"></div></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {newArrivals.map((p) => <ProductCard key={p.id} product={p} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} setBubbleMessage={setBubbleMessage} setIsBubbleOpen={setIsBubbleOpen} />)}
          </div>
        </section>
      )}

      {clearanceProducts.length > 0 && (
        <section className="bg-red-50/30 py-24 px-6 border-y border-red-100">
          <div className="max-w-7xl mx-auto">
              <div className="flex items-center gap-4 mb-12"><Tag size={20} className="text-red-500" /><h2 className="text-2xl font-black uppercase tracking-tighter text-red-500">Clearance Sale</h2><div className="h-[1px] flex-1 bg-red-100"></div></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {clearanceProducts.map((p) => <ProductCard key={p.id} product={p} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} setBubbleMessage={setBubbleMessage} setIsBubbleOpen={setIsBubbleOpen} isSmall />)}
              </div>
          </div>
        </section>
      )}

      {generalProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="flex items-center gap-4 mb-12"><LayoutGrid size={20} className="text-gray-300" /><h2 className="text-2xl font-black uppercase tracking-tighter text-gray-300">General Stock</h2><div className="h-[1px] flex-1 bg-gray-50"></div></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-16">
              {generalProducts.map((p) => <ProductCard key={p.id} product={p} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} setBubbleMessage={setBubbleMessage} setIsBubbleOpen={setIsBubbleOpen} isSmall />)}
          </div>
        </section>
      )}

      {/* FLOATING CART */}
      {totalItems > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[90] w-[90%] max-w-lg">
          <div className="bg-black text-white p-5 rounded-full shadow-2xl flex items-center justify-between border border-white/10">
            <div className="flex items-center gap-4 pl-4"><ShoppingBag size={20} /><p className="text-xl font-black tracking-tighter">₦{cartTotal.toLocaleString()}</p></div>
            <button onClick={() => { localStorage.setItem('vendra_cart', JSON.stringify(Object.values(cart))); localStorage.setItem('vendra_store', JSON.stringify(store)); router.push('/checkout/multi'); }} className="bg-white text-black h-12 px-8 rounded-full font-bold uppercase text-[10px] tracking-widest flex items-center gap-2">Checkout <ChevronRight size={14} /></button>
          </div>
        </div>
      )}

      {/* WHATSAPP CONCIERGE */}
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4">
        <AnimatePresence>
          {isBubbleOpen && (
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} className="w-[340px] bg-white rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden origin-bottom-right mb-4">
              <div className="bg-[#075E54] p-6 text-white">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-full bg-white/10 p-0.5 relative">
                      {store?.logo_url ? <img src={store.logo_url} className="w-full h-full object-cover rounded-full" alt="Logo" /> : <div className="w-full h-full rounded-full bg-white/20 flex items-center justify-center font-black">{store?.name?.charAt(0)}</div>}
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#25D366] border-2 border-[#075E54] rounded-full"></span>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm tracking-tight">{store?.name}</h4>
                      <p className="text-[10px] opacity-80 font-bold uppercase tracking-widest">Typically replies within 10 mins</p>
                    </div>
                  </div>
                  <button onClick={() => setIsBubbleOpen(false)}><X size={20} /></button>
                </div>
              </div>
              <div className="p-6 bg-[#E5DDD5] relative">
                 <div className="relative bg-white p-4 rounded-2xl rounded-tl-none shadow-sm mb-6 max-w-[85%]">
                    <p className="text-xs font-medium text-gray-800 leading-relaxed">Hi, welcome to {store?.name}.<br/>How can we help you today? 😊</p>
                    <span className="text-[9px] text-gray-400 font-bold block text-right mt-1">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                 </div>
                 <div className="bg-white rounded-2xl p-2 shadow-inner border border-gray-100">
                    <textarea value={bubbleMessage} onChange={(e) => setBubbleMessage(e.target.value)} placeholder="Type a message..." className="w-full p-3 text-xs font-bold bg-transparent outline-none resize-none h-20" />
                    <button onClick={() => window.open(`https://wa.me/${store?.whatsapp_number?.replace(/\D/g, '')}?text=${encodeURIComponent(bubbleMessage)}`)} className="w-full py-4 bg-[#25D366] text-white rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#128C7E] transition-all"><Send size={14} /> Send to WhatsApp</button>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <button onClick={() => setIsBubbleOpen(!isBubbleOpen)} className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-95 ${isBubbleOpen ? 'bg-white text-black' : 'bg-[#25D366] text-white'}`}>{isBubbleOpen ? <X size={28} /> : <MessageCircle size={32} />}</button>
      </div>

      <footer className="py-20 text-center border-t border-gray-50"><p className="text-[10px] font-bold uppercase tracking-[1em] text-gray-200">Vendra &bull; 2026</p></footer>
    </div>
  );
}

function ProductCard({ product, cart, addToCart, removeFromCart, setBubbleMessage, setIsBubbleOpen, isSmall = false }: any) {
  const quantityInCart = cart[product.id]?.quantity || 0;
  return (
    <div className="group flex flex-col h-full bg-white">
      <div className={`${isSmall ? 'aspect-square' : 'aspect-[4/5]'} bg-gray-50 rounded-[2.5rem] overflow-hidden mb-6 relative border border-gray-50`}>
        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover transition duration-1000 group-hover:scale-110" />
        {product.is_sold_out && <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center font-bold uppercase text-[10px] tracking-widest text-black">Sold Out</div>}
      </div>
      <div className="px-2">
        <h3 className={`${isSmall ? 'text-lg' : 'text-2xl'} font-bold uppercase tracking-tighter mb-1 leading-none`}>{product.name}</h3>
        <p className="font-bold text-gray-400 mb-6">₦{product.price.toLocaleString()}</p>
        {!product.is_sold_out && (
          <div className="mt-auto space-y-3"> 
            {quantityInCart > 0 ? (
              <div className="flex items-center justify-between bg-black text-white p-2 rounded-2xl">
                <button onClick={() => removeFromCart(product.id)} className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-xl transition"><Minus size={16} /></button>
                <span className="font-bold">{quantityInCart}</span>
                <button onClick={() => addToCart(product)} className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-xl transition"><Plus size={16} /></button>
              </div>
            ) : (
              <button onClick={() => addToCart(product)} className="w-full py-5 rounded-2xl font-bold text-[10px] uppercase tracking-widest bg-gray-50 text-black hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2">Add to cart <Plus size={14} /></button>
            )}
            <button onClick={() => { setBubbleMessage(`Hi! I'm interested in ${product.name}. Is it available?`); setIsBubbleOpen(true); }} className="w-full py-2 text-[9px] font-bold uppercase tracking-widest text-gray-300 hover:text-black transition-colors">Inquiry</button>
          </div>
        )}
      </div>
    </div>
  );
}