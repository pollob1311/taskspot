import FingerprintJS from '@fingerprintjs/fingerprintjs-pro';
import { prisma } from './db';
import axios from 'axios';

/**
 * Get device fingerprint using FingerprintJS Pro
 */
export async function getDeviceFingerprint(): Promise<string> {
    try {
        const fp = await FingerprintJS.load({
            apiKey: process.env.NEXT_PUBLIC_FINGERPRINTJS_API_KEY || '',
        });
        const result = await fp.get();
        return result.visitorId;
    } catch (error) {
        console.error('Fingerprint error:', error);
        return 'unknown';
    }
}

/**
 * Check if IP is VPN/Proxy using IPQualityScore
 */
export async function detectVPN(ipAddress: string): Promise<boolean> {
    try {
        const response = await axios.get(
            `https://ipqualityscore.com/api/json/ip/${process.env.IPQUALITYSCORE_API_KEY}/${ipAddress}`
        );

        const data = response.data;
        return data.vpn || data.proxy || data.tor;
    } catch (error) {
        console.error('VPN detection error:', error);
        return false;
    }
}

/**
 * Calculate fraud score for a user (0-100)
 * Higher score = Higher fraud risk
 */
export async function calculateFraudScore(userId: string): Promise<number> {
    let score = 0;

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            userOffers: {
                where: { status: 'APPROVED' },
                orderBy: { completedAt: 'desc' },
            },
            withdrawals: true,
            fraudLogs: true,
        },
    });

    if (!user) return 100;

    // Account age (newer = higher risk)
    const accountAge = Date.now() - user.createdAt.getTime();
    const daysSinceCreation = accountAge / (1000 * 60 * 60 * 24);
    if (daysSinceCreation < 1) score += 20;
    else if (daysSinceCreation < 7) score += 10;
    else if (daysSinceCreation < 30) score += 5;

    // Email verification
    if (!user.emailVerified) score += 15;

    // Offer completion patterns
    const offers = user.userOffers;
    if (offers.length > 0) {
        // Too many offers in short time
        const last24Hours = offers.filter(
            (o) => o.completedAt && Date.now() - o.completedAt.getTime() < 24 * 60 * 60 * 1000
        );
        if (last24Hours.length > 10) score += 25;
        else if (last24Hours.length > 5) score += 15;

        // Unrealistic completion rate
        const completionRate = offers.length / Math.max(daysSinceCreation, 1);
        if (completionRate > 5) score += 20; // More than 5 offers per day average
    }

    // Withdrawal patterns
    if (user.withdrawals.length > 0) {
        const firstWithdrawal = user.withdrawals[0];
        const timeToFirstWithdrawal = firstWithdrawal.requestedAt.getTime() - user.createdAt.getTime();
        const hoursToFirstWithdrawal = timeToFirstWithdrawal / (1000 * 60 * 60);

        // Withdrew very quickly after signup
        if (hoursToFirstWithdrawal < 24) score += 20;
    }

    // Fraud logs
    const criticalLogs = user.fraudLogs.filter((log) => log.severity === 'critical');
    score += criticalLogs.length * 15;

    const highLogs = user.fraudLogs.filter((log) => log.severity === 'high');
    score += highLogs.length * 10;

    // Cap at 100
    return Math.min(score, 100);
}

/**
 * Check if user can complete offer (prevent duplicates)
 */
export async function canCompleteOffer(
    userId: string,
    offerId: string
): Promise<{ allowed: boolean; reason?: string }> {
    // Check if already completed
    const existing = await prisma.userOffer.findUnique({
        where: {
            userId_offerId: {
                userId,
                offerId,
            },
        },
    });

    if (existing) {
        return {
            allowed: false,
            reason: 'You have already completed this offer',
        };
    }

    // Check user status
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        return { allowed: false, reason: 'User not found' };
    }

    if (user.status === 'BANNED') {
        return { allowed: false, reason: 'Your account has been banned' };
    }

    if (user.status === 'SUSPENDED') {
        return { allowed: false, reason: 'Your account is suspended' };
    }

    // Check fraud score
    if (user.fraudScore > 80) {
        return { allowed: false, reason: 'Account under review for suspicious activity' };
    }

    return { allowed: true };
}

/**
 * Log fraud event
 */
export async function logFraudEvent(
    userId: string | null,
    eventType: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    details: any,
    ipAddress?: string,
    userAgent?: string
): Promise<void> {
    await prisma.fraudLog.create({
        data: {
            userId,
            eventType,
            severity,
            details,
            ipAddress,
            userAgent,
        },
    });

    // If critical, auto-suspend user
    if (severity === 'critical' && userId) {
        await prisma.user.update({
            where: { id: userId },
            data: { status: 'SUSPENDED' },
        });
    }
}

/**
 * Check for multiple accounts from same device
 */
export async function detectMultipleAccounts(
    deviceFingerprint: string
): Promise<string[]> {
    const users = await prisma.user.findMany({
        where: {
            deviceFingerprint,
            status: 'ACTIVE',
        },
        select: { id: true },
    });

    return users.map((u) => u.id);
}
