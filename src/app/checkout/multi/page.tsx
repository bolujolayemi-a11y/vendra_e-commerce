"use client";
import { useEffect, useState, useMemo } from 'react'; // Added useMemo
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  Loader2, ShoppingBag, ShieldCheck, ArrowLeft,
  CheckCircle2, Mail, MessageCircle, Lock, 
  ChevronRight
} from 'lucide-react';
import dynamic from 'next/dynamic';

const PaystackButton = dynamic(
  () => import('react-paystack').then((mod) => mod.PaystackButton),
  { ssr: false }
);

export default function MultiCheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [store, setStore] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const isEmailValid = email.includes('@') && email.includes('.') && email.length > 5;

  useEffect(() => {
    const savedCart = localStorage.getItem('vendra_cart');
    const savedStore = localStorage.getItem('vendra_store');
    
    if (savedCart && savedStore) {
      setCartItems(JSON.parse(savedCart));
      setStore(JSON.parse(savedStore));
    } else {
      router.push('/');
    }
    setLoading(false);
  }, [router]);

  // Memoize total to prevent unnecessary recalculations
  const totalAmount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }, [cartItems]);

  const handlePaymentSuccess = async (reference: any) => {
    setIsProcessing(true);
    try {
      const generatedGroupId = `GRP-${Math.floor(100000 + Math.random() * 900000)}`;

      const orderEntries = cartItems.map(item => ({
        order_id: generatedGroupId,
        store_id: store.id,
        product_name: item.name,
        quantity: item.quantity,
        total_price: item.price * item.quantity,
        customer_email: email,
        paystack_ref: reference.reference,
        status: 'paid'
      }));

      const { error: orderError } = await supabase.from('orders').insert(orderEntries);
      if (orderError) throw orderError;

      // Automatic Inventory Reduction
      await Promise.all(cartItems.map(async (item) => {
        const { data: currentProd } = await supabase
          .from('products')
          .select('stock_count')
          .eq('id', item.id)
          .single();

        if (currentProd) {
          const newStock = Math.max(0, currentProd.stock_count - item.quantity);
          await supabase
            .from('products')
            .update({ 
              stock_count: newStock,
              is_sold_out: newStock <= 0 
            })
            .eq('id', item.id);
        }
      }));

      localStorage.removeItem('vendra_cart');
      setPaymentSuccess(true);
    } catch (err: any) {
      alert("Inventory sync failed: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWhatsAppOrder = () => {
    if (!isEmailValid) return alert("Please enter email first.");
    const itemsList = cartItems.map(item => `• ${item.name} (x${item.quantity})`).join('\n');
    const message = `NEW ORDER 🛍️\n\nCustomer: ${email}\n\nItems:\n${itemsList}\n\nTotal: ₦${totalAmount.toLocaleString()}`;
    const cleanNumber = store.whatsapp_number.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (loading || isProcessing) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="animate-spin text-black mb-4" size={40} />
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
        {isProcessing ? "Finalizing Payment..." : "Loading Order..."}
      </p>
    </div>
  );
  
  if (paymentSuccess) return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 text-center">
        <div className="max-w-sm space-y-6 animate-in zoom-in duration-500">
            <CheckCircle2 size={80} className="text-green-500 mx-auto" />
            <h1 className="text-4xl font-black uppercase tracking-tighter">Order Paid</h1>
            <p className="text-gray-500 font-medium text-sm">Stock has been updated. Return to store to continue.</p>
            <button onClick={() => router.push(`/s/${store?.slug}`)} className="w-full py-5 bg-black text-white rounded-[2rem] font-black uppercase text-[10px] tracking-widest">Back to Store</button>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-6">
      <div className="max-w-2xl w-full space-y-8">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 font-black uppercase text-[10px] tracking-widest hover:text-black transition">
            <ArrowLeft size={16} /> Return to Boutique
        </button>

        <div className="bg-white rounded-[3.5rem] shadow-2xl border border-gray-100 overflow-hidden">
          <div className="bg-black p-12 text-white flex justify-between items-center">
            <h1 className="text-3xl font-black uppercase tracking-tighter">{store?.name}</h1>
            <ShoppingBag size={40} className="opacity-20" />
          </div>

          <div className="p-10 space-y-10">
            <div className="space-y-4">
              {cartItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center pb-4 border-b border-gray-50">
                  <div>
                    <h4 className="font-black uppercase text-sm">{item.name}</h4>
                    <p className="text-[10px] font-bold text-gray-400">₦{item.price.toLocaleString()} × {item.quantity}</p>
                  </div>
                  <p className="font-black text-black">₦{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
              <div className="flex justify-between items-center pt-6">
                <p className="text-4xl font-black">₦{totalAmount.toLocaleString()}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Mail className={`absolute left-5 top-1/2 -translate-y-1/2 transition ${isEmailValid ? 'text-green-500' : 'text-gray-300'}`} size={18} />
                <input 
                  type="email" placeholder="Enter email for receipt"
                  className="w-full pl-14 pr-6 py-5 bg-gray-50 rounded-[1.5rem] text-xs font-bold outline-none border-2 border-transparent focus:border-black transition-all"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {isEmailValid && store?.paystack_public_key ? (
                <div key={email} className="w-full">
                  {/* @ts-ignore */}
                  <PaystackButton 
                    email={email} amount={totalAmount * 100} publicKey={store.paystack_public_key}
                    text={`Pay ₦${totalAmount.toLocaleString()} Now`} onSuccess={handlePaymentSuccess}
                    onClose={() => {}} className="w-full py-6 rounded-[1.5rem] bg-black text-white font-black uppercase text-[11px] tracking-widest shadow-2xl active:scale-95 transition hover:bg-gray-900"
                  />
                </div>
              ) : (
                <div className="w-full py-6 rounded-[1.5rem] bg-gray-50 text-gray-300 font-black uppercase text-[10px] text-center border border-gray-100"><Lock size={14} className="inline mr-2"/> Email Required</div>
              )}
              <button onClick={handleWhatsAppOrder} className="w-full py-6 rounded-[1.5rem] border-2 border-gray-100 text-gray-400 font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2"><MessageCircle size={18} /> Order via WhatsApp</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}