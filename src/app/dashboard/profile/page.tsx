'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { COUNTRIES } from '@/lib/countries';

interface UserProfile {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    countryCode: string | null;
    avatarUrl: string | null;
    referralCode: string | null;
    totalEarned: number;
    availableBalance: number;
    pendingBalance: number;
    createdAt: string;
    status: string;
}

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    useEffect(() => {
        if (session?.user) {
            fetch('/api/user/profile')
                .then(res => res.json())
                .then(data => {
                    setProfile(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Failed to fetch profile:', err);
                    setLoading(false);
                });
        }
    }, [session]);

    const copyReferralLink = () => {
        if (profile?.referralCode) {
            const baseUrl = window.location.origin;
            const referralUrl = `${baseUrl}/register?ref=${profile.referralCode}`;
            navigator.clipboard.writeText(referralUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-800">Profile not found</h2>
                    <p className="text-slate-500 mt-2">There was an error loading your profile.</p>
                    <Link href="/dashboard" className="text-indigo-600 font-bold mt-4 inline-block">Back to Dashboard</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            {/* Nav Header */}
            <div className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center gap-2 text-indigo-600 font-bold hover:opacity-80 transition-opacity">
                        <span className="text-xl">←</span> Back to Dashboard
                    </Link>
                    <h1 className="text-lg font-black text-slate-900 tracking-tight">Your Profile</h1>
                    <div className="w-24"></div> {/* Spacer for symmetry */}
                </div>
            </div>

            <main className="container mx-auto px-4 py-12 max-w-4xl">
                {/* Profile Header Card */}
                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 mb-8 relative overflow-hidden">
                    {/* Decorative Background Element */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 opacity-50"></div>

                    <div className="relative flex flex-col md:flex-row items-center gap-8">
                        <div className="w-32 h-32 bg-indigo-100 rounded-[2rem] flex items-center justify-center text-4xl border-4 border-white shadow-xl relative overflow-hidden">
                            {profile.avatarUrl ? (
                                <Image src={profile.avatarUrl} alt="Avatar" fill className="object-cover rounded-[2rem]" />
                            ) : (
                                <span>👤</span>
                            )}
                        </div>
                        <div className="text-center md:text-left">
                            <h2 className="text-3xl font-black text-slate-900 mb-1">
                                {profile.firstName} {profile.lastName || ''}
                            </h2>
                            <p className="text-slate-500 font-medium mb-4">{profile.email}</p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                <span className="px-4 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-black rounded-full uppercase tracking-wider border border-indigo-100/50">
                                    {profile.status} Member
                                </span>
                                <span className="px-4 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-black rounded-full uppercase tracking-wider border border-emerald-100/50">
                                    Member since {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => signOut()}
                            className="md:ml-auto px-6 py-3 bg-red-50 text-red-600 font-black rounded-2xl hover:bg-red-100 transition-all active:scale-95 border border-red-100"
                        >
                            Log Out
                        </button>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Account Details */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 h-full">
                            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 flex items-center justify-center bg-indigo-50 rounded-lg text-sm">📋</span>
                                Account Details
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 block mb-1">Full Name</label>
                                    <p className="text-slate-900 font-bold">{profile.firstName} {profile.lastName || '-'} </p>
                                </div>
                                <div>
                                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 block mb-1">Email Address</label>
                                    <p className="text-slate-900 font-bold">{profile.email}</p>
                                </div>
                                <div>
                                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 block mb-1">Phone Number</label>
                                    <p className="text-slate-900 font-bold">{profile.phone || 'Not linked'}</p>
                                </div>
                                <div>
                                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 block mb-1">Country</label>
                                    <p className="text-slate-900 font-bold flex items-center gap-2">
                                        <span className="text-lg">🌍</span> {COUNTRIES.find(c => c.code === profile.countryCode)?.name || profile.countryCode || 'Not set'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Earnings & Referrals */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 flex items-center justify-center bg-emerald-50 rounded-lg text-sm">💰</span>
                                Earnings Overview
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">Total Earned</label>
                                    <p className="text-xl font-black text-slate-900">${profile.totalEarned.toFixed(2)}</p>
                                </div>
                                <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-emerald-600 block mb-1">Available</label>
                                    <p className="text-xl font-black text-emerald-700">${profile.availableBalance.toFixed(2)}</p>
                                </div>
                                <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-amber-600 block mb-1">Pending</label>
                                    <p className="text-xl font-black text-amber-700">${profile.pendingBalance.toFixed(2)}</p>
                                </div>
                                <Link href="/dashboard/withdraw" className="p-6 bg-indigo-600 rounded-3xl border border-indigo-700 flex items-center justify-center text-white font-black hover:bg-indigo-700 transition-all group text-xl shadow-lg hover:scale-[1.02] active:scale-[0.98]">
                                    Withdraw <span className="ml-3 group-hover:translate-x-1.5 transition-transform text-2xl">→</span>
                                </Link>
                            </div>
                        </div>

                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 flex items-center justify-center bg-purple-50 rounded-lg text-sm">🔗</span>
                                Referral Link
                            </h3>
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-4">
                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">Your Referral Code</label>
                                <div className="flex items-center justify-between">
                                    <p className="font-mono font-black text-purple-600 text-lg">{profile.referralCode || 'N/A'}</p>
                                    <button
                                        onClick={copyReferralLink}
                                        className={`text-xs font-black transition-colors ${copied ? 'text-emerald-500' : 'text-indigo-600 hover:text-indigo-800'}`}
                                    >
                                        {copied ? '✓ Copied URL' : 'Copy Link'}
                                    </button>
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 font-medium">Share your code with friends to earn 10% commission on their earnings!</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
