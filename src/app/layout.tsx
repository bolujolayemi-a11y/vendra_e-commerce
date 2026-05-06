import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Playfair_Display } from "next/font/google"; 
import "./globals.css";

const instrument = Instrument_Sans({
  subsets: ["latin"],
  display: 'swap',
  variable: "--font-instrument",
});

// Configure Playfair Display Semi-Bold (600)
const playfair = Playfair_Display({
  subsets: ["latin"],
  display: 'swap',
  weight: "600",
  variable: "--font-playfair",
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
      className={`${instrument.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col selection:bg-black selection:text-white font-sans">
        {children}
      </body>
    </html>
  );
}