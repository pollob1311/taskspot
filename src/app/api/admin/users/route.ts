import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const query = searchParams.get('q');

        const where: any = {};
        if (query) {
            where.OR = [
                { email: { contains: query, mode: 'insensitive' } },
                { firstName: { contains: query, mode: 'insensitive' } },
                { lastName: { contains: query, mode: 'insensitive' } }
            ];
        }

        const users = await prisma.user.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: 50, // Limit for performance
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                status: true,
                totalEarned: true,
                availableBalance: true,
                fraudScore: true,
                createdAt: true,
                lastLoginAt: true
            }
        });

        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { id, action, value } = body;
        // action: 'STATUS_UPDATE' | 'BALANCE_UPDATE'

        if (!id || !action) {
            return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
        }

        if (action === 'STATUS_UPDATE') {
            const updatedUser = await prisma.user.update({
                where: { id },
                data: { status: value } // 'ACTIVE', 'BANNED', 'SUSPENDED'
            });
            return NextResponse.json(updatedUser);
        }

        if (action === 'BALANCE_UPDATE') {
            const amount = parseFloat(value);
            if (isNaN(amount)) {
                return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
            }

            // Transaction: Update User + Log Transaction
            const result = await prisma.$transaction(async (tx) => {
                const user = await tx.user.update({
                    where: { id },
                    data: { availableBalance: { increment: amount } }
                });

                await tx.transaction.create({
                    data: {
                        userId: id,
                        type: 'ADJUSTMENT',
                        amount: amount,
                        points: 0,
                        description: `Admin Balance Adjustment: ${amount > 0 ? '+' : ''}${amount}`,
                        status: 'COMPLETED'
                    }
                });

                return user;
            });

            return NextResponse.json(result);
        }

        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}
