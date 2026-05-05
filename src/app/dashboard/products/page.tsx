"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  PackagePlus, 
  Loader2, 
  ChevronLeft, 
  Upload, 
  X, 
  Sparkles, 
  Tag, 
  Info 
} from 'lucide-react';
import Link from 'next/link';

export default function AddProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'General', // Default category
    stock_count: '10'    // Default stock count
  });

  useEffect(() => {
    async function getStore() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('stores').select('id').eq('owner_id', user.id).single();
        if (data) setStoreId(data.id);
      }
    }
    getStore();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Check file size (limit to 2MB for faster loading)
      if (file.size > 2 * 1024 * 1024) {
        return alert("Image too large! Please use a file under 2MB.");
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeId) return alert("No store found! Please create a store first.");
    if (!imageFile) return alert("Please upload a product photo.");
    setLoading(true);

    let finalImageUrl = '';

    try {
      // 1. Upload image with a unique timestamp to prevent caching issues
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${storeId}/${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);
      
      finalImageUrl = urlData.publicUrl;

      // 2. Insert product
      const { error: dbError } = await supabase
        .from('products')
        .insert([{
            store_id: storeId,
            name: formData.name,
            price: parseFloat(formData.price),
            description: formData.description,
            category: formData.category,
            image_url: finalImageUrl,
            stock_count: parseInt(formData.stock_count),
            is_sold_out: parseInt(formData.stock_count) <= 0
        }]);

      if (dbError) throw dbError;

      router.push('/dashboard');
      router.refresh(); // Update the dashboard list
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-16 px-6">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-black mb-10 transition font-black uppercase text-[10px] tracking-widest">
        <ChevronLeft size={16} /> Back to Dashboard
      </Link>

      <div className="mb-12">
        <h1 className="text-5xl font-black uppercase tracking-tighter text-black leading-none mb-3">Inventory</h1>
        <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">List a new masterpiece</p>
      </div>

      <form onSubmit={handleAddProduct} className="space-y-10">
        
        {/* Modern Image Upload */}
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Product Visual</label>
            {imagePreview && (
              <button 
                type="button" 
                onClick={() => { setImageFile(null); setImagePreview(null); }}
                className="text-red-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1"
              >
                <X size={12} /> Remove
              </button>
            )}
          </div>
          
          <div className={`relative aspect-square md:aspect-video rounded-[3rem] border-2 border-dashed transition-all duration-500 overflow-hidden ${imagePreview ? 'border-transparent' : 'border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-black'}`}>
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover animate-in fade-in duration-500" />
            ) : (
              <label className="flex flex-col items-center justify-center h-full cursor-pointer p-10">
                <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-xl mb-4">
                    <Upload size={24} className="text-black" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-black">Upload Item</p>
                <p className="text-[9px] text-gray-400 mt-2">High-res PNG, JPG or WebP supported</p>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Name */}
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Product Name</label>
            <input 
              required
              className="w-full p-6 bg-white border border-gray-100 rounded-[1.5rem] text-sm font-bold outline-none focus:ring-4 focus:ring-black/5 transition-all shadow-sm"
              placeholder="e.g. Vintage Silk Scarf"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          {/* Price */}
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Price (₦)</label>
            <input 
              required
              type="number"
              className="w-full p-6 bg-white border border-gray-100 rounded-[1.5rem] text-sm font-bold outline-none focus:ring-4 focus:ring-black/5 transition-all shadow-sm"
              placeholder="0.00"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Stock Count */}
          <div className="space-y-4">
            <div className="flex justify-between">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Stock Available</label>
                {parseInt(formData.stock_count) <= 5 && (
                    <span className="text-red-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                        <Tag size={12} /> Auto-Clearance Mode
                    </span>
                )}
            </div>
            <input 
              required
              type="number"
              className="w-full p-6 bg-white border border-gray-100 rounded-[1.5rem] text-sm font-bold outline-none focus:ring-4 focus:ring-black/5 transition-all shadow-sm"
              placeholder="Quantity"
              value={formData.stock_count}
              onChange={(e) => setFormData({...formData, stock_count: e.target.value})}
            />
            <p className="text-[9px] text-gray-400 font-medium">Items with 5 or less units automatically move to the Clearance section.</p>
          </div>

          {/* Category/Tag */}
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Section / Category</label>
            <select 
              className="w-full p-6 bg-white border border-gray-100 rounded-[1.5rem] text-sm font-bold outline-none focus:ring-4 focus:ring-black/5 transition-all shadow-sm appearance-none cursor-pointer"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option value="General">General Collection</option>
              <option value="Featured">Featured Section</option>
              <option value="Accessories">Accessories</option>
              <option value="Apparel">Apparel</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Product Narrative</label>
          <textarea 
            rows={4}
            className="w-full p-6 bg-white border border-gray-100 rounded-[2rem] text-sm font-bold outline-none focus:ring-4 focus:ring-black/5 transition-all shadow-sm resize-none"
            placeholder="Tell the story of this item..."
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>

        {/* Informational Note */}
        <div className="bg-gray-50 p-6 rounded-[2rem] flex gap-4 items-start border border-gray-100">
            <Info size={18} className="text-gray-400 mt-1" />
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tight leading-relaxed">
                By listing this product, it will be immediately visible on your public storefront. High-quality square images (1:1) perform best in the boutique grid.
            </p>
        </div>

        <button 
          disabled={loading}
          className="w-full bg-black text-white py-6 rounded-3xl font-black text-[11px] uppercase tracking-widest hover:bg-gray-800 transition-all disabled:bg-gray-200 flex items-center justify-center gap-3 shadow-2xl active:scale-95"
        >
          {loading ? <Loader2 className="animate-spin" /> : <><PackagePlus size={18}/> Publish to Store</>}
        </button>
      </form>
    </div>
  );
}