// components/ClientLayout.tsx
"use client";

import type React from "react";
import { ReactNode } from "react";
import { useState, useEffect } from "react"; // Add for state and effects
import { usePathname, useSearchParams } from "next/navigation"; // Add for routing
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "next-auth/react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";
import { LoadingScreen } from "@/components/ui/loading-screen"; // Adjust path

export default function ClientLayout({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true); // Initial loading state
  const pathname = usePathname(); // Current route path
  const searchParams = useSearchParams(); // Query parameters

  useEffect(() => {
    // Show loading screen on route change or initial load
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // 1-second delay (adjust as needed)

    return () => clearTimeout(timer);
  }, [pathname, searchParams]); // Trigger on route or query change

  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={true}
        disableTransitionOnChange
      >
        <div className="flex min-h-screen flex-col">
          <LoadingScreen isLoading={isLoading} /> {/* Add LoadingScreen here */}
          <Header />
          <main className="flex-1">{children}</main>
          <Toaster />
          <Footer />
        </div>
      </ThemeProvider>
    </SessionProvider>
  );
}
