'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface WithdrawalRequest {
    id: string;
    userId: string;
    method: string;
    amount: number;
    paymentDetails: string;
    status: string;
    requestedAt: string;
    user: {
        email: true;
        firstName: string;
        lastName: string;
    };
}

export default function AdminWithdrawalsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated' || (status === 'authenticated' && session?.user?.role !== 'ADMIN')) {
            router.push('/dashboard');
        }
    }, [status, session, router]);

    useEffect(() => {
        if (session?.user?.role === 'ADMIN') {
            fetch('/api/admin/withdrawals')
                .then(res => res.json())
                .then(data => {
                    setRequests(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Failed to fetch admin withdrawals:', err);
                    setLoading(false);
                });
        }
    }, [session]);

    const handleAction = async (id: string, status: 'COMPLETED' | 'REJECTED', notes: string = '') => {
        if (!confirm(`Are you sure you want to ${status.toLowerCase()} this request?`)) return;

        try {
            const res = await fetch('/api/admin/withdrawals', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status, adminNotes: notes })
            });

            if (res.ok) {
                // Remove from list or update local state
                setRequests(prev => prev.filter(req => req.id !== id));
                alert(`Withdrawal ${status.toLowerCase()} successfully!`);
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to update status');
            }
        } catch (err) {
            console.error(err);
            alert('Network error');
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
        <div className="min-h-screen bg-[#f8fafc] py-12 text-slate-900">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <Link href="/dashboard/admin" className="text-purple-600 hover:text-purple-500 font-semibold mb-2 inline-block">
                            ← Back to Panel
                        </Link>
                        <h1 className="text-4xl font-black">Withdrawal Requests</h1>
                        <p className="text-slate-500">Manage and process user payout requests.</p>
                    </div>
                </div>

                <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    {requests.length === 0 ? (
                        <div className="p-20 text-center">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">📭</div>
                            <h3 className="text-xl font-bold text-slate-400">No pending requests</h3>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-100">
                                        <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">User</th>
                                        <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Method</th>
                                        <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Amount</th>
                                        <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Payment Details</th>
                                        <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Date</th>
                                        <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {requests.map((request) => (
                                        <tr key={request.id} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors group">
                                            <td className="px-6 py-5">
                                                <div className="font-bold text-slate-900">{request.user.firstName} {request.user.lastName}</div>
                                                <div className="text-xs text-slate-400 font-mono">{request.user.email}</div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-600 border border-indigo-100">
                                                    {request.method}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="text-lg font-black text-emerald-600">${Number(request.amount).toFixed(2)}</div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 font-mono text-xs text-slate-600 break-all max-w-xs">
                                                    {request.paymentDetails}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="text-xs text-slate-500 font-medium">
                                                    {new Date(request.requestedAt).toLocaleDateString()}
                                                </div>
                                                <div className="text-[10px] text-slate-300 font-bold uppercase">
                                                    {new Date(request.requestedAt).toLocaleTimeString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleAction(request.id, 'COMPLETED')}
                                                        className="px-3 py-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg text-xs font-bold transition-colors"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            const reason = prompt('Reason for rejection:');
                                                            if (reason !== null) handleAction(request.id, 'REJECTED', reason);
                                                        }}
                                                        className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-bold transition-colors"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
