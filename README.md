# Vendra 🛍️

**The Minimalist Boutique Engine for Modern Vendors.**

Vendra is a commission-free, high-end e-commerce platform designed for Nigerian vendors who value brand identity over marketplace noise. Built with a focus on clean aesthetics and mobile-first performance.

[Live Demo: vendra.name.ng](https://vendra.name.ng)

---

## 🎨 Design Philosophy

Vendra follows a "Digital Gallery" aesthetic—utilizing a premium neutral palette (`#fbfbf9`) and an ink-black typography system (`#1a1a1a`) to ensure the vendor's products are the primary focus.

- **Minimalist UI:** Removing cognitive load for customers.
- **Mobile-Responsive:** Optimized for the Nigerian mobile-first shopping culture.
- **Micro-interactions:** Subtle haptic-like animations for a premium feel.

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + Lucide Icons
- **Backend/Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Storage:** Supabase Storage (Multi-bucket for Logos & Products)
- **Deployment:** Vercel
- **Domain:** .name.ng via Truehost

## ✨ Key Features

- **Multi-Tenant Architecture:** Every vendor gets a unique `/s/slug` storefront.
- **Inventory Control:** Smart sections for _Featured_, _New Arrivals_, and _Clearance_.
- **WhatsApp Concierge:** Direct-to-vendor communication for seamless inquiries.
- **Custom Branding:** Vendors can upload high-res logos and set unique store descriptions.
- **Commission-Free:** Direct integration with Paystack (Public/Secret Key support).

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A Supabase Project
- A Paystack Account

### Installation

1. Clone the repository:
   ```bash
   git clone [https://github.com/your-username/vendra.git](https://github.com/your-username/vendra.git)
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## 📜 Database Schema

Vendra utilizes a relational PostgreSQL schema designed for high-speed retrieval:

- `stores`: Handles vendor identity and Paystack keys.
- `products`: Manages inventory, stock counts, and visibility toggles.
- `orders`: Tracks transaction history and customer data.

---

## 👨‍💻 Author

**Jolayemi Boluwatife** _Junior Frontend Developer | Minimalist Design Specialist_

- Portfolio: [(https://boluwatife-portfolio-psi.vercel.app/)]
- LinkedIn: [https://www.linkedin.com/in/boluwatife-jolayemi-195593218/]

```

```
