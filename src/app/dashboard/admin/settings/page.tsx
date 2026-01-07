'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminSettingsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [settings, setSettings] = useState({
        PAYPAL_EMAIL: '',
        BTC_WALLET: '',
        USDT_WALLET: '',
        MIN_WITHDRAWAL: '1.00',
        SITE_NAME: 'TaskSpot',
        POSTBACK_TOKEN: ''
    });

    useEffect(() => {
        if (status === 'unauthenticated' || (status === 'authenticated' && session?.user?.role !== 'ADMIN')) {
            router.push('/dashboard');
        }
    }, [status, session, router]);

    useEffect(() => {
        if (session?.user?.role === 'ADMIN') {
            fetch('/api/admin/settings')
                .then(res => res.json())
                .then(data => {
                    if (data) {
                        setSettings(prev => ({
                            ...prev,
                            ...data
                        }));
                    }
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [session]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ settings })
            });

            if (res.ok) {
                alert('Settings saved successfully!');
            } else {
                alert('Failed to save settings');
            }
        } catch (error) {
            alert('Network error');
        } finally {
            setSaving(false);
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
            <div className="container mx-auto px-4 max-w-2xl">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <Link href="/dashboard/admin" className="text-purple-600 hover:text-purple-500 font-semibold mb-2 inline-block">
                            ← Back to Panel
                        </Link>
                        <h1 className="text-4xl font-black">System Settings</h1>
                        <p className="text-slate-500">Configure global site parameters and payment details.</p>
                    </div>
                </div>

                <div className="bg-white rounded-[2rem] shadow-xl p-8 border border-slate-100">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <section>
                            <h2 className="text-lg font-black mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">💰</span>
                                Payment Details
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">PayPal Payout Email</label>
                                    <input
                                        type="email"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 outline-none"
                                        value={settings.PAYPAL_EMAIL}
                                        onChange={e => setSettings({ ...settings, PAYPAL_EMAIL: e.target.value })}
                                        placeholder="admin@example.com"
                                    />
                                    <p className="text-[10px] text-slate-400 mt-1 italic">This is the email you use to send payments from.</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">USDT Wallet Address (TRC20)</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 outline-none font-mono text-sm"
                                        value={settings.USDT_WALLET}
                                        onChange={e => setSettings({ ...settings, USDT_WALLET: e.target.value })}
                                        placeholder="TX..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Bitcoin Wallet Address</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 outline-none font-mono text-sm"
                                        value={settings.BTC_WALLET}
                                        onChange={e => setSettings({ ...settings, BTC_WALLET: e.target.value })}
                                        placeholder="bc1..."
                                    />
                                </div>
                            </div>
                        </section>

                        <div className="h-px bg-slate-100"></div>

                        <section>
                            <h2 className="text-lg font-black mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center">⚖️</span>
                                Limits & Configuration
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Minimum Withdrawal ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 outline-none font-mono"
                                        value={settings.MIN_WITHDRAWAL}
                                        onChange={e => setSettings({ ...settings, MIN_WITHDRAWAL: e.target.value })}
                                    />
                                    <p className="text-[10px] text-slate-400 mt-1 italic">Users cannot request a withdrawal below this amount.</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Brand Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 outline-none"
                                        value={settings.SITE_NAME}
                                        onChange={e => setSettings({ ...settings, SITE_NAME: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Postback Security Token</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 outline-none font-mono text-sm"
                                        value={settings.POSTBACK_TOKEN || ''}
                                        onChange={e => setSettings({ ...settings, POSTBACK_TOKEN: e.target.value })}
                                        placeholder="Generate a secret key for your postback URL"
                                    />
                                    <p className="text-[10px] text-slate-400 mt-1 italic">Protect your conversions. Your postback URL will be: `/api/postback?token=YOUR_TOKEN`</p>
                                </div>
                            </div>
                        </section>

                        <button
                            disabled={saving}
                            type="submit"
                            className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-2xl text-lg transition shadow-xl shadow-purple-200 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {saving ? 'Saving...' : 'Save Settings'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
