import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "../lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],

  session: {
    strategy: "jwt", // store user data in JWT, not in a DB session table
  },

  callbacks: {
    /** 1️⃣ Runs when user signs in with Google */
    async signIn({ user }) {
      if (!user.email) return false; // reject if no email from Google

      // Look up the user by email
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      }); 

      // Create new user if not exists
      if (!existingUser) {
        await prisma.user.create({
          data: {
            email: user.email,
            name: user.name,
            image: user.image,
          },
        });
      }

      return true; // allow login
    },

    /** 2️⃣ Runs whenever JWT is created/updated */
    async jwt({ token, user }) {
      // On first login, add user.id from DB
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });
        if(!dbUser)
            throw new  Error(`User not found in database for email: ${user.email}`);
        token.id = dbUser.id; // attach database id to the JWT
      }
      return token;
    },

    /** 3️⃣ Runs whenever session is checked on client */
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id; // attach DB id to session.user
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/", 
  },
};
