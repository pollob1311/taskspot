import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { canCompleteOffer, logFraudEvent } from '@/lib/fraud-detection';

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { offerId } = await request.json();

        if (!offerId) {
            return NextResponse.json({ error: 'Offer ID required' }, { status: 400 });
        }

        // Check if user can complete offer
        const check = await canCompleteOffer(session.user.id, offerId);

        if (!check.allowed) {
            return NextResponse.json({ error: check.reason }, { status: 403 });
        }

        // Get offer details
        const offer = await prisma.offer.findUnique({
            where: { id: offerId },
        });

        if (!offer || !offer.isActive) {
            return NextResponse.json({ error: 'Offer not available' }, { status: 404 });
        }

        // Create tracking record
        const userOffer = await prisma.userOffer.create({
            data: {
                userId: session.user.id,
                offerId,
                status: 'STARTED',
                startedAt: new Date(),
            },
        });

        // Generate unique tracking URL
        const trackingUrl = `${offer.externalOfferId}?subid=${userOffer.id}&user=${session.user.id}`;

        // Log offer start
        await logFraudEvent(
            session.user.id,
            'OFFER_STARTED',
            'low',
            { offerId, trackingId: userOffer.id },
            request.headers.get('x-forwarded-for') || 'unknown'
        );

        return NextResponse.json({
            success: true,
            trackingUrl,
            trackingId: userOffer.id,
        });
    } catch (error) {
        console.error('Start offer error:', error);
        return NextResponse.json(
            { error: 'Failed to start offer' },
            { status: 500 }
        );
    }
}
