'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function WithdrawPage() {
    const router = useRouter();
    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState('');
    const [paymentDetail, setPaymentDetail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const isCrypto = ['bitcoin', 'usdt', 'litecoin'].includes(method);
    const detailLabel = isCrypto ? 'Wallet Address' : 'Email Address';
    const detailPlaceholder = isCrypto ? 'Enter your crypto wallet address' : 'Enter your payment email';

    const [minLimit, setMinLimit] = useState(5.00);

    useEffect(() => {
        fetch('/api/settings')
            .then(res => res.json())
            .then(data => {
                if (data.MIN_WITHDRAWAL) {
                    setMinLimit(parseFloat(data.MIN_WITHDRAWAL));
                }
            })
            .catch(console.error);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (parseFloat(amount) < minLimit) {
            setError(`Minimum withdrawal is $${minLimit.toFixed(2)}`);
            return;
        }

        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            const response = await fetch('/api/user/withdraw', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount,
                    method,
                    paymentDetails: paymentDetail,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to submit withdrawal');
            }

            setSuccess(true);
            setAmount('');
            setMethod('');
            setPaymentDetail('');

            // Refresh dashboard data after 2 seconds
            setTimeout(() => {
                router.push('/dashboard');
                router.refresh();
            }, 2000);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--background)] py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <Link href="/dashboard" className="text-purple-600 hover:text-purple-500 font-semibold mb-8 inline-block">
                    ← Back to Dashboard
                </Link>

                <h1 className="text-4xl font-bold mb-8">Withdraw Funds</h1>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="glass-card p-8 rounded-2xl relative overflow-hidden">
                        {success && (
                            <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center p-6 animate-in fade-in zoom-in duration-300">
                                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl mb-4">✓</div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">Request Submitted!</h3>
                                <p className="text-slate-600">Your withdrawal request has been received and is being processed.</p>
                                <p className="text-sm text-slate-400 mt-4 italic">Redirecting to dashboard...</p>
                            </div>
                        )}

                        <h2 className="text-2xl font-semibold mb-6">Request Withdrawal</h2>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium animate-shake">
                                ⚠️ {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">Select Method</label>
                                <select
                                    required
                                    value={method}
                                    onChange={(e) => {
                                        setMethod(e.target.value);
                                        setPaymentDetail('');
                                    }}
                                    className="w-full bg-white border border-slate-200 rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium text-slate-700"
                                >
                                    <option value="">Choose a method...</option>
                                    <option value="paypal">PayPal</option>
                                    <option value="airtm">Airtm</option>
                                    <option value="bitcoin">Bitcoin (BTC)</option>
                                    <option value="litecoin">Litecoin (LTC)</option>
                                    <option value="usdt">USDT (TRC20)</option>
                                    <option value="visa">Visa/Mastercard</option>
                                </select>
                            </div>

                            {method && (
                                <div className="animate-fade-in text-gray-900">
                                    <label className="block text-sm font-medium mb-2">{detailLabel}</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder={detailPlaceholder}
                                        value={paymentDetail}
                                        onChange={(e) => setPaymentDetail(e.target.value)}
                                        className="w-full bg-white border border-slate-200 rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium mb-2">Amount (USD)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                                    <input
                                        type="number"
                                        required
                                        min={minLimit}
                                        step="0.01"
                                        placeholder="0.00"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full bg-white border border-slate-200 rounded-xl p-3.5 pl-8 outline-none focus:ring-2 focus:ring-purple-500 transition-all font-bold text-lg"
                                    />
                                </div>
                                <p className="mt-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">Minimum Withdrawal: ${minLimit.toFixed(2)}</p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-6 rounded-2xl font-black text-xl shadow-glow transition-all transform active:scale-[0.98] tracking-tight relative overflow-hidden ${loading ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'btn-gradient text-white hover:opacity-95'
                                    }`}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
                                        Processing...
                                    </div>
                                ) : 'Confirm Withdrawal'}
                            </button>
                        </form>
                    </div>

                    <div className="space-y-6">
                        <div className="glass-card p-6 rounded-2xl">
                            <h3 className="font-semibold text-lg mb-2">Important Note</h3>
                            <p className="text-sm text-[var(--muted)]">
                                Withdrawals are typically processed within 24-48 hours. Minimum withdrawal amount is ${minLimit.toFixed(2)}.
                            </p>
                        </div>

                        <div className="glass-card p-6 rounded-2xl border-l-4 border-yellow-500">
                            <h3 className="font-semibold text-lg mb-2">Security Check</h3>
                            <p className="text-sm text-[var(--muted)]">
                                Ensure your payment details are correct. We are not responsible for funds sent to wrong addresses.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ultra-Wide Payment Method Logos Section */}
            <div className="container mx-auto px-6 max-w-[1600px] mt-24 mb-16">
                <div className="pt-12 border-t border-gray-100">
                    <p className="text-center text-sm font-semibold text-gray-400 uppercase tracking-widest mb-12">
                        Secure Withdrawals Supported Via
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-12 lg:gap-x-24 gap-y-20 items-center justify-items-center w-full py-12">
                        {/* PayPal - PNG Version */}
                        <div className="h-10 md:h-12 w-full flex justify-center items-center transition-transform hover:scale-110 duration-300 relative">
                            <Image src="/images/payments/paypal.png" alt="PayPal" fill className="object-contain" />
                        </div>

                        {/* Mastercard - PNG Version */}
                        <div className="h-14 md:h-18 w-full flex justify-center items-center transition-transform hover:scale-110 duration-300 relative">
                            <Image src="/images/payments/mastercard.png" alt="Mastercard" fill className="object-contain" />
                        </div>

                        {/* Bitcoin */}
                        <div className="h-10 md:h-12 w-full flex items-center justify-center gap-4 transition-transform hover:scale-110 duration-300">
                            <svg className="h-full w-auto" viewBox="0 0 24 24" fill="#F7931A">
                                <path d="M23.638 14.904c-1.032 4.145-5.247 6.674-9.392 5.642l-1.649-.41.411 1.65c1.032 4.145-1.5 8.359-5.642 9.392-4.145 1.032-8.359-1.5-9.392-5.642l-.41-1.649-1.65.411c-4.145 1.032-8.359-1.5-9.392-5.642-1.032-4.145 1.5-8.359 5.642-9.392l1.649.41-.411-1.65c-1.032-4.145 1.5-8.359 5.642-9.392 4.145-1.032 8.359 1.5 9.392 5.642l.41 1.649 1.65-.411c4.145-1.032 8.359 1.5 9.392 5.642 1.032 4.145-1.5 8.359-5.642 9.392zM15.4 10.5c.3-2.1-1.3-3.2-3.4-3.9l.7-2.8-1.7-.4-.7 2.8c-.4-.1-.9-.2-1.4-.3l.7-2.8-1.7-.4-.7 2.8c-.4-.1-.7-.1-1.1-.2l-2.4-.6-.5 1.9s1.3.3 1.3.3c.7.2.8.6.8 1l-.8 3.2c.1 0 .1.1.2.1l-.2-.1-1.1 4.5c-.1.2-.3.6-.9.4 0 0-1.3-.3-1.3-.3l-.9 2.1 2.2.6c.4.1.8.2 1.2.3l-.7 2.9 1.7.4.7-2.9c.5.1.9.2 1.4.3l-.7 2.9 1.7.4.7-2.9c2.9.6 5.1.3 6-2.3.7-2.1-.1-3.3-1.6-4.1 1.1-.3 1.9-1 2.1-2.6zm-3.8 5.7c-.5 2.1-4 1-5.1.7l.9-3.7c1.1.2 4.7.7 4.2 3zm.5-5.8c-.5 1.9-3.4 1-4.3.7l.8-3.3c.8.2 4 .6 3.5 2.6z" />
                            </svg>
                            <span className="font-bold text-lg md:text-xl text-gray-700 tracking-tight">Bitcoin</span>
                        </div>

                        {/* USDT */}
                        <div className="h-10 md:h-12 w-full flex items-center justify-center gap-4 transition-transform hover:scale-110 duration-300">
                            <svg className="h-full w-auto" viewBox="0 0 32 32">
                                <circle cx="16" cy="16" r="16" fill="#26A17B" />
                                <path fill="white" d="M17.9 14.5c-.1 0-.1 0 0 0-.1.1-.3.1-.4.1-.2 0-.4 0-.5-.1-.2 0-.4-.1-.6-.2-.1 0-.3-.1-.4-.2-.2-.1-.3-.2-.4-.3-.1-.1-.2-.2-.3-.3-.1-.1-.2-.2-.3-.3l-.4-.5-.3-.5-.2-.5c0-.2-.1-.3-.1-.5V10h1.5v.7h1.4V10h1.5v4.5zm-5.4 0H14v-.5h-1.5v.5zm4.4-6.3h-2.1v-.7H13c-.3 0-.6.1-.8.3-.2.2-.3.5-.3.8v.5c0 .3.1.6.3.8.2.2.5.3.8.3h1.8v.7h-2.1v.7h2.1v1.1c.3 0 .6-.1.8-.3.2-.2.3-.5.3-.8V12c0-.3-.1-.6-.3-.8-.2-.2-.5-.3-.8-.3h-1.8v-.7h2.1v-.7z" />
                            </svg>
                            <span className="font-bold text-lg md:text-xl text-gray-700 tracking-tight">USDT</span>
                        </div>

                        {/* Airtm */}
                        <div className="h-10 md:h-12 w-full flex items-center justify-center transition-transform hover:scale-110 duration-300">
                            <span className="font-black text-4xl md:text-6xl tracking-tighter text-blue-600 italic">Air<span className="text-cyan-400">tm</span></span>
                        </div>

                        {/* Litecoin */}
                        <div className="h-10 md:h-12 w-full flex items-center justify-center gap-4 transition-transform hover:scale-110 duration-300">
                            <svg className="h-full w-auto" viewBox="0 0 32 32" fill="#345D9D">
                                <circle cx="16" cy="16" r="16" />
                                <path fill="white" d="M11 23l.7-2.6h9l.8-3.1h-8.8l.7-2.8H22l.8-3.3h-8.8l.7-2.6H8l-.7 2.6H6l-.7 2.8h.7l-.7 2.6H3l-.7 2.8h.7L1.6 23h9.4z" />
                            </svg>
                            <span className="font-bold text-lg md:text-xl text-gray-700 tracking-tight">Litecoin</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
