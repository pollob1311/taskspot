import Stripe from 'stripe';
import { prisma } from '../db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2025-12-15.clover',
});

/**
 * Process payout to user's bank account or debit card
 */
export async function processStripePayout(
    userId: string,
    amount: number,
    destination: string // Bank account or debit card ID
): Promise<{ success: boolean; transactionId?: string; error?: string }> {
    try {
        const payout = await stripe.payouts.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency: 'usd',
            method: 'instant', // or 'standard'
            destination,
        });

        return {
            success: true,
            transactionId: payout.id,
        };
    } catch (error: any) {
        console.error('Stripe payout error:', error);
        return {
            success: false,
            error: error.message,
        };
    }
}

/**
 * Create Stripe Connect account for user (if needed for direct deposits)
 */
export async function createStripeAccount(
    userId: string,
    email: string,
    countryCode: string = 'US'
): Promise<string | null> {
    try {
        const account = await stripe.accounts.create({
            type: 'express',
            country: countryCode,
            email,
            capabilities: {
                transfers: { requested: true },
            },
        });

        return account.id;
    } catch (error) {
        console.error('Stripe account creation error:', error);
        return null;
    }
}
