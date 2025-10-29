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
      if (user) token.user = user;
      return token;
    },
    async session({ session, token }) {
      if (token.user) session.user = token.user as any;
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
});

export const { GET, POST } = handlers;
