// lib/auth.ts
import NextAuth, { Session } from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { MongoClient } from "mongodb";
import { JWT } from "next-auth/jwt";
import Google from "next-auth/providers/google"; // Correct import for v5

let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

clientPromise = new MongoClient(process.env.MONGODB_URI).connect();

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
