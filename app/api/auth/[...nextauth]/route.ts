// app/api/auth/[...nextauth]/route.ts
import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider, { type GoogleProfile } from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { MongoClient } from "mongodb";
import type { Adapter } from "next-auth/adapters";
import connectToDatabase from "@/lib/mongodb";
import mongoose from "mongoose";
import type { JWT } from "next-auth/jwt";
import type { Session, User } from "next-auth";

let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

clientPromise = new MongoClient(process.env.MONGODB_URI).connect();

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }: { user: User; account: any }) {
      if (!account || !user.email) return false;

      await connectToDatabase();
      const db = mongoose.connection;
      const email = user.email;

      // Check if user exists
      const existingUser = await db.collection("users").findOne({ email });

      if (!existingUser) {
        // Create new user with role
        const role = email.endsWith("@roguewolf.com") ? "admin" : "customer";
        await db.collection("users").insertOne({
          name: user.name,
          email: user.email,
          image: user.image,
          role,
          createdAt: new Date(),
          updatedAt: new Date(),
          emailVerified: new Date(),
        });
      }

      return true;
    },

    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role; // Temporary cast until we fetch from DB
      }

      // Fetch fresh user data on each JWT update
      await connectToDatabase();
      const db = mongoose.connection;
      const dbUser = await db.collection("users").findOne({
        email: token.email,
      });

      if (dbUser) {
        // Ensure role is set, default to "customer" if missing
        if (!dbUser.role) {
          const role = dbUser.email.endsWith("@roguewolf.com") ? "admin" : "customer";
          await db.collection("users").updateOne(
            { _id: dbUser._id },
            { $set: { role, updatedAt: new Date() } }
          );
          token.role = role;
        } else {
          token.role = dbUser.role;
        }
        
        token.name = dbUser.name;
        token.email = dbUser.email;
        token.image = dbUser.image;
        token.id = dbUser._id.toString();
      }

      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.image as string | undefined;
      }
      return session;
    },
  },
  events: {
    async createUser({ user }: { user: User }) {
      console.log(`User created: ${user.email}`);
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
