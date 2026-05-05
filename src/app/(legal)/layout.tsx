"use client";
import { Suspense } from 'react'; // 1. Added Suspense
import { ChevronLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// 2. Move the logic into a sub-component
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

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white pb-20">
      {/* 3. Wrap the Nav in Suspense because it uses useSearchParams */}
      <Suspense fallback={
        <div className="p-6 max-w-7xl mx-auto animate-pulse">
          <div className="h-4 w-32 bg-gray-100 rounded-full" />
        </div>
      }>
        <LegalNav />
      </Suspense>

      <main className="max-w-3xl mx-auto px-6 pt-10">
        {children}
      </main>

      <footer className="mt-32 py-12 border-t border-gray-50 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-200">
          Vendra Legal Operations &bull; 2026
        </p>
      </footer>
    </div>
  );
}