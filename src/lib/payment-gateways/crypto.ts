import axios from 'axios';

const NOWPAYMENTS_API_BASE = 'https://api.nowpayments.io/v1';

/**
 * Process cryptocurrency payout via NOW Payments
 * Supports: BTC, ETH, USDT, USDC, TRX, LTC, etc.
 */
export async function processCryptoPayout(
    userId: string,
    currency: string, // 'btc', 'eth', 'usdt', etc.
    walletAddress: string,
    amountUSD: number
): Promise<{ success: boolean; transactionId?: string; error?: string }> {
    try {
        // Get current exchange rate
        const rateResponse = await axios.get(
            `${NOWPAYMENTS_API_BASE}/estimate?amount=${amountUSD}&currency_from=usd&currency_to=${currency}`,
            {
                headers: {
                    'x-api-key': process.env.NOWPAYMENTS_API_KEY || '',
                },
            }
        );

        const cryptoAmount = rateResponse.data.estimated_amount;

        // Create payout
        const payoutResponse = await axios.post(
            `${NOWPAYMENTS_API_BASE}/payout`,
            {
                withdrawals: [
                    {
                        address: walletAddress,
                        currency: currency.toLowerCase(),
                        amount: cryptoAmount,
                        ipn_callback_url: `${process.env.NEXTAUTH_URL}/api/webhooks/crypto`,
                        extra_id: userId,
                    },
                ],
            },
            {
                headers: {
                    'x-api-key': process.env.NOWPAYMENTS_API_KEY || '',
                    'Content-Type': 'application/json',
                },
            }
        );

        return {
            success: true,
            transactionId: payoutResponse.data.id,
        };
    } catch (error: any) {
        console.error('Crypto payout error:', error);
        return {
            success: false,
            error: error.response?.data?.message || error.message,
        };
    }
}

/**
 * Validate cryptocurrency wallet address
 */
export async function validateWalletAddress(
    currency: string,
    address: string
): Promise<boolean> {
    // Basic validation regex patterns
    const patterns: Record<string, RegExp> = {
        btc: /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,62}$/,
        eth: /^0x[a-fA-F0-9]{40}$/,
        usdt: /^0x[a-fA-F0-9]{40}$|^T[a-zA-Z0-9]{33}$/, // ERC20 or TRC20
        trx: /^T[a-zA-Z0-9]{33}$/,
        ltc: /^[LM3][a-km-zA-HJ-NP-Z1-9]{26,33}$/,
    };

    const pattern = patterns[currency.toLowerCase()];
    if (!pattern) return false;

    return pattern.test(address);
}
