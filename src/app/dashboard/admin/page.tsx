'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface AdminStats {
    totalUsers: number;
    newUsersToday: number;
    pendingWithdrawals: number;
    totalPayoutPending: number;
    activeOffers: number;
    totalCompletedOffers: number;
}

export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
            router.push('/dashboard');
        }
    }, [status, session, router]);

    useEffect(() => {
        if (session?.user?.role === 'ADMIN') {
            fetch('/api/admin/stats')
                .then(res => res.json())
                .then(data => {
                    if (data.stats) {
                        setStats(data.stats);
                    }
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [session]);

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">🛡️</span>
                        <h1 className="text-xl font-black tracking-tight text-slate-800">Admin Panel</h1>
                    </div>
                    <Link href="/dashboard" className="text-sm font-bold text-slate-500 hover:text-purple-600 transition-colors">
                        Exit to Dashboard →
                    </Link>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <StatsCard
                        title="Total Users"
                        value={stats?.totalUsers || 0}
                        sub={`${stats?.newUsersToday || 0} new today`}
                        icon="👥"
                        color="bg-blue-50 text-blue-600"
                    />
                    <StatsCard
                        title="Pending Withdrawals"
                        value={stats?.pendingWithdrawals || 0}
                        sub={`$${stats?.totalPayoutPending.toFixed(2)} total`}
                        icon="💸"
                        color="bg-orange-50 text-orange-600"
                    />
                    <StatsCard
                        title="Active Offers"
                        value={stats?.activeOffers || 0}
                        sub="Live details"
                        icon="⚡"
                        color="bg-green-50 text-green-600"
                    />
                    <StatsCard
                        title="Completed Tasks"
                        value={stats?.totalCompletedOffers || 0}
                        sub="All time"
                        icon="✅"
                        color="bg-purple-50 text-purple-600"
                    />
                </div>

                {/* Management Sections */}
                <h2 className="text-lg font-black text-slate-800 mb-4 px-1">Management</h2>
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    <ManagementCard
                        title="Withdrawals"
                        description="Review and process user payout requests."
                        icon="💰"
                        href="/dashboard/admin/withdrawals"
                        action="Review Requests"
                        alert={stats && stats.pendingWithdrawals > 0 ? `${stats.pendingWithdrawals} Pending` : undefined}
                    />
                    <ManagementCard
                        title="Users"
                        description="Manage users, balances, and bans."
                        icon="👤"
                        href="/dashboard/admin/users"
                        action="Manage Users"
                    />
                    <ManagementCard
                        title="Offers"
                        description="Add new tasks and manage existing ones."
                        icon="📋"
                        href="/dashboard/admin/offers"
                        action="Manage Offers"
                    />
                    <ManagementCard
                        title="Settings"
                        description="Configure payments and site limits."
                        icon="⚙️"
                        href="/dashboard/admin/settings"
                        action="Site Settings"
                    />
                    <ManagementCard
                        title="Postbacks"
                        description="Monitor automated earnings & conversion pings."
                        icon="📡"
                        href="/dashboard/admin/postbacks"
                        action="Postback Logs"
                    />
                </div>
            </main>
        </div>
    );
}

function StatsCard({ title, value, sub, icon, color }: { title: string, value: string | number, sub: string, icon: string, color: string }) {
    return (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center hover:scale-[1.02] transition-transform">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl mb-3 ${color}`}>
                {icon}
            </div>
            <div className="text-2xl font-black text-slate-800 mb-1">{value}</div>
            <div className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-1">{title}</div>
            <div className="text-[10px] font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">{sub}</div>
        </div>
    );
}

function ManagementCard({ title, description, icon, href, action, alert }: { title: string, description: string, icon: string, href: string, action: string, alert?: string }) {
    return (
        <Link href={href} className="bg-white p-6 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 group hover:border-purple-200 transition-all hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-6xl rotate-12 scale-150 pointer-events-none">
                {icon}
            </div>

            <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-purple-50 group-hover:scale-110 transition-all">
                    {icon}
                </div>
                {alert && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-pulse">
                        {alert}
                    </span>
                )}
            </div>

            <h3 className="text-xl font-black text-slate-800 mb-2">{title}</h3>
            <p className="text-sm text-slate-500 mb-6 font-medium leading-relaxed">
                {description}
            </p>

            <div className="flex items-center text-purple-600 font-bold text-sm group-hover:gap-2 transition-all">
                {action} <span>→</span>
            </div>
        </Link>
    );
}
