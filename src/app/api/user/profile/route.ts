import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                countryCode: true,
                avatarUrl: true,
                referralCode: true,
                totalEarned: true,
                availableBalance: true,
                pendingBalance: true,
                createdAt: true,
                status: true,
                _count: {
                    select: {
                        referrals: true,
                    },
                },
                referrals: {
                    select: {
                        commissionEarned: true,
                    },
                },
            },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const referralEarnings = user.referrals.reduce((sum, ref) => sum + Number(ref.commissionEarned), 0);

        return NextResponse.json({
            ...user,
            totalEarned: Number(user.totalEarned),
            availableBalance: Number(user.availableBalance),
            pendingBalance: Number(user.pendingBalance),
            totalReferrals: user._count.referrals,
            referralEarnings: referralEarnings,
            referrals: undefined, // Remove the raw referrals list
            _count: undefined,    // Remove the raw count object
        });
    } catch (error) {
        console.error('Profile fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch profile' },
            { status: 500 }
        );
    }
}
