import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db'; // আপনার প্রজেক্টের পাথ অনুযায়ী
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
        const data = await response.json();

        let rawOffers = [];
        if (data.offers && Array.isArray(data.offers)) {
            rawOffers = data.offers;
        } else if (Array.isArray(data)) {
            rawOffers = data;
        }

        let syncedCount = 0;

        for (const offer of rawOffers) {
            try {
                const title = offer.title || 'Untitled Offer';
                const description = offer.description || '';
                const payout = parseFloat(offer.payout || '0');

                // CPAGrip লিঙ্ক এবং ছবি ম্যাপিং
                const offerLink = offer.offerlink || offer.link || '';
                const thumbnail = offer.offerphoto || offer.image_url || null;
                const network = "CPAGrip";

                if (!offerLink) continue;

                // রিওয়ার্ড ক্যালকুলেশন
                const userReward = payout * 0.40;
                const rewardPoints = Math.floor(userReward * 100);

                // কান্ট্রি লিস্ট তৈরি
                let countries: string[] = [];
                if (offer.countries && Array.isArray(offer.countries)) {
                    countries = offer.countries;
                } else if (offer.accepted_countries) {
                    countries = offer.accepted_countries.split(',').map((c: string) => c.trim().toUpperCase());
                }

                // আপনার স্কিমা অনুযায়ী upsert লজিক (link এর বদলে externalOfferId ব্যবহার করা হয়েছে)
                await prisma.offer.upsert({
                    where: {
                        cpaNetwork_externalOfferId: {
                            cpaNetwork: network,
                            externalOfferId: offerLink, // এখানে লিঙ্কটিই আইডি হিসেবে কাজ করবে
                        }
                    },
                    update: {
                        title: title.substring(0, 100),
                        description: description,
                        payout: payout,
                        userReward: userReward,
                        rewardPoints: rewardPoints,
                        countries: countries,
                        thumbnailUrl: thumbnail,
                        isActive: true,
                    },
                    create: {
                        cpaNetwork: network,
                        externalOfferId: offerLink,
                        title: title.substring(0, 100),
                        description: description,
                        payout: payout,
                        userReward: userReward,
                        rewardPoints: rewardPoints,
                        countries: countries,
                        category: offer.category || 'App Install',
                        deviceTypes: ['desktop', 'mobile', 'tablet'],
                        thumbnailUrl: thumbnail,
                        isActive: true,
                    }
                });

                syncedCount++;
            } catch (err) {
                console.error('Error syncing offer row:', err);
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