"use client";
import { useState, useEffect, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, Loader2, ChevronLeft, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

function LoginContent() {
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') || 'login'; 
  
  const [isLoginView, setIsLoginView] = useState(mode === 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLoginView(mode === 'login');
  }, [mode]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLoginView) {
        // --- LOGIN LOGIC ---
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        
        if (error) throw error;

        if (data.user) {
          // Check if this user already has a store created
          const { data: store, error: storeError } = await supabase
            .from('stores')
            .select('id')
            .eq('owner_id', data.user.id)
            .maybeSingle(); // maybeSingle doesn't throw error if 0 rows found

          if (!store) {
            // No store found? Send them to onboarding to set up their brand
            router.push('/onboarding');
          } else {
            // Store exists? Send them to the management dashboard
            router.push('/dashboard');
          }
        }
      } else {
        // --- SIGN UP LOGIC ---
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            // Redirects to onboarding after they click the email verification link
            emailRedirectTo: `${window.location.origin}/onboarding`,
          }
        });
        
        if (error) throw error;
        
        alert("Success! We sent a confirmation link to your email. Click it to start your onboarding.");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6 relative">
      {/* BACK NAVIGATION */}
      <Link 
        href="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-black transition font-black uppercase text-xs tracking-widest"
      >
        <ChevronLeft size={18} /> Back
      </Link>

      <div className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-xl shadow-black/5 border border-gray-100">
        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black tracking-tighter uppercase text-black leading-none">
            {isLoginView ? "Welcome Back" : "Join Vendra"}
          </h1>
          <p className="text-gray-400 text-[10px] mt-3 font-black uppercase tracking-widest">
            {isLoginView ? "Manage your collection" : "Create your boutique today"}
          </p>
        </div>

        {/* TOGGLE SWITCH */}
        <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-8">
            <button 
                type="button"
                onClick={() => setIsLoginView(true)}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isLoginView ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
                Login
            </button>
            <button 
                type="button"
                onClick={() => setIsLoginView(false)}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!isLoginView ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
                Sign Up
            </button>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          {/* EMAIL INPUT */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1 mb-2 block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input 
                required
                type="email" 
                placeholder="you@example.com" 
                className="w-full pl-12 p-5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-black/5 transition font-bold text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* PASSWORD INPUT */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1 mb-2 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input 
                required
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                className="w-full pl-12 pr-12 p-5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-black/5 transition font-bold text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] hover:bg-gray-800 transition-all active:scale-95 flex items-center justify-center shadow-2xl shadow-black/10 disabled:bg-gray-200"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (isLoginView ? "Secure Sign In" : "Initialize Account")}
          </button>
        </form>

        <div className="mt-8 text-center">
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                Protected by Vendra Security &bull; 2026
            </p>
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
        <Loader2 className="animate-spin text-black" size={40} />
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">Syncing Vault</p>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}