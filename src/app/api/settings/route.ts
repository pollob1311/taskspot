import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const settings = await prisma.systemSetting.findMany({
            where: { isPublic: true }
        });

        const settingsMap = settings.reduce((acc: any, setting) => {
            acc[setting.key] = setting.value;
            return acc;
        }, {});

        // Always ensure SITE_NAME and MIN_WITHDRAWAL are present even if not marked public yet by admin
        // or just fetch specific keys
        const defaults = {
            SITE_NAME: 'TaskSpot',
            MIN_WITHDRAWAL: '5.00'
        };

        const publicKeys = ['SITE_NAME', 'MIN_WITHDRAWAL', 'BTC_WALLET', 'USDT_WALLET'];
        const publicSettings = await prisma.systemSetting.findMany({
            where: {
                key: { in: publicKeys }
            }
        });

        const publicMap = publicSettings.reduce((acc: any, setting) => {
            acc[setting.key] = setting.value;
            return acc;
        }, { ...defaults });

        return NextResponse.json(publicMap);

    } catch (error) {
        return NextResponse.json({ SITE_NAME: 'TaskSpot', MIN_WITHDRAWAL: '5.00' });
    }
}
