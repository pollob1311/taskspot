import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const country = searchParams.get('country');

    try {
        const session = await getServerSession(authOptions);
        const userId = session?.user?.id;

        // Get user's completed offers
        const completedOfferIds = userId
            ? (await prisma.userOffer.findMany({
                where: { userId },
                select: { offerId: true },
            })).map((uo) => uo.offerId)
            : [];

        // Build where clause
        const where: any = { isActive: true };
        if (category) where.category = category;
        if (country) {
            where.countries = { hasSome: [country, 'Global', 'All'] };
        }

        // Fetch offers
        const offers = await prisma.offer.findMany({
            where,
            orderBy: [
                { isFeatured: 'desc' },
                { rewardPoints: 'desc' },
            ],
        });

        // Mark completed offers
        const offersWithStatus = offers.map((offer) => ({
            ...offer,
            isCompleted: completedOfferIds.includes(offer.id),
            payout: Number(offer.payout),
            userReward: Number(offer.userReward),
            conversionRate: offer.conversionRate ? Number(offer.conversionRate) : null,
        }));

        return NextResponse.json(offersWithStatus);
    } catch (error) {
        console.error('Offers fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch offers' },
            { status: 500 }
        );
    }
}
