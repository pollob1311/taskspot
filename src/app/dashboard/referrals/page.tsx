'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface ReferralStats {
    referralCode: string | null;
    totalReferrals: number;
    referralEarnings: number;
}

export default function ReferralsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [stats, setStats] = useState<ReferralStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    useEffect(() => {
        if (session?.user) {
            fetch('/api/user/profile')
                .then(res => res.json())
                .then(data => {
                    setStats({
                        referralCode: data.referralCode,
                        totalReferrals: data.totalReferrals,
                        referralEarnings: data.referralEarnings,
                    });
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Failed to fetch referral stats:', err);
                    setLoading(false);
                });
        }
    }, [session]);

    const copyReferralLink = () => {
        if (stats?.referralCode) {
            const baseUrl = window.location.origin;
            const referralUrl = `${baseUrl}/register?ref=${stats.referralCode}`;
            navigator.clipboard.writeText(referralUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    const referralCode = stats?.referralCode || "N/A";

    return (
        <div className="min-h-screen bg-[var(--background)] py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <Link href="/dashboard" className="text-purple-600 hover:text-purple-500 font-semibold mb-8 inline-block">
                    ← Back to Dashboard
                </Link>

                <h1 className="text-4xl font-bold mb-8">Refer Friends</h1>

                <div className="glass-card p-8 rounded-2xl mb-8 text-center bg-gradient-to-br from-purple-500/5 to-blue-500/5 border border-white/40 shadow-xl">
                    <h2 className="text-2xl font-bold mb-4">Earn 20% Commission for Life!</h2>
                    <p className="text-[var(--muted)] mb-8 max-w-xl mx-auto">
                        Share your unique referral link with friends and followers.
                        You&apos;ll earn 20% of whatever they earn, forever.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <div className="bg-white/80 backdrop-blur-sm border border-dashed border-purple-500 px-6 py-3 rounded-xl font-mono font-bold text-xl text-purple-700 shadow-inner">
                            {referralCode}
                        </div>
                        <button
                            onClick={copyReferralLink}
                            disabled={!stats?.referralCode}
                            className={`min-w-[160px] px-8 py-3 rounded-xl font-bold transition-all duration-300 transform active:scale-95 shadow-lg ${copied
                                    ? 'bg-emerald-500 text-white shadow-emerald-200'
                                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90 shadow-purple-200'
                                }`}
                        >
                            {copied ? '✓ Link Copied' : 'Copy referral Link'}
                        </button>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="glass-card p-8 rounded-3xl text-center bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 flex items-center justify-center bg-indigo-50 rounded-2xl text-2xl mx-auto mb-4">👥</div>
                        <div className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Referrals</div>
                        <div className="text-3xl font-black text-slate-900">{stats?.totalReferrals || 0}</div>
                    </div>
                    <div className="glass-card p-8 rounded-3xl text-center bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 flex items-center justify-center bg-emerald-50 rounded-2xl text-2xl mx-auto mb-4">💰</div>
                        <div className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1">Referral Earnings</div>
                        <div className="text-3xl font-black text-emerald-600">${(stats?.referralEarnings || 0).toFixed(2)}</div>
                    </div>
                    <div className="glass-card p-8 rounded-3xl text-center bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 flex items-center justify-center bg-purple-50 rounded-2xl text-2xl mx-auto mb-4">📈</div>
                        <div className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1">Conversion Rate</div>
                        <div className="text-3xl font-black text-purple-600">0%</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
