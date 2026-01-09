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

        // URL সেভ করে রাখা
        await prisma.systemSetting.upsert({
            where: { key: 'OFFER_FEED_URL' },
            create: {
                key: 'OFFER_FEED_URL',
                value: url,
                description: 'Last used offer feed URL',
                isPublic: false,
            },
            update: { value: url },
        });

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch feed: ${response.statusText}`);
        }

        const data = await response.json();

        // CPAGrip এর ডেটা 'offers' প্রপার্টির ভেতরে থাকে
        let rawOffers = [];
        if (data.offers && Array.isArray(data.offers)) {
            rawOffers = data.offers;
        } else if (Array.isArray(data)) {
            rawOffers = data;
        } else {
            const arrayProp = Object.values(data).find(val => Array.isArray(val));
            if (arrayProp) rawOffers = arrayProp as any[];
        }

        let syncedCount = 0;
        let errorCount = 0;

        for (const offer of rawOffers) {
            try {
                // CPAGrip Specific Mapping (এটিই সমস্যা ছিল)
                const externalId = String(offer.offer_id || offer.id || '');
                const title = offer.title || offer.name || 'Untitled Offer';
                const description = offer.description || offer.desc || '';
                const payout = parseFloat(offer.payout || offer.rate || '0');

                // CPAGrip-এ লিঙ্ক থাকে 'offerlink' নামে
                const link = offer.offerlink || offer.link || offer.tracking_url || '';

                // CPAGrip-এ ছবি থাকে 'offerphoto' নামে
                const thumbnail = offer.offerphoto || offer.thumbnail || offer.image || null;

                const network = "CPAGrip"; // সরাসরি নাম দিয়ে দেওয়া ভালো

                // লিঙ্ক না থাকলে অফার সেভ হবে না
                if (!externalId || !link) continue;

                // ইউজার রিওয়ার্ড হিসাব (৪০% রিওয়ার্ড)
                const userReward = payout * 0.40;
                const rewardPoints = Math.floor(userReward * 100);

                // কান্ট্রি প্রসেসিং
                let countries: string[] = [];
                if (offer.countries && Array.isArray(offer.countries)) {
                    countries = offer.countries;
                } else if (offer.accepted_countries && typeof offer.accepted_countries === 'string') {
                    countries = offer.accepted_countries.split(',').map((c: any) => c.trim().toUpperCase());
                } else if (offer.country) {
                    countries = [offer.country.toUpperCase()];
                }

                await prisma.offer.upsert({
                    where: {
                        cpaNetwork_externalOfferId: {
                            cpaNetwork: network,
                            externalOfferId: externalId,
                        }
                    },
                    update: {
                        title: title.substring(0, 100),
                        description: description,
                        payout: payout,
                        userReward: userReward,
                        rewardPoints: rewardPoints,
                        link: link + "&subid={user_id}", // ট্র্যাকিং প্যারামিটার যোগ করা
                        countries: countries,
                        thumbnailUrl: thumbnail,
                        isActive: true,
                    },
                    create: {
                        cpaNetwork: network,
                        externalOfferId: externalId,
                        title: title.substring(0, 100),
                        description: description,
                        payout: payout,
                        userReward: userReward,
                        rewardPoints: rewardPoints,
                        link: link + "&subid={user_id}",
                        countries: countries,
                        category: offer.category || 'General',
                        deviceTypes: ['desktop', 'mobile', 'tablet'],
                        thumbnailUrl: thumbnail,
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
            message: `Successfully synced ${syncedCount} offers from CPAGrip.`
        });

    } catch (error: any) {
        console.error('Sync error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}