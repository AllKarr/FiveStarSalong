/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/db";

const credentialsSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,

  providers: [
    Credentials({
      authorize: async (credentials) => {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        const client = await clientPromise;
        const db = client.db("fivestar");
        const user = await db.collection("users").findOne({ email });
        if (!user) return null;

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;

        // 👇 Automatically grant admin role to specific email
        const role =
          email === "allen.karro@gmail.com" ? "admin" : user.role || "user";

        return {
          id: user._id.toString(),
          name: `${user.name} ${user.surname}`,
          email: user.email,
          role,
        };
      },
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user }) {
      // When user first signs in
      if (user) {
        token.user = {
          id: (user as any).id,
          name: (user as any).name,
          email: (user as any).email,
          role: (user as any).role,
        };
      }
      return token;
    },

    async session({ session, token }) {
      if (token.user) {
        session.user = token.user as any;
        // ensure id is always available
        if (!session.user.id && (token.user as any).id) {
          session.user.id = (token.user as any).id;
        }
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
});

export const { GET, POST } = handlers;
