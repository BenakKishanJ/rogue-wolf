// app/layout.tsx
import { ReactNode } from "react";
import ClientLayout from "@/components/ClientLayout"; //
import type React from "react";
import type { Metadata } from "next";
import { Inter, Space_Mono } from "next/font/google";
import localFont from "next/font/local";
import "@/styles/globals.css";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

// Using Bebas Neue for bold, impactful headings
const bebasNeue = localFont({
  src: [
    {
      path: "../public/fonts/BebasNeue-Regular.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-bebas",
});

export const metadata: Metadata = {
  title: "Rogue Wolf | Built for beast",
  description:
    "Discover our collection of premium t-shirts with 3D preview and virtual try-on technology",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceMono.variable} ${bebasNeue.variable} font-sans bg-background text-foreground`}
      >
        <ClientLayout>{children}</ClientLayout>
        <script src="https://checkout.razorpay.com/v1/checkout.js" async />
      </body>
    </html>
  );
}
