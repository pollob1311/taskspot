'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/dashboard" className="text-2xl font-bold text-gradient">
                        ← Dashboard
                    </Link>
                    <h1 className="text-2xl font-bold">Offer Wall</h1>
                    <div></div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                {/* Filters */}
                <div className="glass-card p-6 rounded-2xl mb-8">
                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Category</label>
                            <select
                                value={filter.category}
                                onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                                className="w-full px-4 py-2 bg-[var(--card)] border border-[var(--muted)]/20 rounded-lg"
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
                            <label className="block text-sm font-medium mb-2">Country</label>
                            <select
                                value={filter.country}
                                onChange={(e) => setFilter({ ...filter, country: e.target.value })}
                                className="w-full px-4 py-2 bg-[var(--card)] border border-[var(--muted)]/20 rounded-lg"
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
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {offers.map((offer) => (
                            <div
                                key={offer.id}
                                className={`glass-card p-6 rounded-2xl ${offer.isCompleted ? 'opacity-60' : 'card-hover'
                                    }`}
                            >
                                {/* Badges */}
                                <div className="flex gap-2 mb-4">
                                    {offer.isFeatured && (
                                        <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold rounded-full">
                                            🔥 HOT
                                        </span>
                                    )}
                                    {offer.difficulty === 'EASY' && (
                                        <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full">
                                            ✅ Easy
                                        </span>
                                    )}
                                    {offer.isCompleted && (
                                        <span className="px-3 py-1 bg-gray-500/20 text-gray-400 text-xs font-semibold rounded-full">
                                            Completed
                                        </span>
                                    )}
                                </div>

                                {/* Title */}
                                <h3 className="text-lg font-semibold mb-2">{offer.title}</h3>

                                {/* Description */}
                                <p className="text-sm text-[var(--muted)] mb-4 line-clamp-2">
                                    {offer.description || 'Complete this offer to earn points'}
                                </p>

                                {/* Stats */}
                                <div className="space-y-2 mb-4 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-[var(--muted)]">Reward:</span>
                                        <span className="font-mono font-semibold text-green-500">
                                            {offer.rewardPoints} points (${offer.userReward.toFixed(2)})
                                        </span>
                                    </div>

                                    {offer.avgCompletionTime && (
                                        <div className="flex justify-between">
                                            <span className="text-[var(--muted)]">Avg. Time:</span>
                                            <span>{offer.avgCompletionTime} min</span>
                                        </div>
                                    )}

                                    {offer.conversionRate && (
                                        <div className="flex justify-between">
                                            <span className="text-[var(--muted)]">Success Rate:</span>
                                            <span className="text-green-500">
                                                {offer.conversionRate}%
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex justify-between">
                                        <span className="text-[var(--muted)]">Countries:</span>
                                        <span>{offer.countries.join(', ')}</span>
                                    </div>
                                </div>

                                {/* Action Button */}
                                <button
                                    onClick={() => handleStartOffer(offer.id)}
                                    disabled={offer.isCompleted}
                                    className={`w-full py-3 rounded-lg font-semibold transition ${offer.isCompleted
                                        ? 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
                                        : 'btn-gradient'
                                        }`}
                                >
                                    {offer.isCompleted ? 'Already Completed' : 'Start Offer'}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
