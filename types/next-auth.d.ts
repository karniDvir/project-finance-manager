import { ClientSafeProvider } from "next-auth/react";
export type AuthProviders = Record<string, ClientSafeProvider> | null;

declare module "next-auth" {
  interface Session {
    user: {
      id: string;   // 👈 add id to the session type
    } & DefaultSession["user"];
  }
}