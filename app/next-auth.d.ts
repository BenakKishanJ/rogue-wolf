// next-auth.d.ts
import { Session as DefaultSession, User as DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Add id as a required property
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  // Optionally extend User if needed (not required here since we're using JWT)
  // interface User extends DefaultUser {
  //   id: string;
  // }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    sub: string; // Ensure sub is typed (should already be present, but for clarity)
  }
}
