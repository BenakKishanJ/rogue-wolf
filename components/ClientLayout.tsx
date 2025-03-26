// components/ClientLayout.tsx
"use client";

import type React from "react";
import { ReactNode, Suspense } from "react";
import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "next-auth/react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";
import { LoadingScreen } from "@/components/ui/loading-screen";

// Component to handle route changes with useSearchParams
function RouteTracker({
  onRouteChange,
}: {
  onRouteChange: (isLoading: boolean) => void;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    onRouteChange(true); // Start loading

    const timer = setTimeout(() => {
      onRouteChange(false); // End loading
    }, 1500);

    return () => clearTimeout(timer);
  }, [pathname, searchParams, onRouteChange]);

  return null; // This component doesn’t render anything
}

export default function ClientLayout({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

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
          <Suspense fallback={<div>Loading...</div>}>
            <RouteTracker onRouteChange={setIsLoading} />
          </Suspense>
          <Header />
          <main className="flex-1">{children}</main>
          <Toaster />
          <Footer />
        </div>
      </ThemeProvider>
    </SessionProvider>
  );
}
