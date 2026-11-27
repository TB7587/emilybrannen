import type { Metadata, Viewport } from "next";
import { Fraunces, Nunito } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { UtmCapture } from "@/components/UtmCapture";

// Two self-hosted variable fonts, latin subset only.
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} | ${site.tagline}`, template: `%s | ${site.name}` },
  description: site.intro,
  openGraph: { siteName: site.name, type: "website", images: ["/images/og.jpg"] },
};

export const viewport: Viewport = { themeColor: "#fbf5ec" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${nunito.variable}`}>
      <body className="antialiased">
        <UtmCapture />
        <Header />
        <main className="mx-auto w-full max-w-5xl px-5">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
