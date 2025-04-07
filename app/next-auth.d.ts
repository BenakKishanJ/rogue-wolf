// types/next-auth.d.ts
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: string;
      address?: string;
      pincode?: string; // Add pincode
      phone?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role?: string;
    address?: string;
    pincode?: string; // Add pincode
    phone?: string;
    image?: string;
  }
}
