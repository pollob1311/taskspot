'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    role: string;
    status: string;
    totalEarned: number;
    availableBalance: number;
    fraudScore: number;
    createdAt: string;
    lastLoginAt: string | null;
}

export default function AdminUsersPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchUsers = useCallback(async () => {
        try {
            const params = new URLSearchParams();
            if (search) params.set('q', search);

            const res = await fetch(`/api/admin/users?${params}`);
            const data = await res.json();
            setUsers(data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch users:', error);
            setLoading(false);
        }
    }, [search]);

    // Debounce Search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers();
        }, 500);
        return () => clearTimeout(timer);
    }, [search, fetchUsers]);

    useEffect(() => {
        if (status === 'unauthenticated' || (status === 'authenticated' && session?.user?.role !== 'ADMIN')) {
            router.push('/dashboard');
        }
    }, [status, session, router]);

    const handleStatusUpdate = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'ACTIVE' ? 'BANNED' : 'ACTIVE';
        if (!confirm(`Are you sure you want to change status to ${newStatus}?`)) return;

        try {
            const res = await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, action: 'STATUS_UPDATE', value: newStatus })
            });

            if (res.ok) {
                fetchUsers();
            } else {
                alert('Failed to update status');
            }
        } catch (error) {
            alert('Network error');
        }
    };

    const handleBalanceUpdate = async (id: string) => {
        const amountStr = prompt('Enter amount to ADD (positive) or DEDUCT (negative):');
        if (!amountStr) return;

        const amount = parseFloat(amountStr);
        if (isNaN(amount)) {
            alert('Invalid amount');
            return;
        }

        try {
            const res = await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, action: 'BALANCE_UPDATE', value: amount })
            });

            if (res.ok) {
                alert('Balance updated successfully!');
                fetchUsers();
            } else {
                alert('Failed to update balance');
            }
        } catch (error) {
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
                        <h1 className="text-4xl font-black">User Management</h1>
                        <p className="text-slate-500">View users, manage access, and adjust balances.</p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full md:w-96 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
                    />
                </div>

                <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">User</th>
                                    <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Status</th>
                                    <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Balance</th>
                                    <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Total Earned</th>
                                    <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Joined</th>
                                    <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="font-bold text-slate-900">{user.firstName} {user.lastName || ''}</div>
                                            <div className="text-xs text-slate-400 font-mono">{user.email}</div>
                                            {user.role === 'ADMIN' && <span className="text-[10px] bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded ml-2 font-bold">ADMIN</span>}
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${user.status === 'ACTIVE' ? 'bg-green-50 text-green-600 border-green-100' :
                                                    user.status === 'BANNED' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="text-sm font-black text-slate-700">${Number(user.availableBalance).toFixed(2)}</div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="text-sm font-medium text-slate-500">${Number(user.totalEarned).toFixed(2)}</div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="text-xs text-slate-500 font-medium">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleBalanceUpdate(user.id)}
                                                    className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors"
                                                    title="Adjust Balance"
                                                >
                                                    💲 Adjust
                                                </button>
                                                {user.role !== 'ADMIN' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(user.id, user.status)}
                                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${user.status === 'ACTIVE'
                                                                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                                                : 'bg-green-50 text-green-600 hover:bg-green-100'
                                                            }`}
                                                    >
                                                        {user.status === 'ACTIVE' ? 'Ban' : 'Unban'}
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
