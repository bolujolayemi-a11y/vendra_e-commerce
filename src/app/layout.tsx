import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google"; // Switch to Inter
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap', // This fixes the preload console error!
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Vendra | Modern Nigerian Commerce",
    template: "%s | Vendra"
  },
  description: "Professional storefronts for Nigerian entrepreneurs.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col selection:bg-black selection:text-white">
        {children}
      </body>
    </html>
  );
}