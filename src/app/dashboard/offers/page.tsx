'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { COUNTRIES } from '@/lib/countries';

interface Offer {
    id: string;
    title: string;
    description: string;
    category: string;
    rewardPoints: number;
    userReward: number;
    countries: string[];
    difficulty: string;
    avgCompletionTime: number | null;
    conversionRate: number | null;
    isFeatured: boolean;
    isCompleted: boolean;
    thumbnailUrl: string | null;
    deviceTypes?: string[];
}

export default function OffersPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ category: '', country: '' });

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    const fetchOffers = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filter.category) params.set('category', filter.category);
            if (filter.country) params.set('country', filter.country);

            const res = await fetch(`/api/offers?${params}`);
            const data = await res.json();
            setOffers(data);
        } catch (error) {
            console.error('Failed to fetch offers:', error);
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => {
        fetchOffers();
    }, [fetchOffers]);

    const handleStartOffer = async (offerId: string) => {
        try {
            const res = await fetch('/api/offers/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ offerId }),
            });

            const data = await res.json();

            if (res.ok) {
                // Open offer in new tab
                window.open(data.trackingUrl, '_blank');
                alert('Offer started! Complete it in the new tab to earn points.');
                fetchOffers(); // Refresh to show as started
            } else {
                alert(data.error || 'Failed to start offer');
            }
        } catch (error) {
            alert('Network error. Please try again.');
        }
    };

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--background)]">
            {/* Header */}
            <header className="bg-[var(--card)] border-b border-[var(--muted)]/20">
                <div className="container mx-auto px-4 py-1 flex items-center justify-between">
                    <Link href="/dashboard" className="text-2xl font-bold text-gradient">
                        ← Dashboard
                    </Link>
                    <h1 className="text-2xl font-bold">Offer Wall</h1>
                    <div></div>
                </div>
            </header>

            <main className="container mx-auto px-2 py-1">
                {/* Filters */}
                <div className="glass-card p-2 rounded-2xl mb-2">
                    <div className="grid md:grid-cols-3 gap-2">
                        <div>
                            <label className="block text-sm font-medium mb-0">Category</label>
                            <select
                                value={filter.category}
                                onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                                className="w-full px-4 py-2 bg-[var(--card)] text-[var(--text)] border border-black/5 dark:border-white/10 rounded-lg"
                            >
                                <option value="">All Categories</option>
                                <option value="app">App Install</option>
                                <option value="survey">Survey</option>
                                <option value="email">Email Submit</option>
                                <option value="signup">Sign Up</option>
                                <option value="trial">Free Trial</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-0">Country</label>
                            <select
                                value={filter.country}
                                onChange={(e) => setFilter({ ...filter, country: e.target.value })}
                                className="w-full px-4 py-2 bg-[var(--card)] text-[var(--text)] border border-black/5 dark:border-white/10 rounded-lg"
                            >
                                <option value="">All Countries</option>
                                {COUNTRIES.map((c) => (
                                    <option key={c.code} value={c.code}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-end">
                            <button
                                onClick={() => setFilter({ category: '', country: '' })}
                                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                            >
                                Reset Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Offers Grid */}
                {offers.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-xl text-[var(--muted)]">No offers available</p>
                        <p className="text-sm text-[var(--muted)] mt-2">Try changing your filters</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                        {offers.map((offer) => {
                            const deviceTypes = offer.deviceTypes || ['desktop', 'mobile', 'tablet'];
                            const isAllDevices = deviceTypes.length >= 3;

                            return (
                                <div key={offer.id} className={`glass-card p-2 rounded-2xl shadow-sm relative overflow-hidden group flex flex-col h-full min-h-[200px] ${offer.isCompleted ? 'opacity-60 grayscale-[0.5]' : 'card-hover'}`}>
                                    {/* Image Area (Enlarged) */}
                                    <div className="relative w-full h-32 -mt-2 -mx-2 mb-2 overflow-hidden rounded-t-2xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5">
                                        {offer.thumbnailUrl ? (
                                            <Image
                                                src={offer.thumbnailUrl}
                                                alt={offer.title}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-4xl">🔥</div>
                                        )}

                                        {/* Reward Badge Overlay */}
                                        <div className="absolute top-2 right-2 font-mono font-bold text-emerald-600 bg-white/95 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-[13px] border border-emerald-500/20 shadow-md z-10">
                                            +${offer.userReward.toFixed(2)}
                                        </div>

                                        {/* Status Badge */}
                                        {offer.isFeatured && !offer.isCompleted && (
                                            <div className="absolute top-2 left-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter shadow-sm z-10">
                                                HOT
                                            </div>
                                        )}

                                        {/* Device Icons Overlay (Smart & Clean) */}
                                        <div className="absolute bottom-2 left-2 flex gap-2 text-black">
                                            {isAllDevices ? (
                                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><title>All Devices</title><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                                            ) : (
                                                <>
                                                    {deviceTypes.includes('android') && (
                                                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><title>Android</title><path d="M17.523 15.3414C17.0694 15.3414 16.6997 15.7111 16.6997 16.1647C16.6997 16.6183 17.0694 16.988 17.523 16.988C17.9766 16.988 18.3463 16.6183 18.3463 16.1647C18.3463 15.7111 17.9766 15.3414 17.523 15.3414ZM6.47702 15.3414C6.02344 15.3414 5.65373 15.7111 5.65373 16.1647C5.65373 16.6183 6.02344 16.988 6.47702 16.988C6.9306 16.988 7.30031 16.6183 7.30031 16.1647C7.30031 15.7111 6.9306 15.3414 6.47702 15.3414ZM17.9366 10.3752L19.8335 7.08775C19.9576 6.87271 19.8839 6.5975 19.6689 6.47343C19.4538 6.34937 19.1786 6.42306 19.0545 6.6381L17.1352 9.96255C15.6888 9.30232 13.9114 8.92723 12 8.92723C10.0886 8.92723 8.31118 9.30232 6.86478 9.96255L4.9455 6.6381C4.82143 6.42306 4.54622 6.34937 4.33118 6.47343C4.11613 6.5975 4.04245 6.87271 4.16652 7.08775L6.06338 10.3752C3.52227 11.7513 1.81592 14.3413 1.66699 17.3881H22.3331C22.1841 14.3413 20.4777 11.7513 17.9366 10.3752Z" /></svg>
                                                    )}
                                                    {(deviceTypes.includes('ios') || deviceTypes.includes('apple') || deviceTypes.includes('iphone')) && (
                                                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><title>Apple</title><path d="M17.05 20.28c-.96.95-2.04 1.72-3.12 1.72-1.05 0-1.46-.66-2.73-.66-1.28 0-1.74.64-2.73.64-1.12 0-2.31-.86-3.32-1.84C3.12 18.09 1.67 14.28 1.67 11.12c0-3.3 2.1-5.11 4.14-5.11 1.05 0 2.05.74 2.68.74.63 0 1.72-.81 2.92-.81 1.48 0 2.9.72 3.65 1.83-3.1 1.83-2.58 5.48.51 6.87-.7 1.78-1.58 3.54-2.52 4.54zM11.95 5.56c-.05-1.92 1.58-3.54 3.4-3.56.07 1.95-1.63 3.61-3.4 3.56z" /></svg>
                                                    )}
                                                    {(deviceTypes.includes('desktop') || deviceTypes.includes('pc') || deviceTypes.includes('windows')) && (
                                                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><title>PC</title><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Extremely Compact Text Area */}
                                    <div className="flex flex-col justify-start px-1 leading-tight">
                                        <h4 className="font-black text-[13px] line-clamp-1 text-[var(--text)] group-hover:text-indigo-600 transition-colors uppercase tracking-tight mb-0">{offer.title}</h4>
                                        <p className="text-[10px] text-[var(--text)]/60 line-clamp-1 leading-none opacity-90 group-hover:opacity-100 transition-opacity">
                                            <span className="font-bold text-indigo-500/80 mr-1 uppercase">[{offer.category || 'TASK'}]</span>
                                            {offer.description || 'Complete this task to earn reward'}
                                        </p>
                                    </div>



                                    {/* Action Button */}
                                    <div className="mt-1">
                                        <button
                                            onClick={() => handleStartOffer(offer.id)}
                                            disabled={offer.isCompleted}
                                            className={`w-full py-1 rounded-lg font-black text-[12px] uppercase tracking-wider block text-center transition-all transform hover:scale-[1.02] active:scale-[0.98] ${offer.isCompleted
                                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-900 shadow-[0_4px_12px_rgba(16,185,129,0.2)] hover:shadow-[0_6px_16px_rgba(16,185,129,0.3)] btn-reflect'
                                                }`}
                                        >
                                            {offer.isCompleted ? 'Completed' : 'Start Earning'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}
