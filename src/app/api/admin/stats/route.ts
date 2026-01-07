import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const [
            totalUsers,
            newUsersToday,
            pendingWithdrawals,
            totalPayoutPending,
            activeOffers,
            totalCompletedOffers
        ] = await Promise.all([
            // Total Users
            prisma.user.count(),

            // New Users Today
            prisma.user.count({
                where: {
                    createdAt: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0))
                    }
                }
            }),

            // Pending Withdrawals Count
            prisma.withdrawal.count({
                where: {
                    status: 'PENDING'
                }
            }),

            // Total Pending Payout Amount
            prisma.withdrawal.aggregate({
                where: {
                    status: 'PENDING'
                },
                _sum: {
                    amount: true
                }
            }),

            // Active Offers
            prisma.offer.count({
                where: {
                    isActive: true
                }
            }),

            // Total Completed Offers (UserOffer where status is APPROVED? or just COMPLETED?)
            // Schema has status OfferStatus: STARTED, PENDING, APPROVED, REJECTED
            // Usually 'APPROVED' means client got paid. Let's count APPROVED.
            prisma.userOffer.count({
                where: {
                    status: 'APPROVED'
                }
            })
        ]);

        // Get Recent 5 Activities (Withdrawals or User Signups)
        const recentWithdrawals = await prisma.withdrawal.findMany({
            take: 5,
            orderBy: { requestedAt: 'desc' },
            include: { user: { select: { firstName: true, email: true } } }
        });

        return NextResponse.json({
            stats: {
                totalUsers,
                newUsersToday,
                pendingWithdrawals,
                totalPayoutPending: totalPayoutPending._sum.amount || 0,
                activeOffers,
                totalCompletedOffers
            },
            recentWithdrawals
        });

    } catch (error) {
        console.error('Admin stats error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
