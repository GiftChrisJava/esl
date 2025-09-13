"use client";

// import { AuthProvider } from "@/contexts/AuthContext";
// import { CartProvider } from "@/contexts/CartContext";
// import { PRODUCTS } from "@/lib/products";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} font-sans antialiased`}>
        {/* <AuthProvider>
          <CartProvider products={PRODUCTS}>{children}</CartProvider>
        </AuthProvider> */}
        {children}
      </body>
    </html>
  );
}
