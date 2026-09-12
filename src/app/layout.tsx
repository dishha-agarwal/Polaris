import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Polaris | AI-Powered Polar Knowledge",
  description: "An AI-powered Polar Knowledge Intelligence & Outreach Layer connecting India's existing polar research sources.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen flex flex-col relative text-polar-50">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518091043644-c1d44570a2c9?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-5 fixed z-[-1]"></div>
        <Navbar />
        <main className="flex-1 flex flex-col pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
