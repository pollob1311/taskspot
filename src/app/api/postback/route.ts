import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { logFraudEvent } from '@/lib/fraud-detection';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    return handlePostback(request);
}

export async function POST(request: Request) {
    return handlePostback(request);
}

async function handlePostback(request: Request) {
    const url = new URL(request.url);
    const searchParams = Object.fromEntries(url.searchParams);
    const ip = request.headers.get('x-forwarded-for') || url.hostname;

    // 0. Security Token Validation
    const siteTokenSetting = await prisma.systemSetting.findUnique({
        where: { key: 'POSTBACK_TOKEN' }
    });
    const siteToken = siteTokenSetting?.value;
    const receivedToken = searchParams.token || searchParams.key;

    if (siteToken && receivedToken !== siteToken) {
        return NextResponse.json({ error: 'Unauthorized (Invalid Token)' }, { status: 401 });
    }

    // Common Postback Parameters
    const subId = searchParams.subId || searchParams.subid || searchParams.tracking_id || searchParams.click_id;
    const payout = parseFloat(searchParams.payout || searchParams.amount || '0');
    const network = searchParams.network || 'unknown';
    const status = (searchParams.status || 'success').toUpperCase();

    try {
        // 1. Log the attempt
        const postbackLog = await prisma.postbackLog.create({
            data: {
                network,
                subId,
                payout,
                status: 'PENDING',
                rawParams: searchParams,
                ipAddress: ip,
            }
        });

        // 2. Validate essential data
        if (!subId || isNaN(payout)) {
            await prisma.postbackLog.update({
                where: { id: postbackLog.id },
                data: { status: 'FAILED', errorMessage: 'Missing subId or invalid payout' }
            });
            return NextResponse.json({ error: 'Missing subId or payout' }, { status: 400 });
        }

        // 3. Find the tracking record
        const userOffer = await prisma.userOffer.findUnique({
            where: { id: subId },
            include: { offer: true, user: true }
        });

        if (!userOffer) {
            await prisma.postbackLog.update({
                where: { id: postbackLog.id },
                data: { status: 'FAILED', errorMessage: 'UserOffer not found' }
            });
            return NextResponse.json({ error: 'Invalid tracking ID' }, { status: 404 });
        }

        if (userOffer.status === 'APPROVED') {
            await prisma.postbackLog.update({
                where: { id: postbackLog.id },
                data: { status: 'FAILED', errorMessage: 'Offer already approved' }
            });
            return NextResponse.json({ message: 'OK (duplicate)' });
        }

        // 4. Calculate User Reward (Admin share logic)
        // If the postback payout is provided, we use it. Otherwise we use the offer's default reward.
        const rewardAmount = userOffer.offer.userReward ? Number(userOffer.offer.userReward) : (payout * 0.4);
        const rewardPoints = userOffer.offer.rewardPoints || Math.floor(rewardAmount * 100);

        // 5. Transaction: Update everything
        await prisma.$transaction(async (tx) => {
            // Update UserOffer
            await tx.userOffer.update({
                where: { id: subId },
                data: {
                    status: 'APPROVED',
                    completedAt: new Date(),
                    rewardPoints: rewardPoints,
                }
            });

            // Update User Balance
            await tx.user.update({
                where: { id: userOffer.userId },
                data: {
                    availableBalance: { increment: rewardAmount },
                    totalEarned: { increment: rewardAmount },
                }
            });

            // Log Transaction
            await tx.transaction.create({
                data: {
                    userId: userOffer.userId,
                    type: 'EARN',
                    amount: rewardAmount,
                    points: rewardPoints,
                    description: `Reward: Completion of ${userOffer.offer.title} (${network})`,
                    status: 'COMPLETED',
                    offerId: userOffer.offerId,
                }
            });

            // Update Postback Log
            await tx.postbackLog.update({
                where: { id: postbackLog.id },
                data: {
                    status: 'SUCCESS',
                    userId: userOffer.userId,
                    amount: rewardAmount,
                }
            });
        });

        return NextResponse.json({ success: true, message: 'Reward processed' });

    } catch (error: any) {
        console.error('Postback Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
