import { ClientSafeProvider } from "next-auth/react";
export type AuthProviders = Record<string, ClientSafeProvider> | null;

declare module "next-auth" {
  interface Session {
    user: {
      id: string; 
      role: string,
    } & DefaultSession["user"];
  }
  interface User extends DefaultUser {
    id: string,
    role: string
  }
}