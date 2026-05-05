"use client";
import { useState, useEffect, Suspense } from 'react'; // Added Suspense
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, Loader2, ChevronLeft, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

// 1. Move all the logic into a Content component
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

    if (isLoginView) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        alert(error.message);
      } else {
        router.push('/dashboard');
      }
    } else {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/onboarding`,
        }
      });
      
      if (error) {
        alert(error.message);
      } else {
        alert("Success! Check your email for the confirmation link.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6 relative">
      <Link 
        href="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-black transition font-black uppercase text-xs tracking-widest"
      >
        <ChevronLeft size={18} /> Back
      </Link>

      <div className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-xl shadow-black/5 border border-gray-100">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black tracking-tighter uppercase text-black">
            {isLoginView ? "Welcome Back" : "Join Vendra"}
          </h1>
          <p className="text-gray-500 text-sm mt-2 font-medium">
            {isLoginView ? "Log in to manage your store." : "Start selling in minutes."}
          </p>
        </div>

        <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-8">
            <button 
                type="button"
                onClick={() => setIsLoginView(true)}
                className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${isLoginView ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
                Login
            </button>
            <button 
                type="button"
                onClick={() => setIsLoginView(false)}
                className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${!isLoginView ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
                Sign Up
            </button>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1 mb-2 block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input 
                required
                type="email" 
                placeholder="you@gmail.com" 
                className="w-full pl-12 p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-black transition font-bold"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1 mb-2 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input 
                required
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                className="w-full pl-12 pr-12 p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-black transition font-bold"
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

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-gray-800 transition-all active:scale-95 flex items-center justify-center shadow-xl shadow-black/20"
          >
            {loading ? <Loader2 className="animate-spin" /> : (isLoginView ? "Sign In" : "Create Account")}
          </button>
        </form>
      </div>
    </div>
  );
}

// 2. Wrap the whole thing in Suspense for the Build Worker
export default function Login() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
        <Loader2 className="animate-spin text-black" size={40} />
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">Securing Entry</p>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}