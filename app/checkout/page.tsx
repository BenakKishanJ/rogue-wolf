// app/checkout/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CheckoutPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="container py-20 text-center">Loading...</div>;
  }

  if (!session) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
        <Button asChild>
          <Link href="/auth/signin">Sign In</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-20">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>
      <p>Payment integration to be implemented later.</p>
      <Button className="mt-4 bg-accent hover:bg-accent/90 text-accent-foreground">
        Placeholder: Complete Purchase
      </Button>
    </div>
  );
}
