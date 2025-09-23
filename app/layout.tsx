import type { Metadata, Viewport } from "next";
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

export const metadata: Metadata = {
  title: "0G Climate Dashboard",
  description: "Join the sustainable AI revolution. ØG DeAIOS testnet proves decentralized AI can be 85% cleaner than traditional cloud infrastructure. Be part of the solution.",
  keywords: ["ØG", "Zero Gravity", "DeAIOS", "carbon emissions", "sustainable AI", "climate impact", "decentralized AI", "blockchain sustainability"],
  authors: [{ name: "ØG Labs" }],
  openGraph: {
    title: "ØG Climate Impact Monitor",
    description: "Carbon impact projections for decentralized AI infrastructure",
    type: "website",
    siteName: "ØG Climate Monitor",
    images: [{
      url: "https://cdn.prod.website-files.com/680b884d38733122a923739b/6841a8920a2dfb26e2db2ad3_ff0020bc-7c22-46ee-80a8-9e137e023ef1.webp",
      width: 1200,
      height: 630,
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ØG Climate Impact Monitor",
    description: "Projected environmental impact of decentralized AI infrastructure",
  },
  robots: {
    index: true,
    follow: true,
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
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
