'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface PostbackLog {
    id: string;
    network: string;
    subId: string | null;
    payout: string | null;
    status: string;
    rawParams: any;
    errorMessage: string | null;
    ipAddress: string | null;
    createdAt: string;
}

export default function AdminPostbacksPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [logs, setLogs] = useState<PostbackLog[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchLogs = async () => {
        try {
            const res = await fetch('/api/admin/postbacks');
            const data = await res.json();
            setLogs(data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch logs:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (status === 'unauthenticated' || (status === 'authenticated' && session?.user?.role !== 'ADMIN')) {
            router.push('/dashboard');
        }
    }, [status, session, router]);

    useEffect(() => {
        if (session?.user?.role === 'ADMIN') {
            fetchLogs();
            const interval = setInterval(fetchLogs, 10000); // Auto refresh every 10s
            return () => clearInterval(interval);
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
        <div className="min-h-screen bg-[#f8fafc] py-12 text-slate-900">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <Link href="/dashboard/admin" className="text-purple-600 hover:text-purple-500 font-semibold mb-2 inline-block">
                            ← Back to Panel
                        </Link>
                        <h1 className="text-4xl font-black">Postback Logs</h1>
                        <p className="text-slate-500">Monitor incoming conversion notifications from networks.</p>
                    </div>
                    <button
                        onClick={fetchLogs}
                        className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold shadow-sm hover:bg-slate-50 transition"
                    >
                        🔄 Refresh
                    </button>
                </div>

                <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Time</th>
                                    <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Network</th>
                                    <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Tracking ID (subId)</th>
                                    <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Payout</th>
                                    <th className="px-6 py-5 text-[11px) font-black uppercase tracking-widest text-slate-400">Status</th>
                                    <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Detail</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map((log) => (
                                    <tr key={log.id} className="border-b border-slate-50 hover:bg-slate-50/30 transition">
                                        <td className="px-6 py-5">
                                            <div className="text-xs text-slate-500 font-medium">
                                                {new Date(log.createdAt).toLocaleDateString()}
                                            </div>
                                            <div className="text-[10px] text-slate-300 font-bold uppercase">
                                                {new Date(log.createdAt).toLocaleTimeString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-xs font-black uppercase text-slate-700">{log.network}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="text-xs font-mono text-slate-400 max-w-[120px] truncate" title={log.subId || ''}>
                                                {log.subId || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="text-sm font-black text-emerald-600">
                                                ${parseFloat(log.payout || '0').toFixed(2)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${log.status === 'SUCCESS' ? 'bg-green-50 text-green-600 border-green-100' :
                                                    log.status === 'FAILED' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                                                }`}>
                                                {log.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 font-medium text-xs text-slate-500">
                                            {log.status === 'FAILED' ? (
                                                <span className="text-red-400">{log.errorMessage}</span>
                                            ) : (
                                                <span className="text-slate-400 italic">Conversion successful</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {logs.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-20 text-center">
                                            <div className="text-3xl mb-3">📡</div>
                                            <p className="text-slate-400 font-bold">Waiting for incoming postbacks...</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
