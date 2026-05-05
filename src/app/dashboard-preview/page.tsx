"use client";
import { 
  ChevronLeft, 
  LayoutDashboard, 
  Plus, 
  ClipboardList, 
  Settings, 
  TrendingUp, 
  Package, 
  CreditCard,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPreview() {
  return (
    <div className="min-h-screen bg-gray-50 text-black pb-20">
      {/* Navigation */}
      <nav className="p-6 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-black font-black uppercase text-xs tracking-widest transition">
          <ChevronLeft size={18} /> Back to Home
        </Link>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-10">
        <header className="mb-16 text-center">
          <div className="bg-black text-white p-4 rounded-3xl inline-block mb-6 shadow-xl shadow-black/10">
            <LayoutDashboard size={32} />
          </div>
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">The Command Center</h1>
          <p className="text-gray-500 font-medium text-lg max-w-2xl mx-auto">
            Everything you need to run your business, designed to stay out of your way.
          </p>
        </header>

        {/* MOCK DASHBOARD INTERFACE */}
        <div className="bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden mb-20">
          {/* Internal Dashboard Header */}
          <div className="border-b border-gray-50 p-8 flex flex-col md:flex-row justify-between items-center gap-4 bg-white">
            <div>
                <h2 className="text-2xl font-black uppercase tracking-tight">Lara's Boutique</h2>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Store Overview</p>
            </div>
            <div className="flex gap-3">
                <div className="px-4 py-2 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    Live Store
                </div>
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Mock */}
            <div className="hidden lg:flex flex-col gap-2">
                <div className="p-3 bg-black text-white rounded-xl flex items-center gap-3 font-bold text-sm">
                    <LayoutDashboard size={18}/> Overview
                </div>
                <div className="p-3 text-gray-400 rounded-xl flex items-center gap-3 font-bold text-sm hover:bg-gray-50 transition">
                    <Plus size={18}/> Add Product
                </div>
                <div className="p-3 text-gray-400 rounded-xl flex items-center gap-3 font-bold text-sm hover:bg-gray-50 transition">
                    <ClipboardList size={18}/> Manage Stock
                </div>
                <div className="p-3 text-gray-400 rounded-xl flex items-center gap-3 font-bold text-sm hover:bg-gray-50 transition">
                    <Settings size={18}/> Settings
                </div>
            </div>

            {/* Main Content Mock */}
            <div className="lg:col-span-3 space-y-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
                        <TrendingUp className="text-blue-500 mb-4" size={20}/>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Weekly Sales</p>
                        <h4 className="text-2xl font-black">₦142,500</h4>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
                        <Package className="text-purple-500 mb-4" size={20}/>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Total Products</p>
                        <h4 className="text-2xl font-black">24 Items</h4>
                    </div>
                </div>

                {/* Integration Status */}
                <div className="bg-green-50/50 p-6 rounded-[2rem] border border-green-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-green-500 text-white p-2 rounded-xl">
                            <CreditCard size={20}/>
                        </div>
                        <div>
                            <p className="text-sm font-black uppercase tracking-tight text-green-800">Paystack Connected</p>
                            <p className="text-xs font-medium text-green-600/80">Funds deposit directly to your bank account.</p>
                        </div>
                    </div>
                    <CheckCircle2 className="text-green-500" size={24}/>
                </div>

                {/* Recent Activity Mock */}
                <div className="space-y-4">
                    <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Recent Orders</h5>
                    {[1, 2].map((item) => (
                        <div key={item} className="flex items-center justify-between p-4 border-b border-gray-50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-lg"></div>
                                <div>
                                    <p className="text-xs font-black uppercase">Premium Cotton Fabric</p>
                                    <p className="text-[10px] font-bold text-gray-400">2 minutes ago</p>
                                </div>
                            </div>
                            <p className="text-xs font-black">₦15,000</p>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        </div>

        {/* Feature Explanations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
            <div>
                <h3 className="font-black uppercase tracking-tight mb-3">Live Inventory</h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                    Instantly toggle items as "Sold Out" or update quantities. Your storefront updates in real-time.
                </p>
            </div>
            <div>
                <h3 className="font-black uppercase tracking-tight mb-3">Sales Analytics</h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                    Track your growth with simple, visual charts. See what's selling and what's not without the headache.
                </p>
            </div>
            <div>
                <h3 className="font-black uppercase tracking-tight mb-3">Direct Payouts</h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                    Connect Paystack once and forget it. Vendra handles the math while you handle the products.
                </p>
            </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
            <Link 
                href="/login?mode=signup" 
                className="bg-black text-white px-12 py-6 rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-110 transition-all inline-flex items-center gap-3 shadow-2xl shadow-black/40"
            >
                Start Your Dashboard <ArrowRight size={18} />
            </Link>
        </div>
      </main>
    </div>
  );
}