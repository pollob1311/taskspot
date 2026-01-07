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
                    <Link href="/dashboard/admin/offers/new" className="px-5 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition shadow-lg shadow-purple-200">
                        + Add New Offer
                    </Link>
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
        </div>
    );
}
