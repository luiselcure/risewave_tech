import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RisiChatbot from "@/components/RisiChatbot";

export const metadata: Metadata = {
  title: "RiseWave Tech | Impresión 3D de Precisión",
  description: "Optimizá tu espacio con un toque 3D. Impresión 3D de precisión, prototipado maker y gadgets para gaming.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <RisiChatbot />
      </body>
    </html>
  );
}


