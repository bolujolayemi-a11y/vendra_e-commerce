import { Store, Zap, Heart, Globe } from 'lucide-react';

export default function AboutPage() {
  return (
    <>
      <header className="mb-16 text-center">
        <div className="bg-black text-white p-4 rounded-3xl inline-block mb-6 shadow-xl shadow-black/10">
          <Store size={32} />
        </div>
        <h1 className="text-5xl font-black uppercase tracking-tighter mb-4 text-black">About Vendra</h1>
        <p className="text-gray-500 font-medium text-lg">Empowering the next generation of Nigerian vendors.</p>
      </header>

      <div className="space-y-12">
        {/* Mission Section */}
        <section>
          <h2 className="text-xl font-black uppercase tracking-tight mb-4 flex items-center gap-2 text-black">
            <Zap className="text-blue-500" size={20} /> Our Mission
          </h2>
          <p className="text-gray-600 leading-relaxed font-medium">
            Vendra was built with a simple goal: to remove the technical barriers that stop talented Nigerian entrepreneurs from selling online. We provide a professional, zero-ad environment where anyone can launch a high-end storefront in under 60 seconds.
          </p>
        </section>

        {/* Values Section */}
        <section className="bg-gray-50 p-8 rounded-[2rem]">
          <h2 className="text-xl font-black uppercase tracking-tight mb-4 flex items-center gap-2 text-black">
            <Heart className="text-red-500" size={20} /> Built for You
          </h2>
          <p className="text-gray-600 leading-relaxed font-medium">
            We prioritize local solutions for local businesses. By combining seamless WhatsApp communication with secure Paystack payments, we ensure that the shopping experience is familiar, trusted, and efficient for both vendors and customers.
          </p>
        </section>

        {/* Vision Section */}
        <section>
          <h2 className="text-xl font-black uppercase tracking-tight mb-4 flex items-center gap-2 text-black">
            <Globe className="text-green-500" size={20} /> Transparency First
          </h2>
          <p className="text-gray-600 leading-relaxed font-medium">
            At Vendra, we believe in a clean web. That means no intrusive ads, no selling of user data, and total transparency in how we operate. Our platform is designed to let your brand shine, not ours.
          </p>
        </section>
      </div>
    </>
  );
}