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
    category: 'General',
    stock_count: '10',
    is_featured: false,
    is_clearance: false
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
      if (file.size > 2 * 1024 * 1024) {
        return alert("Image too large! Please use a file under 2MB.");
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeId) return alert("No store found!");
    if (!imageFile) return alert("Please upload a product photo.");
    setLoading(true);

    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${storeId}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, imageFile);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase
        .from('products')
        .insert([{
            store_id: storeId,
            name: formData.name,
            price: parseFloat(formData.price),
            description: formData.description,
            category: formData.category,
            image_url: urlData.publicUrl,
            stock_count: parseInt(formData.stock_count),
            is_sold_out: parseInt(formData.stock_count) <= 0,
            is_featured: formData.is_featured,
            is_clearance: formData.is_clearance
        }]);

      if (dbError) throw dbError;

      router.push('/dashboard/manage'); // Redirect back to inventory
      router.refresh();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-16 px-6">
      <Link href="/dashboard/manage" className="inline-flex items-center gap-2 text-gray-400 hover:text-black mb-10 transition font-black uppercase text-[10px] tracking-widest">
        <ChevronLeft size={16} /> Back to Inventory
      </Link>

      <div className="mb-12">
        <h1 className="text-5xl font-black uppercase tracking-tighter text-black leading-none mb-3">Add Item</h1>
        <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">List a new masterpiece</p>
      </div>

      <form onSubmit={handleAddProduct} className="space-y-10">
        
        {/* IMAGE UPLOAD */}
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Product Visual</label>
          <div className={`relative aspect-square md:aspect-video rounded-[3rem] border-2 border-dashed transition-all duration-500 overflow-hidden ${imagePreview ? 'border-transparent' : 'border-gray-200 bg-gray-50 hover:border-black'}`}>
            {imagePreview ? (
              <>
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }} className="absolute top-6 right-6 bg-black text-white p-2 rounded-full shadow-xl"><X size={20}/></button>
              </>
            ) : (
              <label className="flex flex-col items-center justify-center h-full cursor-pointer p-10">
                <Upload size={24} className="mb-4 text-gray-300" />
                <p className="text-[10px] font-black uppercase tracking-widest">Upload Photo</p>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            )}
          </div>
        </div>

        {/* BASIC INFO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Product Name</label>
            <input required className="w-full p-6 bg-white border border-gray-100 rounded-[1.5rem] text-sm font-bold outline-none focus:ring-4 focus:ring-black/5" placeholder="Add Product Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Price (₦)</label>
            <input required type="number" className="w-full p-6 bg-white border border-gray-100 rounded-[1.5rem] text-sm font-bold outline-none focus:ring-4 focus:ring-black/5" placeholder="0" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
          </div>
        </div>

        {/* STOCK & COLLECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Initial Stock</label>
            <input required type="number" className="w-full p-6 bg-white border border-gray-100 rounded-[1.5rem] text-sm font-bold outline-none focus:ring-4 focus:ring-black/5" value={formData.stock_count} onChange={(e) => setFormData({...formData, stock_count: e.target.value})} />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Section</label>
            <select className="w-full p-6 bg-white border border-gray-100 rounded-[1.5rem] text-sm font-bold outline-none cursor-pointer" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
              <option value="General">General Collection</option>
              <option value="Accessories">Accessories</option>
              <option value="Apparel">Apparel</option>
            </select>
          </div>
        </div>

        {/* BOUTIQUE TOGGLES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button 
            type="button"
            onClick={() => setFormData({...formData, is_featured: !formData.is_featured})}
            className={`p-6 rounded-[2rem] border flex items-center gap-4 transition-all ${formData.is_featured ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-100'}`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${formData.is_featured ? 'bg-amber-400 text-white' : 'bg-gray-100 text-gray-400'}`}>
              <Sparkles size={18} />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-widest">Featured</p>
              <p className="text-[9px] text-gray-400 font-bold uppercase">Show in Editor's Choice</p>
            </div>
          </button>

          <button 
            type="button"
            onClick={() => setFormData({...formData, is_clearance: !formData.is_clearance})}
            className={`p-6 rounded-[2rem] border flex items-center gap-4 transition-all ${formData.is_clearance ? 'bg-red-50 border-red-200' : 'bg-white border-gray-100'}`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${formData.is_clearance ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
              <Tag size={18} />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-widest">Clearance</p>
              <p className="text-[9px] text-gray-400 font-bold uppercase">Move to Sale Section</p>
            </div>
          </button>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Description</label>
          <textarea rows={4} className="w-full p-6 bg-white border border-gray-100 rounded-[2rem] text-sm font-bold outline-none resize-none focus:ring-4 focus:ring-black/5" placeholder="Add the product description..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
        </div>

        <button disabled={loading} className="w-full bg-black text-white py-8 rounded-[2rem] font-black text-[11px] uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center justify-center gap-3 shadow-2xl active:scale-95 disabled:bg-gray-200">
          {loading ? <Loader2 className="animate-spin" /> : <><PackagePlus size={18}/> Add to Store</>}
        </button>
      </form>
    </div>
  );
}