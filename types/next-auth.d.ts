// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      role: "user" | "admin" | "manager";
    };
  }

  interface User {
    id: string;
    username: string;
    role: "user" | "admin" | "manager";
  }

  interface JWT {
    id: string;
    username: string;
    role: "user" | "admin" | "manager";
  }
}
