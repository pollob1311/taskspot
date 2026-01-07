'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewOfferPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'task',
        payout: 0,
        difficulty: 'MEDIUM',
        thumbnailUrl: '',
        countries: 'Global' // Comma separated string for input
    });

    if (status === 'loading') return <div>Loading...</div>;
    if (status === 'unauthenticated' || (status === 'authenticated' && session?.user?.role !== 'ADMIN')) {
        router.push('/dashboard');
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const countryList = formData.countries.split(',').map(c => c.trim());
        const userReward = formData.payout * 0.40; // 40% share
        const rewardPoints = Math.floor(userReward * 100); // 1 point = $0.01

        try {
            const res = await fetch('/api/admin/offers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    countries: countryList,
                    userReward,
                    rewardPoints
                })
            });

            if (res.ok) {
                router.push('/dashboard/admin/offers');
            } else {
                alert('Failed to create offer');
            }
        } catch (error) {
            alert('Network error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] py-12 text-slate-900">
            <div className="container mx-auto px-4 max-w-2xl">
                <Link href="/dashboard/admin/offers" className="text-purple-600 font-bold mb-8 inline-block hover:underline">
                    ← Back to Offers
                </Link>

                <div className="bg-white rounded-[2rem] shadow-xl p-8 border border-slate-100">
                    <h1 className="text-3xl font-black mb-6">Add New Offer</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Title</label>
                            <input
                                required
                                type="text"
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-purple-500 outline-none"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g. Install TikTok"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                            <textarea
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-purple-500 outline-none h-32"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Instructions for the user..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Payout (Your Revenue)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-3 text-slate-400">$</span>
                                    <input
                                        required
                                        type="number"
                                        step="0.01"
                                        className="w-full pl-8 pr-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-purple-500 outline-none font-mono"
                                        value={formData.payout}
                                        onChange={e => setFormData({ ...formData, payout: parseFloat(e.target.value) })}
                                    />
                                </div>
                                <p className="text-xs text-slate-400 mt-1">User gets 40% (${(formData.payout * 0.4).toFixed(2)})</p>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                                <select
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 outline-none"
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option value="task">General Task</option>
                                    <option value="app">App Install</option>
                                    <option value="survey">Survey</option>
                                    <option value="signup">Sign Up</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Countries (Comma Separated)</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 outline-none"
                                value={formData.countries}
                                onChange={e => setFormData({ ...formData, countries: e.target.value })}
                                placeholder="US, UK, CA (or 'Global')"
                            />
                        </div>

                        <button
                            disabled={submitting}
                            type="submit"
                            className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-xl text-lg transition shadow-lg shadow-purple-200 disabled:opacity-50"
                        >
                            {submitting ? 'Creating...' : 'Create Offer'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
