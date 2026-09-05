import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Nav from "./components/Nav";
import NavSpacer from "./components/NavSpacer";
import Footer from "./components/Footer";
import { CartProvider } from "./context/CartContext";
import { GoogleAnalytics } from "@next/third-parties/google";
import { getCollections } from "@/lib/shopify";
import { SITE_URL } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
});

const DESCRIPTION =
  "Terra Fieldworks builds rugged tools, gear, and everyday carry — engineered for the field. Rugged by design, ready for anything.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Terra Fieldworks — Rugged Tools & Everyday Carry Gear",
    template: "%s | Terra Fieldworks",
  },
  description: DESCRIPTION,
  openGraph: {
    title: "Terra Fieldworks — Rugged Tools & Everyday Carry Gear",
    description: DESCRIPTION,
    siteName: "Terra Fieldworks",
    url: SITE_URL,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terra Fieldworks — Rugged Tools & Everyday Carry Gear",
    description: DESCRIPTION,
  },
  // max-image-preview:large raises the ceiling on preview size — Google still
  // picks whether and which image to show. Without it the default is a small
  // "standard" thumbnail, and the page is ineligible for Google Discover's
  // large-image cards. The snippet/video caps are lifted for the same reason.
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const collections = await getCollections();

  // GA4 only loads when a measurement ID is configured, so dev/preview builds
  // without NEXT_PUBLIC_GA_ID don't ship analytics or pollute the data.
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Terra Fieldworks",
    url: SITE_URL,
    logo: `${SITE_URL}/Branding/Terra_Round%20Logo%20Only.svg`,
    description: DESCRIPTION,
    // Ties this domain to the profiles the brand owns, so search engines resolve
    // them to one entity instead of guessing between similarly named businesses.
    sameAs: ["https://www.instagram.com/terrafieldworks"],
  };

  return (
    <html lang="en" className={`${inter.className} h-full antialiased`}>
      <body className="min-h-full bg-black text-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <CartProvider>
          <Nav collections={collections} />
          <NavSpacer>{children}</NavSpacer>
          <Footer />
        </CartProvider>
      </body>
      {gaId && <GoogleAnalytics gaId={gaId} />}
    </html>
  );
}
