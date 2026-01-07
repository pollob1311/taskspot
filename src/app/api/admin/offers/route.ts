import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const offers = await prisma.offer.findMany({
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(offers);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch offers' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();

        // Basic Manual Offer Creation
        const offer = await prisma.offer.create({
            data: {
                cpaNetwork: 'manual', // Force manual for admin created
                externalOfferId: `manual_${Date.now()}`, // Generate unique ID
                title: body.title,
                description: body.description,
                category: body.category || 'task',
                payout: body.payout || 0,
                userReward: body.userReward || 0,
                rewardPoints: body.rewardPoints || 0,
                countries: body.countries || ['Global'],
                deviceTypes: body.deviceTypes || ['desktop', 'mobile'], // Default to all
                thumbnailUrl: body.thumbnailUrl,
                difficulty: body.difficulty || 'MEDIUM',
                isActive: true
            }
        });

        return NextResponse.json(offer);
    } catch (error) {
        console.error('Create Offer Error:', error);
        return NextResponse.json({ error: 'Failed to create offer' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { id, isActive } = body;

        const updated = await prisma.offer.update({
            where: { id },
            data: { isActive }
        });

        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update offer' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        await prisma.offer.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete offer' }, { status: 500 });
    }
}
