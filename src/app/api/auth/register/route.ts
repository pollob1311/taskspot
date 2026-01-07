import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const registerSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    firstName: z.string().min(1, 'First name required'),
    lastName: z.string().optional(),
    countryCode: z.string().length(2, 'Invalid country code').optional().default('US'),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validate input
        const validatedData = registerSchema.parse(body);

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: validatedData.email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'Email already registered' },
                { status: 400 }
            );
        }

        // Hash password
        const passwordHash = await bcrypt.hash(validatedData.password, 12);

        // Generate referral code
        const referralCode = `REF${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

        // Create user
        const user = await prisma.user.create({
            data: {
                email: validatedData.email,
                passwordHash,
                firstName: validatedData.firstName,
                lastName: validatedData.lastName,
                countryCode: validatedData.countryCode,
                referralCode,
                emailVerified: false, // Will verify via email
            },
        });

        // Give welcome bonus
        await prisma.transaction.create({
            data: {
                userId: user.id,
                type: 'BONUS',
                amount: 0.05, // $0.05
                points: 50,
                description: 'Welcome bonus',
                status: 'COMPLETED',
            },
        });

        await prisma.user.update({
            where: { id: user.id },
            data: {
                availableBalance: 0.05,
                totalEarned: 0.05,
            },
        });

        // TODO: Send verification email
        // await sendVerificationEmail(user.email, user.id);

        return NextResponse.json({
            success: true,
            message: 'Registration successful! You can now log in to your account.',
            userId: user.id,
        });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.errors[0].message },
                { status: 400 }
            );
        }

        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Registration failed. Please try again.' },
            { status: 500 }
        );
    }
}
