"use client";
import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  MessageCircle, Loader2, Store, Plus, Minus, 
  X, Send, ArrowRight, ShoppingBag, ChevronRight, 
  Tag, Sparkles, Clock, LayoutGrid, Share2 
} from 'lucide-react';

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

  // Logic for Sections
  const clearanceProducts = products.filter(p => p.is_clearance === true);
  const nonClearanceProducts = products.filter(p => !p.is_clearance);
  const newArrivals = nonClearanceProducts.slice(0, 4);
  const generalProducts = nonClearanceProducts.slice(4);

  // --- SHARE FUNCTION ---
  const handleShare = async () => {
    const shareData = {
      title: store?.name || 'Vendra Store',
      text: `Check out ${store?.name} on Vendra! High-quality fabrics and materials.`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Share failed");
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
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
      <header className="pt-32 pb-20 px-6 text-center border-b border-gray-50 relative">
        {/* SHARE ACTION */}
        <button 
          onClick={handleShare}
          className="absolute top-10 right-6 md:right-12 flex items-center gap-2 bg-gray-50 border border-gray-100 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all active:scale-95 shadow-sm"
        >
          <Share2 size={14} /> {copied ? "Copied!" : "Share Store"}
        </button>

        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-none">
                {store?.name}
            </h1>
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.5em]">
                {store?.description || "High-End Fabrics • Curated Selection"}
            </p>
        </div>
      </header>

      {/* 2. NEW ARRIVALS */}
      {newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="flex items-center gap-4 mb-12">
              <Clock size={20} className="text-blue-500" />
              <h2 className="text-2xl font-black uppercase tracking-tighter">New Arrivals</h2>
              <div className="h-[1px] flex-1 bg-gray-100"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} setBubbleMessage={setBubbleMessage} setIsBubbleOpen={setIsBubbleOpen} />
            ))}
          </div>
        </section>
      )}

      {/* 3. CLEARANCE SECTION */}
      {clearanceProducts.length > 0 && (
        <section className="bg-red-50/30 py-24 px-6 border-y border-red-100">
          <div className="max-w-7xl mx-auto">
              <div className="flex items-center gap-4 mb-12">
                  <Tag size={20} className="text-red-500" />
                  <h2 className="text-2xl font-black uppercase tracking-tighter text-red-500">Clearance Sale</h2>
                  <div className="h-[1px] flex-1 bg-red-100"></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {clearanceProducts.map((product) => (
                      <ProductCard key={product.id} product={product} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} setBubbleMessage={setBubbleMessage} setIsBubbleOpen={setIsBubbleOpen} isSmall />
                  ))}
              </div>
          </div>
        </section>
      )}

      {/* 4. GENERAL STOCK */}
      {generalProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="flex items-center gap-4 mb-12">
              <LayoutGrid size={20} className="text-gray-300" />
              <h2 className="text-2xl font-black uppercase tracking-tighter text-gray-300">General Stock</h2>
              <div className="h-[1px] flex-1 bg-gray-50"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-16">
              {generalProducts.map((product) => (
                  <ProductCard key={product.id} product={product} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} setBubbleMessage={setBubbleMessage} setIsBubbleOpen={setIsBubbleOpen} isSmall />
              ))}
          </div>
        </section>
      )}

      {/* 5. FLOATING CART BAR */}
      {totalItems > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[90] w-[90%] max-w-lg">
          <div className="bg-black text-white p-5 rounded-full shadow-2xl flex items-center justify-between border border-white/10">
            <div className="flex items-center gap-4 pl-4">
              <ShoppingBag size={20} />
              <p className="text-xl font-black tracking-tighter">₦{cartTotal.toLocaleString()}</p>
            </div>
            <button 
              onClick={() => {
                localStorage.setItem('vendra_cart', JSON.stringify(Object.values(cart)));
                localStorage.setItem('vendra_store', JSON.stringify(store));
                router.push('/checkout/multi');
              }}
              className="bg-white text-black h-12 px-8 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-gray-200 transition flex items-center gap-2"
            >
              Checkout <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* WHATSAPP BUBBLE */}
      <div className="fixed bottom-8 right-8 z-[100]">
        {isBubbleOpen && (
          <div className="absolute bottom-20 right-0 w-80 bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-300 origin-bottom-right">
             <div className="bg-black p-8 text-white flex justify-between items-center">
                <h4 className="font-black uppercase text-[10px] tracking-widest">Concierge</h4>
                <button onClick={() => setIsBubbleOpen(false)}><X size={18}/></button>
             </div>
             <div className="p-6 bg-gray-50">
                <textarea 
                    value={bubbleMessage} 
                    onChange={(e) => setBubbleMessage(e.target.value)} 
                    className="w-full p-4 rounded-2xl text-xs font-bold h-24 bg-white outline-none border border-gray-100 resize-none"
                />
                <button 
                    onClick={() => window.open(`https://wa.me/${store.whatsapp_number.replace(/\D/g, '')}?text=${encodeURIComponent(bubbleMessage)}`)} 
                    className="w-full mt-4 py-4 bg-[#25D366] text-white rounded-2xl font-black text-[10px] uppercase shadow-lg shadow-green-500/10"
                >
                    Send Message
                </button>
             </div>
          </div>
        )}
        <button onClick={() => setIsBubbleOpen(!isBubbleOpen)} className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition active:scale-95">
          {isBubbleOpen ? <X size={24} /> : <MessageCircle size={28} />}
        </button>
      </div>

      <footer className="py-20 text-center border-t border-gray-50">
        <p className="text-[10px] font-black uppercase tracking-[1em] text-gray-200">Vendra &bull; Made in Nigeria</p>
      </footer>
    </div>
  );
}

function ProductCard({ product, cart, addToCart, removeFromCart, setBubbleMessage, setIsBubbleOpen, isSmall = false }: any) {
  const quantityInCart = cart[product.id]?.quantity || 0;

  return (
    <div className="group flex flex-col h-full bg-white">
      <div className={`${isSmall ? 'aspect-square' : 'aspect-[4/5]'} bg-gray-50 rounded-[2.5rem] overflow-hidden mb-6 relative border border-gray-50`}>
        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover transition duration-1000 group-hover:scale-110" />
        {product.is_sold_out && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center font-black uppercase text-[10px] tracking-widest text-black">Sold Out</div>
        )}
      </div>
      
      <div className="px-2">
        <h3 className={`${isSmall ? 'text-lg' : 'text-2xl'} font-black uppercase tracking-tighter mb-1 leading-none`}>{product.name}</h3>
        <p className="font-black text-gray-400 mb-6">₦{product.price.toLocaleString()}</p>
        
        {!product.is_sold_out && (
          <div className="mt-auto space-y-3"> 
            {quantityInCart > 0 ? (
              <div className="flex items-center justify-between bg-black text-white p-2 rounded-2xl">
                <button onClick={() => removeFromCart(product.id)} className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-xl transition"><Minus size={16} /></button>
                <span className="font-black">{quantityInCart}</span>
                <button onClick={() => addToCart(product)} className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-xl transition"><Plus size={16} /></button>
              </div>
            ) : (
              <button 
                onClick={() => addToCart(product)}
                className="w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-gray-50 text-black hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2"
              >
                Add to cart <Plus size={14} />
              </button>
            )}
            
            <button 
              onClick={() => {
                setBubbleMessage(`Hi! I'm interested in ${product.name}. Is it available?`);
                setIsBubbleOpen(true);
              }}
              className="w-full py-2 text-[9px] font-black uppercase tracking-widest text-gray-300 hover:text-black transition-colors"
            >
              Inquiry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}