'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Copy,
    MapPin,
    Ticket,
    Shield,
    DollarSign,
    UserCog,
    X,
    Phone,
    CheckCircle2,
    AlertTriangle,
    Search,
    RefreshCw
} from 'lucide-react';

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
    countryCode: string | null;
    referralCode: string | null;
    phone: string | null;
}

export default function AdminUsersPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [adjustLoading, setAdjustLoading] = useState(false);

    // Modal Form State
    const [adjustValue, setAdjustValue] = useState<number>(0);
    const [adjustAction, setAdjustAction] = useState<'BALANCE_UPDATE' | 'FRAUD_UPDATE' | 'ROLE_UPDATE'>('BALANCE_UPDATE');
    const [adjustRole, setAdjustRole] = useState<'USER' | 'ADMIN'>('USER');

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

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    };

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

    const openAdjustModal = (user: User) => {
        setSelectedUser(user);
        setAdjustValue(0);
        setAdjustAction('BALANCE_UPDATE');
        setAdjustRole(user.role as any);
        setModalOpen(true);
    };

    const handleAdjustment = async () => {
        if (!selectedUser) return;
        setAdjustLoading(true);

        try {
            let value: any = adjustValue;
            if (adjustAction === 'ROLE_UPDATE') value = adjustRole;

            const res = await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: selectedUser.id, action: adjustAction, value })
            });

            if (res.ok) {
                alert('Updated successfully!');
                setModalOpen(false);
                fetchUsers();
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to update');
            }
        } catch (error) {
            alert('Network error');
        } finally {
            setAdjustLoading(false);
        }
    };

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
                <div className="flex flex-col items-center gap-4">
                    <RefreshCw className="w-12 h-12 text-purple-600 animate-spin" />
                    <p className="text-slate-500 font-bold">Loading users...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] py-12 text-slate-900 pb-32">
            <div className="container mx-auto px-4 max-w-[95%]">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                    <div>
                        <Link href="/dashboard/admin" className="text-purple-600 hover:text-purple-500 font-bold mb-2 inline-flex items-center gap-2 group">
                            <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Panel
                        </Link>
                        <h1 className="text-5xl font-black tracking-tight text-slate-900">User Management</h1>
                        <p className="text-slate-500 mt-2 text-lg">Detailed view and controls for all platform participants.</p>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-grow md:w-96">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by name, email or ID..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-purple-500 focus:outline-none shadow-sm transition-all text-lg"
                            />
                        </div>
                        <button
                            onClick={() => fetchUsers()}
                            className="p-4 bg-white border-2 border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors shadow-sm"
                        >
                            <RefreshCw className="w-6 h-6 text-slate-600" />
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto overflow-y-visible">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/80 border-b border-slate-100">
                                    <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-slate-400">User Info</th>
                                    <th className="px-6 py-6 text-xs font-black uppercase tracking-widest text-slate-400">Identity</th>
                                    <th className="px-6 py-6 text-xs font-black uppercase tracking-widest text-slate-400">Stats & Balance</th>
                                    <th className="px-6 py-6 text-xs font-black uppercase tracking-widest text-slate-400">Security</th>
                                    <th className="px-6 py-6 text-xs font-black uppercase tracking-widest text-slate-400">Status</th>
                                    <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-slate-400 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-all group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white shadow-lg ${user.role === 'ADMIN' ? 'bg-gradient-to-br from-purple-600 to-indigo-700' : 'bg-gradient-to-br from-slate-700 to-slate-900'}`}>
                                                    {user.firstName?.[0]?.toUpperCase() || 'U'}
                                                </div>
                                                <div>
                                                    <div className="font-black text-slate-900 text-lg flex items-center gap-2">
                                                        {user.firstName} {user.lastName || ''}
                                                        {user.role === 'ADMIN' && (
                                                            <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full border border-purple-200 uppercase tracking-tighter shadow-sm">Admin</span>
                                                        )}
                                                    </div>
                                                    <div className="text-sm text-slate-400 flex items-center gap-1.5 font-medium">
                                                        {user.email}
                                                        <button onClick={() => handleCopy(user.email)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-200 rounded text-slate-500">
                                                            <Copy size={12} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-6">
                                            <div className="space-y-1.5 grayscale group-hover:grayscale-0 transition-all">
                                                <div className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded inline-flex items-center gap-1.5 cursor-pointer hover:bg-slate-200 transition-colors" onClick={() => handleCopy(user.id)}>
                                                    <Ticket size={10} /> {user.id.slice(0, 8)}...
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-1 text-xs font-bold text-slate-600">
                                                        <MapPin size={12} className="text-red-500" /> {user.countryCode || 'N/A'}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-xs font-bold text-slate-600">
                                                        <UserCog size={12} className="text-blue-500" /> {user.referralCode || 'N/A'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-6">
                                            <div className="space-y-1">
                                                <div className="text-lg font-black text-emerald-600 flex items-center gap-1">
                                                    <DollarSign size={16} />{Number(user.availableBalance).toFixed(2)}
                                                </div>
                                                <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                                                    Total: <span className="text-slate-600 font-bold">${Number(user.totalEarned).toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-2">
                                                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black shadow-sm border ${user.fraudScore > 50 ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                                                    <Shield size={12} /> {user.fraudScore}
                                                </div>
                                                {user.phone && (
                                                    <div className="p-1.5 bg-slate-100 text-slate-500 rounded-lg hover:text-slate-700 transition-colors" title={user.phone}>
                                                        <Phone size={14} />
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        <td className="px-6 py-6">
                                            <span className={`inline-flex items-center px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border shadow-sm transition-all ${user.status === 'ACTIVE'
                                                    ? 'bg-green-100 text-green-700 border-green-200'
                                                    : user.status === 'BANNED'
                                                        ? 'bg-red-100 text-red-700 border-red-200'
                                                        : 'bg-slate-100 text-slate-500 border-slate-200'
                                                }`}>
                                                {user.status === 'ACTIVE' ? <CheckCircle2 size={10} className="mr-1.5" /> : <AlertTriangle size={10} className="mr-1.5" />}
                                                {user.status}
                                            </span>
                                        </td>

                                        <td className="px-8 py-6 text-center">
                                            <div className="flex items-center justify-center gap-3">
                                                <button
                                                    onClick={() => openAdjustModal(user)}
                                                    className="px-5 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl text-xs font-black transition-all shadow-md active:scale-95 flex items-center gap-2"
                                                >
                                                    <UserCog size={14} /> Adjust
                                                </button>
                                                {user.role !== 'ADMIN' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(user.id, user.status)}
                                                        className={`p-2.5 rounded-xl transition-all shadow-sm border active:scale-95 ${user.status === 'ACTIVE'
                                                                ? 'bg-white text-red-600 border-red-100 hover:bg-red-50'
                                                                : 'bg-green-600 text-white border-green-700 hover:bg-green-700'
                                                            }`}
                                                        title={user.status === 'ACTIVE' ? 'Ban User' : 'Unban User'}
                                                    >
                                                        {user.status === 'ACTIVE' ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
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

                {/* Adjustment Modal */}
                {modalOpen && selectedUser && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-all duration-300">
                        <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-white/20 animate-in fade-in zoom-in duration-200">
                            {/* Header */}
                            <div className="px-10 py-8 bg-gradient-to-br from-indigo-600 to-purple-800 text-white relative">
                                <button
                                    onClick={() => setModalOpen(false)}
                                    className="absolute right-6 top-6 p-2 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <X size={24} />
                                </button>
                                <div className="flex gap-4 items-center">
                                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center font-black text-2xl backdrop-blur-md">
                                        {selectedUser.firstName?.[0]?.toUpperCase()}
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black">{selectedUser.firstName} {selectedUser.lastName}</h2>
                                        <p className="opacity-70 font-bold">{selectedUser.email}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="p-10 space-y-8">
                                <div className="grid grid-cols-3 gap-4">
                                    <button
                                        onClick={() => setAdjustAction('BALANCE_UPDATE')}
                                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${adjustAction === 'BALANCE_UPDATE' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 text-slate-500 hover:bg-slate-50'}`}
                                    >
                                        <DollarSign size={20} />
                                        <span className="text-[10px] font-black uppercase tracking-wider">Balance</span>
                                    </button>
                                    <button
                                        onClick={() => setAdjustAction('FRAUD_UPDATE')}
                                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${adjustAction === 'FRAUD_UPDATE' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 text-slate-500 hover:bg-slate-50'}`}
                                    >
                                        <Shield size={20} />
                                        <span className="text-[10px] font-black uppercase tracking-wider">Fraud</span>
                                    </button>
                                    <button
                                        onClick={() => setAdjustAction('ROLE_UPDATE')}
                                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${adjustAction === 'ROLE_UPDATE' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 text-slate-500 hover:bg-slate-50'}`}
                                    >
                                        <UserCog size={20} />
                                        <span className="text-[10px] font-black uppercase tracking-wider">Role</span>
                                    </button>
                                </div>

                                {adjustAction === 'ROLE_UPDATE' ? (
                                    <div className="space-y-4">
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-400">Select Role</label>
                                        <select
                                            value={adjustRole}
                                            onChange={(e) => setAdjustRole(e.target.value as any)}
                                            className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-600 focus:outline-none font-bold"
                                        >
                                            <option value="USER">Standard User</option>
                                            <option value="ADMIN">Administrator</option>
                                        </select>
                                        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
                                            <AlertTriangle className="text-amber-500 shrink-0" size={20} />
                                            <p className="text-xs text-amber-900 font-bold leading-relaxed">
                                                Caution: Promoting a user to ADMIN gives them full control over the platform.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-400">
                                            {adjustAction === 'BALANCE_UPDATE' ? 'Adjustment Amount ($)' : 'New Fraud Score (0-100)'}
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black">
                                                {adjustAction === 'BALANCE_UPDATE' ? '+' : ''}
                                            </div>
                                            <input
                                                type="number"
                                                value={adjustValue}
                                                onChange={(e) => setAdjustValue(Number(e.target.value))}
                                                className="w-full pl-10 pr-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-600 focus:outline-none font-black text-2xl"
                                                placeholder="0.00"
                                            />
                                        </div>
                                        <p className="text-xs text-slate-500 font-bold italic">
                                            {adjustAction === 'BALANCE_UPDATE'
                                                ? 'Positive values add to balance, negative values deduct.'
                                                : 'A fraud score of 100 is maximum risk. 0 is normal.'}
                                        </p>
                                    </div>
                                )}

                                <div className="flex gap-4 pt-4">
                                    <button
                                        onClick={() => setModalOpen(false)}
                                        className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black tracking-widest uppercase text-xs hover:bg-slate-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleAdjustment}
                                        disabled={adjustLoading}
                                        className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black tracking-widest uppercase text-xs hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {adjustLoading ? 'Updating...' : 'Save Changes'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
