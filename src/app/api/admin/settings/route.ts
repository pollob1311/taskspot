import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const settings = await prisma.systemSetting.findMany();

        // Convert array to object for easier consumption
        const settingsMap = settings.reduce((acc: any, setting) => {
            acc[setting.key] = setting.value;
            return acc;
        }, {});

        return NextResponse.json(settingsMap);

    } catch (error) {
        console.error('Settings fetch error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { settings } = body; // Expecting { KEY: VALUE }

        if (!settings || typeof settings !== 'object') {
            return NextResponse.json({ error: 'Invalid settings format' }, { status: 400 });
        }

        const upserts = Object.entries(settings).map(([key, value]) => {
            return prisma.systemSetting.upsert({
                where: { key },
                update: { value: String(value) },
                create: { key, value: String(value) }
            });
        });

        await Promise.all(upserts);

        return NextResponse.json({ message: 'Settings updated successfully' });

    } catch (error) {
        console.error('Settings update error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
