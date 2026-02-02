import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendPasswordResetEmail } from '@/lib/mail';
import crypto from 'crypto';

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            // Return success even if user not found for security reasons
            return NextResponse.json({ success: true });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

        await prisma.user.update({
            where: { email },
            data: {
                resetToken,
                resetTokenExpiry,
            },
        });

        // Send email
        try {
            await sendPasswordResetEmail(email, resetToken);
        } catch (mailError) {
            console.error('Failed to send reset email:', mailError);
            // Don't reveal email failure to user for security, 
            // but in a real app you might want to handle this better
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Forgot password error:', error);
        return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }
}
