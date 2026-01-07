import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { amount, method, paymentDetails } = await req.json();

        // Fetch Minimum Withdrawal Setting
        const minSetting = await prisma.systemSetting.findUnique({
            where: { key: 'MIN_WITHDRAWAL' }
        });
        const minLimit = minSetting ? parseFloat(minSetting.value) : 5.00;

        // Validation
        const withdrawalAmount = Number(amount);
        if (isNaN(withdrawalAmount) || withdrawalAmount < minLimit) {
            return NextResponse.json({ error: `Minimum withdrawal is $${minLimit.toFixed(2)}` }, { status: 400 });
        }

        if (!method || !paymentDetails) {
            return NextResponse.json({ error: 'Missing payment method or details' }, { status: 400 });
        }

        // Check user balance
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { availableBalance: true },
        });

        if (!user || Number(user.availableBalance) < withdrawalAmount) {
            return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
        }

        // Process withdrawal (Transaction and Withdrawal record)
        const result = await prisma.$transaction(async (tx) => {
            // Deduct from user balance
            await tx.user.update({
                where: { id: session.user.id },
                data: {
                    availableBalance: {
                        decrement: withdrawalAmount,
                    },
                    pendingBalance: {
                        increment: withdrawalAmount,
                    },
                },
            });

            // Create withdrawal record
            const withdrawal = await tx.withdrawal.create({
                data: {
                    userId: session.user.id,
                    method,
                    amount: withdrawalAmount,
                    pointsDeducted: Math.round(withdrawalAmount * 100), // Assuming 100 points per dollar
                    paymentDetails: paymentDetails,
                    status: 'PENDING',
                },
            });

            // Log transaction
            await tx.transaction.create({
                data: {
                    userId: session.user.id,
                    type: 'SPEND',
                    amount: withdrawalAmount,
                    points: Math.round(withdrawalAmount * 100),
                    description: `Withdrawal request via ${method}`,
                    status: 'PENDING',
                },
            });

            return withdrawal;
        });

        return NextResponse.json({ success: true, withdrawal: result });
    } catch (error) {
        console.error('Withdrawal error:', error);
        return NextResponse.json(
            { error: 'Failed to process withdrawal' },
            { status: 500 }
        );
    }
}
