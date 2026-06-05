import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Nav from "./components/Nav";
import NavSpacer from "./components/NavSpacer";
import { CartProvider } from "./context/CartContext";
import { getCollections } from "@/lib/shopify";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Terra Fieldworks",
  description: "Rugged by design. Ready for anything.",
  openGraph: {
    title: "Terra Fieldworks",
    description: "Rugged by design. Ready for anything.",
    siteName: "Terra Fieldworks",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terra Fieldworks",
    description: "Rugged by design. Ready for anything.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const collections = await getCollections();

  return (
    <html lang="en" className={`${inter.className} h-full antialiased`}>
      <body className="min-h-full bg-black text-white">
        <CartProvider>
          <Nav collections={collections} />
          <NavSpacer>{children}</NavSpacer>
        </CartProvider>
      </body>
    </html>
  );
}
