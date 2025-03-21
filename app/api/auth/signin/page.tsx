// app/auth/signin/page.tsx
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function SignIn() {
  return (
    <div className="container py-20 text-center">
      <h1 className="text-2xl font-bold mb-4">Sign In</h1>
      <Button
        onClick={() => signIn("google", { callbackUrl: "/" })}
        className="bg-accent hover:bg-accent/90 text-accent-foreground"
      >
        Sign in with Google
      </Button>
    </div>
  );
}
