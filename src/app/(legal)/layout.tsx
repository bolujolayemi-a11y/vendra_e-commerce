"use client";
import { Suspense } from 'react';
import { ChevronLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function LegalNav() {
  const searchParams = useSearchParams();
  const fromDashboard = searchParams.get('from') === 'dashboard';

  return (
    <nav className="p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-top-4 duration-700">
      <Link 
        href={fromDashboard ? "/dashboard/settings" : "/"} 
        className="group flex items-center gap-3 text-gray-400 hover:text-black font-black uppercase text-[10px] tracking-[0.3em] transition-all w-fit"
      >
        <div className="bg-gray-50 p-2 rounded-full group-hover:bg-black group-hover:text-white transition-colors">
          <ChevronLeft size={14} /> 
        </div>
        {fromDashboard ? "Back to Settings" : "Back to Home"}
      </Link>
    </nav>
  );
}

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Suspense Boundary: This prevents the 'useSearchParams' hook 
          from crashing the Vercel Prerender worker. 
      */}
      <Suspense fallback={
        <div className="p-8 max-w-7xl mx-auto">
          <div className="h-8 w-32 bg-gray-50 animate-pulse rounded-full" />
        </div>
      }>
        <LegalNav />
      </Suspense>

      <main className="max-w-4xl mx-auto">
        {children}
      </main>

      <footer className="mt-20 py-20 border-t border-gray-50 text-center">
        <p className="text-[9px] font-black uppercase tracking-[1.5em] text-gray-200">
          Vendra Legal Operations &bull; Lagos 2026
        </p>
      </footer>
    </div>
  );
}