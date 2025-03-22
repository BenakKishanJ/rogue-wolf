// components/ClientLayout.tsx
"use client";
import type React from "react";
import { ReactNode } from "react";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "next-auth/react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        disableTransitionOnChange
      >
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Toaster />
          <Footer />
        </div>
      </ThemeProvider>
    </SessionProvider>
  );
}
