import type { Metadata, Viewport } from "next"; // Added Viewport
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 1. UPDATED METADATA: This fixes the "Create Next App" text in the browser tab
export const metadata: Metadata = {
  title: {
    default: "Vendra | Modern Nigerian Commerce",
    template: "%s | Vendra" // This allows sub-pages to say "Inventory | Vendra"
  },
  description: "The simplest way to turn your products into a business. Professional storefronts for Nigerian entrepreneurs.",
  icons: {
    icon: "/favicon.ico", // Make sure you have a favicon in your /public folder
    apple: "/apple-touch-icon.png",
  },
};

// 2. VIEWPORT: Ensures the store looks perfect on iPhones and Androids
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // Prevents annoying auto-zoom on input fields in iOS
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-black">
        {children}
      </body>
    </html>
  );
}