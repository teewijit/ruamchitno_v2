import { getServerSession, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { users } from "@/db/schema/user.schema";
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";

const loginSchema = z.object({
    username: z.string().min(1),
    password: z.string().min(1),
});

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {

                const result = loginSchema.safeParse(credentials);
                
                if (!result.success) return null;
                console.log(result);

                const { username, password } = result.data;

                const user = await db.select()
                    .from(users)
                    .where(eq(users.username, username))
                    .then(res => res[0]);

                if (!user) return null;

                const isValid = await bcrypt.compare(password, user.password);
                if (isValid) {
                    await db.update(users)
                        .set({ status: 'active' })
                        .where(eq(users.id, user.id));
                } else {
                    return null
                };

                return {
                    id: String(user.id),
                    username: user.username,
                    fullname: user.full_name,
                    role: user.role
                };
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.username = user.username;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            session.user = {
                id: token.id as string,
                username: token.username as string,
                role: token.role as "user" | "admin" | "manager",
            };
            return session;
        }
    },
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
};

export function auth(...args: [GetServerSidePropsContext["req"],
    GetServerSidePropsContext["res"]] | [NextApiRequest, NextApiResponse] | []) {
    return getServerSession(...args, authOptions)
}