import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const withdrawals = await prisma.withdrawal.findMany({
            where: { status: 'PENDING' },
            include: {
                user: {
                    select: {
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
            orderBy: { requestedAt: 'desc' },
        });

        return NextResponse.json(withdrawals);
    } catch (error) {
        console.error('Admin Fetch Withdrawals Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch withdrawals' },
            { status: 500 }
        );
    }

}

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { id, status, adminNotes } = body;

        // Validation
        if (!id || !['COMPLETED', 'REJECTED'].includes(status)) {
            return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
        }

        const withdrawal = await prisma.withdrawal.findUnique({
            where: { id },
            include: { user: true }
        });

        if (!withdrawal) {
            return NextResponse.json({ error: 'Withdrawal not found' }, { status: 404 });
        }

        if (withdrawal.status !== 'PENDING') {
            return NextResponse.json({ error: 'Withdrawal already processed' }, { status: 400 });
        }

        // Transaction for status update + optional refund
        const result = await prisma.$transaction(async (tx) => {
            // Update the withdrawal record
            const updatedWithdrawal = await tx.withdrawal.update({
                where: { id },
                data: {
                    status,
                    adminNotes,
                    processedAt: new Date()
                }
            });

            // If Rejected, Refund the amount back to Available Balance
            if (status === 'REJECTED') {
                await tx.user.update({
                    where: { id: withdrawal.userId },
                    data: {
                        availableBalance: { increment: withdrawal.amount }
                    }
                });

                // Log the refund transaction
                await tx.transaction.create({
                    data: {
                        userId: withdrawal.userId,
                        type: 'ADJUSTMENT',
                        amount: withdrawal.amount,
                        points: withdrawal.pointsDeducted,
                        description: `Refund: Withdrawal ${withdrawal.id.slice(0, 8)} Rejected by Admin`,
                        status: 'COMPLETED'
                    }
                });
            }

            return updatedWithdrawal;
        });

        return NextResponse.json(result);

    } catch (error) {
        console.error('Admin Process Withdrawal Error:', error);
        return NextResponse.json(
            { error: 'Failed to process withdrawal' },
            { status: 500 }
        );
    }
}
