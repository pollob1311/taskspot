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

    // Common Postback Parameters
    const subId = searchParams.subId || searchParams.subid || searchParams.tracking_id || searchParams.click_id || searchParams.uid || searchParams.user_id;
    const payout = parseFloat(searchParams.payout || searchParams.amount || '0');
    const network = searchParams.network || 'unknown';
    const status = (searchParams.status || 'success').toUpperCase();

    // 1. Log the attempt IMMEDIATELY (before any validation)
    let postbackLog: any;
    try {
        postbackLog = await prisma.postbackLog.create({
            data: {
                network,
                subId,
                payout,
                status: 'PENDING',
                rawParams: searchParams,
                ipAddress: ip,
            }
        });
    } catch (logError) {
        console.error('Failed to create postback log:', logError);
    }

    // 2. Security Token Validation
    const siteTokenSetting = await prisma.systemSetting.findUnique({
        where: { key: 'POSTBACK_TOKEN' }
    });
    const siteToken = siteTokenSetting?.value;
    const receivedToken = searchParams.token || searchParams.key;

    if (siteToken && receivedToken !== siteToken) {
        if (postbackLog) {
            await prisma.postbackLog.update({
                where: { id: postbackLog.id },
                data: { status: 'FAILED', errorMessage: 'Unauthorized (Invalid Token)' }
            });
        }
        return NextResponse.json({ error: 'Unauthorized (Invalid Token)' }, { status: 401 });
    }

    try {
        // 3. Validate essential data
        if (!subId || isNaN(payout)) {
            if (postbackLog) {
                await prisma.postbackLog.update({
                    where: { id: postbackLog.id },
                    data: { status: 'FAILED', errorMessage: 'Missing subId or invalid payout' }
                });
            }
            return NextResponse.json({ error: 'Missing subId or payout' }, { status: 400 });
        }

        // 4. Find the tracking record (or user directly)
        let userId = '';
        let rewardAmount = payout * 0.4;
        let rewardPoints = Math.floor(rewardAmount * 100);
        let description = `Reward: Completion from ${network}`;
        let offerId = null;

        const userOffer = await prisma.userOffer.findUnique({
            where: { id: subId },
            include: { offer: true, user: true }
        });

        if (userOffer) {
            if (userOffer.status === 'APPROVED') {
                if (postbackLog) {
                    await prisma.postbackLog.update({
                        where: { id: postbackLog.id },
                        data: { status: 'FAILED', errorMessage: 'Offer already approved' }
                    });
                }
                return NextResponse.json({ message: 'OK (duplicate)' });
            }
            userId = userOffer.userId;
            rewardAmount = userOffer.offer.userReward ? Number(userOffer.offer.userReward) : (payout * 0.4);
            rewardPoints = userOffer.offer.rewardPoints || Math.floor(rewardAmount * 100);
            description = `Reward: Completion of ${userOffer.offer.title} (${network})`;
            offerId = userOffer.offerId;
        } else {
            // Fallback: Check if subId is a User ID (common for some offer walls)
            const user = await prisma.user.findUnique({
                where: { id: subId }
            });

            if (!user) {
                if (postbackLog) {
                    await prisma.postbackLog.update({
                        where: { id: postbackLog.id },
                        data: { status: 'FAILED', errorMessage: 'Tracking ID (or User ID) not found' }
                    });
                }
                return NextResponse.json({ error: 'Invalid tracking ID' }, { status: 404 });
            }
            userId = user.id;
        }

        // 5. Transaction: Update everything
        await prisma.$transaction(async (tx) => {
            if (userOffer) {
                // Update UserOffer
                await tx.userOffer.update({
                    where: { id: subId },
                    data: {
                        status: 'APPROVED',
                        completedAt: new Date(),
                        rewardPoints: rewardPoints,
                    }
                });
            }

            // Update User Balance
            await tx.user.update({
                where: { id: userId },
                data: {
                    availableBalance: { increment: rewardAmount },
                    totalEarned: { increment: rewardAmount },
                }
            });

            // Log Transaction
            await tx.transaction.create({
                data: {
                    userId: userId,
                    type: 'EARN',
                    amount: rewardAmount,
                    points: rewardPoints,
                    description: description,
                    status: 'COMPLETED',
                    offerId: offerId,
                }
            });

            // Update Postback Log
            if (postbackLog) {
                await tx.postbackLog.update({
                    where: { id: postbackLog.id },
                    data: {
                        status: 'SUCCESS',
                        userId: userId,
                        amount: rewardAmount,
                    }
                });
            }
        });

        return NextResponse.json({ success: true, message: 'Reward processed' });

    } catch (error: any) {
        console.error('Postback Error:', error);
        if (postbackLog) {
            await prisma.postbackLog.update({
                where: { id: postbackLog.id },
                data: { status: 'FAILED', errorMessage: error.message || 'Internal Server Error' }
            });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
