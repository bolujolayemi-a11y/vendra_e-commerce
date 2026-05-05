"use client";
import { Suspense } from 'react';
import { ChevronLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function LegalNav() {
  const searchParams = useSearchParams();
  const fromDashboard = searchParams.get('from') === 'dashboard';

  return (
    <nav className="p-6 max-w-7xl mx-auto">
      <Link 
        href={fromDashboard ? "/dashboard/settings" : "/"} 
        className="flex items-center gap-2 text-gray-400 hover:text-black font-black uppercase text-xs tracking-widest transition w-fit"
      >
        <ChevronLeft size={18} /> 
        {fromDashboard ? "Back to Settings" : "Back to Home"}
      </Link>
    </nav>
  );
}

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white pb-20">
      <Suspense fallback={<div className="p-10 animate-pulse bg-gray-50 m-6 rounded-xl" />}>
        <LegalNav />
      </Suspense>
      <main className="max-w-3xl mx-auto px-6 pt-10">
        {children}
      </main>
    </div>
  );
}