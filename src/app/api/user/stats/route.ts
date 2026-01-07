import { NextResponse } from 'next/server';
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
                availableBalance: true,
                pendingBalance: true,
                totalEarned: true,
                _count: {
                    select: {
                        userOffers: {
                            where: { status: 'APPROVED' },
                        },
                    },
                },
            },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            availableBalance: Number(user.availableBalance),
            pendingBalance: Number(user.pendingBalance),
            totalEarned: Number(user.totalEarned),
            completedOffers: user._count.userOffers,
        });
    } catch (error) {
        console.error('Stats error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch stats' },
            { status: 500 }
        );
    }
}
