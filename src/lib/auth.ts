import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import AzureADProvider from "next-auth/providers/azure-ad";
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from './db';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/login',
        signOut: '/logout',
        error: '/error',
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        }),
        AzureADProvider({
            clientId: process.env.AZURE_AD_CLIENT_ID || '',
            clientSecret: process.env.AZURE_AD_CLIENT_SECRET || '',
            tenantId: process.env.AZURE_AD_TENANT_ID,
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Invalid credentials');
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user || !user.passwordHash) {
                    throw new Error('User not found');
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    user.passwordHash
                );

                if (!isPasswordValid) {
                    throw new Error('Invalid password');
                }

                if (user.status === 'BANNED') {
                    throw new Error('Account has been banned');
                }

                if (user.status === 'SUSPENDED') {
                    throw new Error('Account is suspended');
                }

                // Email verification check bypassed per user request
                // if (!user.emailVerified) {
                //     throw new Error('Please verify your email first');
                // }

                // Update last login
                await prisma.user.update({
                    where: { id: user.id },
                    data: { lastLoginAt: new Date() },
                });

                return {
                    id: user.id,
                    email: user.email,
                    name: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.email,
                    role: user.role,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};
