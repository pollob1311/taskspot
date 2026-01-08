import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { url } = await req.json();

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        // Save URL for future convenience
        await prisma.systemSetting.upsert({
            where: { key: 'OFFER_FEED_URL' },
            create: {
                key: 'OFFER_FEED_URL',
                value: url,
                description: 'Last used offer feed URL',
                isPublic: false,
            },
            update: {
                value: url,
            },
        });

        // Fetch the feed
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch feed: ${response.statusText}`);
        }

        const data = await response.json();

        // Normalize data: Handle array or object with 'offers' property
        let rawOffers = [];
        if (Array.isArray(data)) {
            rawOffers = data;
        } else if (data.offers && Array.isArray(data.offers)) {
            rawOffers = data.offers;
        } else {
            // Try to find any array property that might contain offers
            const arrayProp = Object.values(data).find(val => Array.isArray(val));
            if (arrayProp) {
                rawOffers = arrayProp as any[];
            } else {
                throw new Error('Invalid feed format: Could not find offers array');
            }
        }

        let syncedCount = 0;
        let errorCount = 0;

        for (const offer of rawOffers) {
            try {
                // Map fields
                // Handle various common field names
                const externalId = String(offer.offer_id || offer.id || offer.offerid || '');
                const title = offer.title || offer.name || offer.offer_name || 'Untitled Offer';
                const description = offer.description || offer.desc || '';
                const payout = parseFloat(offer.payout || offer.rate || offer.amount || offer.cpa || '0');
                const link = offer.link || offer.tracking_url || offer.url || '';
                const network = offer.network || 'external-feed'; // Heuristic

                // Parse countries
                let countries: string[] = [];
                if (offer.countries) {
                    if (Array.isArray(offer.countries)) {
                        countries = offer.countries;
                    } else if (typeof offer.countries === 'string') {
                        countries = offer.countries.split(',').map((c: string) => c.trim().toUpperCase());
                    }
                } else if (offer.country) {
                    countries = offer.country.split(',').map((c: string) => c.trim().toUpperCase());
                }

                if (!externalId || !link) {
                    // Skip invalid offers
                    continue;
                }

                // Calculate user reward (40% default)
                const userReward = payout * 0.40;
                const rewardPoints = Math.floor(userReward * 100);

                await prisma.offer.upsert({
                    where: {
                        cpaNetwork_externalOfferId: {
                            cpaNetwork: network,
                            externalOfferId: externalId, // We use external ID + network as unique key
                        }
                    },
                    update: {
                        title: title.substring(0, 100), // Truncate if too long (optional safety)
                        description: description,
                        payout: payout,
                        userReward: userReward,
                        rewardPoints: rewardPoints,
                        // We map the tracking link to externalOfferId? NO.
                        // The user said: "Tracking URL: The system currently uses externalOfferId as the base tracking URL...
                        // The sync process will map the feed's tracking link to this field."
                        // Wait. If externalOfferId IS the tracking URL, then the composite key above might be too long/messy if the URL is long.
                        // However, the schema has `externalOfferId String`. Ideally this should be a short ID. 
                        // But if the user *explicitly* requested "externalOfferId: Maps to the tracking link", I must follow that.
                        // BUT, if I use the full URL as ID, looking it up later might be tricky if params change. 
                        // Let's re-read: "The system currently uses externalOfferId as the base tracking URL (based on start/route.ts usage). The sync process will map the feed's tracking link to this field."
                        // OK, so `externalOfferId` = `link`.
                        externalOfferId: link,
                        countries: countries,
                        thumbnailUrl: offer.thumbnail || offer.image || offer.picture || null,
                        isActive: true, // Auto-activate synced offers? Maybe safer to default true as per "update local database with new... offers"
                    },
                    create: {
                        cpaNetwork: network,
                        externalOfferId: link, // As per instruction
                        title: title.substring(0, 100),
                        description: description,
                        payout: payout,
                        userReward: userReward,
                        rewardPoints: rewardPoints,
                        countries: countries,
                        category: offer.category || 'General',
                        deviceTypes: ['desktop', 'mobile', 'tablet'], // Default to all
                        thumbnailUrl: offer.thumbnail || offer.image || offer.picture || null,
                        isActive: true,
                    }
                });

                syncedCount++;
            } catch (err) {
                console.error('Error syncing offer:', err);
                errorCount++;
            }
        }

        return NextResponse.json({
            success: true,
            synced: syncedCount,
            errors: errorCount,
            message: `Successfully synced ${syncedCount} offers${errorCount > 0 ? ` with ${errorCount} errors` : ''}.`
        });

    } catch (error: any) {
        console.error('Sync error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
