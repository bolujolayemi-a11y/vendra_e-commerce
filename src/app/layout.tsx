import type { Metadata, Viewport } from "next";
import { Instrument_Sans } from "next/font/google"; 
import "./globals.css";

// 1. Configure the font with the variable name
const instrument = Instrument_Sans({
  subsets: ["latin"],
  display: 'swap',
  variable: "--font-instrument", // This must match your globals.css
});

export const metadata: Metadata = {
  title: {
    default: "Vendra | Modern Nigerian Commerce",
    template: "%s | Vendra"
  },
  description: "Professional storefronts for Nigerian entrepreneurs. Turn your products into a brand.",
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
      className={`${instrument.variable} h-full antialiased`}
    >
      {/* 2. Added 'font-sans' to the body to ensure the font variable is used by default */}
      <body className="min-h-full flex flex-col selection:bg-black selection:text-white font-sans">
        {children}
      </body>
    </html>
  );
}