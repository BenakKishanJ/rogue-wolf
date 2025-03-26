// components/ClientLayout.tsx
"use client";
import type React from "react";
import { ReactNode } from "react";
import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "next-auth/react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";
import { LoadingScreen } from "@/components/ui/loading-screen";

export default function ClientLayout({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Show loading screen on route change or initial load
    setIsLoading(true);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Increased to 1.5 seconds for more reliable loading

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={true}
        disableTransitionOnChange
      >
        <div className="flex min-h-screen flex-col">
          <LoadingScreen
            isLoading={isLoading}
            onLoadingComplete={handleLoadingComplete}
          />
          <Header />
          <main className="flex-1">{children}</main>
          <Toaster />
          <Footer />
        </div>
      </ThemeProvider>
    </SessionProvider>
  );
}
