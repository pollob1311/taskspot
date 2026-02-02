import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const token = searchParams.get('token');

        if (!token) {
            return NextResponse.json({ error: 'Token is required' }, { status: 400 });
        }

        const user = await prisma.user.findFirst({
            where: {
                verificationToken: token,
            },
        });

        if (!user) {
            return NextResponse.json({ error: 'Invalid or expired verification token' }, { status: 400 });
        }

        await prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: new Date(),
                verificationToken: null,
            },
        });

        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?message=${encodeURIComponent('Email verified successfully! You can now log in.')}`);
    } catch (error: any) {
        console.error('Email verification error:', error);
        return NextResponse.json({ error: 'Failed to verify email' }, { status: 500 });
    }
}
