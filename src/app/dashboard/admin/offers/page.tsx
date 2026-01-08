'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Offer {
    id: string;
    title: string;
    payout: number;
    userReward: number;
    rewardPoints: number;
    isActive: boolean;
    cpaNetwork: string;
    category: string;
}

export default function AdminOffersPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOffers = async () => {
        try {
            const res = await fetch('/api/admin/offers');
            const data = await res.json();
            setOffers(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (status === 'authenticated' && session?.user?.role === 'ADMIN') {
            fetchOffers();
        } else if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, session]);

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            const res = await fetch('/api/admin/offers', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, isActive: !currentStatus })
            });
            if (res.ok) fetchOffers();
        } catch (error) {
            alert('Failed to update status');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this offer?')) return;
        try {
            const res = await fetch(`/api/admin/offers?id=${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                setOffers(prev => prev.filter(o => o.id !== id));
            } else {
                alert('Failed to delete');
            }
        } catch (error) {
            alert('Error deleting offer');
        }
    };

    const [showSyncModal, setShowSyncModal] = useState(false);
    const [feedUrl, setFeedUrl] = useState('');
    const [syncing, setSyncing] = useState(false);

    const handleSync = async (e: React.FormEvent) => {
        e.preventDefault();
        setSyncing(true);
        try {
            const res = await fetch('/api/offers/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: feedUrl }),
            });
            const data = await res.json();

            if (res.ok) {
                alert(data.message);
                setShowSyncModal(false);
                fetchOffers();
            } else {
                alert(data.error || 'Sync failed');
            }
        } catch (error) {
            alert('Error connecting to server');
        } finally {
            setSyncing(false);
        }
    };

    if (loading) return <div className="p-12 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-[#f8fafc] py-12 text-slate-900">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <Link href="/dashboard/admin" className="text-purple-600 hover:text-purple-500 font-semibold mb-2 inline-block">
                            ← Back to Panel
                        </Link>
                        <h1 className="text-4xl font-black">Manage Offers</h1>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setShowSyncModal(true)}
                            className="px-5 py-3 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition shadow-sm"
                        >
                            🔄 Sync Offers
                        </button>
                        <Link href="/dashboard/admin/offers/new" className="px-5 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition shadow-lg shadow-purple-200">
                            + Add New Offer
                        </Link>
                    </div>
                </div>

                <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Offer</th>
                                <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Network</th>
                                <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Payout ( You / User )</th>
                                <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400 text-center">Status</th>
                                <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {offers.map((offer) => (
                                <tr key={offer.id} className="border-b border-slate-50 hover:bg-slate-50/30 transition">
                                    <td className="px-6 py-5">
                                        <div className="font-bold text-slate-900">{offer.title}</div>
                                        <div className="text-xs text-slate-400 font-mono uppercase">{offer.category}</div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded uppercase">
                                            {offer.cpaNetwork}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="font-mono text-sm">
                                            <span className="text-emerald-600 font-bold">${Number(offer.payout).toFixed(2)}</span>
                                            <span className="text-slate-300 mx-2">/</span>
                                            <span className="text-purple-600 font-bold">${Number(offer.userReward).toFixed(2)}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <button
                                            onClick={() => handleToggleStatus(offer.id, offer.isActive)}
                                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide border ${offer.isActive
                                                ? 'bg-green-50 text-green-600 border-green-200'
                                                : 'bg-slate-50 text-slate-400 border-slate-200'
                                                }`}
                                        >
                                            {offer.isActive ? 'Active' : 'Inactive'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <button
                                            onClick={() => handleDelete(offer.id)}
                                            className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition"
                                            title="Delete Offer"
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Sync Modal */}
            {showSyncModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slide-up">
                        <h2 className="text-2xl font-bold mb-4">Sync External Offers</h2>
                        <p className="text-slate-500 mb-6 text-sm">
                            Enter the JSON feed URL from your CPA network (CPAGrip, CPALead, AdGate, etc.). The system will automatically map the offers.
                        </p>
                        <form onSubmit={handleSync}>
                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Feed URL</label>
                                <input
                                    type="url"
                                    required
                                    placeholder="https://www.cpagrip.com/common/offer_feed_json.php?..."
                                    value={feedUrl}
                                    onChange={(e) => setFeedUrl(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowSyncModal(false)}
                                    className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-lg transition"
                                    disabled={syncing}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={syncing}
                                    className="px-4 py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
                                >
                                    {syncing ? 'Syncing...' : 'Start Sync'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
