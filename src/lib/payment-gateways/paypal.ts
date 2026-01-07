import axios from 'axios';

const PAYPAL_API_BASE =
    process.env.NODE_ENV === 'production'
        ? 'https://api.paypal.com'
        : 'https://api.sandbox.paypal.com';

/**
 * Get PayPal OAuth token
 */
async function getPayPalToken(): Promise<string> {
    const auth = Buffer.from(
        `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
    ).toString('base64');

    const response = await axios.post(
        `${PAYPAL_API_BASE}/v1/oauth2/token`,
        'grant_type=client_credentials',
        {
            headers: {
                Authorization: `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }
    );

    return response.data.access_token;
}

/**
 * Process PayPal mass payout
 */
export async function processPayPalPayout(
    userId: string,
    email: string,
    amount: number
): Promise<{ success: boolean; transactionId?: string; error?: string }> {
    try {
        const token = await getPayPalToken();

        const payload = {
            sender_batch_header: {
                sender_batch_id: `batch_${userId}_${Date.now()}`,
                email_subject: 'You have a payout!',
                email_message: 'You have received a payment from TaskSpot.',
            },
            items: [
                {
                    recipient_type: 'EMAIL',
                    amount: {
                        value: amount.toFixed(2),
                        currency: 'USD',
                    },
                    receiver: email,
                    note: 'Withdrawal from TaskSpot',
                    sender_item_id: `${userId}_${Date.now()}`,
                },
            ],
        };

        const response = await axios.post(
            `${PAYPAL_API_BASE}/v1/payments/payouts`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        return {
            success: true,
            transactionId: response.data.batch_header.payout_batch_id,
        };
    } catch (error: any) {
        console.error('PayPal payout error:', error);
        return {
            success: false,
            error: error.response?.data?.message || error.message,
        };
    }
}
