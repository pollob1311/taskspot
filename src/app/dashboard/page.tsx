'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Offer {
    id: string;
    title: string;
    description: string;
    rewardPoints: number;
    userReward: number;
    isCompleted: boolean;
    thumbnailUrl?: string | null;
    deviceTypes?: string[];
    category?: string;
}

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [stats, setStats] = useState({
        availableBalance: 0,
        pendingBalance: 0,
        totalEarned: 0,
        completedOffers: 0,
    });
    const [offers, setOffers] = useState<Offer[]>([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showWelcome, setShowWelcome] = useState(true);
    const [shouldAnimate, setShouldAnimate] = useState(false);

    useEffect(() => {
        const hasSeenWelcome = sessionStorage.getItem('taskspot_welcome_seen');
        if (hasSeenWelcome) {
            setShowWelcome(false);
        } else {
            setShouldAnimate(true);
            const timer = setTimeout(() => {
                setShowWelcome(false);
                sessionStorage.setItem('taskspot_welcome_seen', 'true');
            }, 7000);
            return () => clearTimeout(timer);
        }
    }, []);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    useEffect(() => {
        if (session?.user) {
            fetch('/api/user/stats')
                .then(res => res.json())
                .then(data => setStats(data))
                .catch(console.error);

            fetch('/api/offers')
                .then(res => res.json())
                .then(data => setOffers(data.slice(0, 10)))
                .catch(console.error);
        }
    }, [session]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--background)]">
            <header className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-50 h-16">
                <div className="container mx-auto px-1 md:px-4 h-full flex items-center justify-between gap-1 md:gap-4 relative">
                    <div className="flex items-center flex-shrink-0 relative">
                        <Link href="/dashboard/offers" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <div className="w-12 md:w-24 h-1"></div>
                            <Image
                                src="/taskspot-logo.png"
                                alt="TaskSpot"
                                width={400}
                                height={160}
                                className="absolute -top-[45px] left-0 h-28 md:h-40 w-auto object-contain max-w-none drop-shadow-md z-50"
                                priority
                            />
                        </Link>
                    </div>

                    <div className="flex-grow flex flex-col items-center justify-center relative px-4 md:px-8">
                        <div className="flex items-center divide-x divide-slate-100 bg-slate-50/50 rounded-lg md:rounded-xl border border-slate-100/50 w-full md:w-auto justify-between md:justify-center">
                            <Link href="/dashboard/history" className="px-1 md:px-4 py-1.5 flex flex-col justify-center flex-1 min-w-0 md:min-w-[120px] hover:bg-white transition-all duration-300">
                                <span className="text-[9px] md:text-[clamp(0.4rem,0.9vw,0.7rem)] font-black uppercase tracking-widest text-indigo-600 mb-0.5 whitespace-nowrap">Earned</span>
                                <span className="text-[10px] md:text-[clamp(0.65rem,1.5vw,0.875rem)] font-black text-indigo-900">${stats.totalEarned.toFixed(2)}</span>
                            </Link>
                            <Link href="/dashboard/withdraw" className="px-1 md:px-4 py-1.5 flex flex-col justify-center flex-1 min-w-0 md:min-w-[100px] hover:bg-white transition-all duration-300">
                                <span className="text-[8px] md:text-[clamp(0.4rem,0.9vw,0.7rem)] font-black uppercase tracking-wider text-emerald-700 mb-0.5 whitespace-nowrap">Available</span>
                                <span className="text-[10px] md:text-[clamp(0.65rem,1.5vw,0.875rem)] font-black text-emerald-600">${stats.availableBalance.toFixed(2)}</span>
                            </Link>
                            <Link href="/dashboard/history" className="px-1 md:px-4 py-1.5 flex flex-col justify-center flex-1 min-w-0 md:min-w-[100px] hover:bg-white transition-all duration-300">
                                <span className="text-[8px] md:text-[clamp(0.4rem,0.9vw,0.7rem)] font-black uppercase tracking-wider text-amber-700 mb-0.5 whitespace-nowrap">Pending</span>
                                <span className="text-[10px] md:text-[clamp(0.65rem,1.5vw,0.875rem)] font-black text-amber-500">${stats.pendingBalance.toFixed(2)}</span>
                            </Link>
                            <Link href="/dashboard/history" className="px-1 md:px-4 py-1.5 flex flex-col justify-center flex-1 min-w-0 md:min-w-[110px] hover:bg-white transition-all duration-300">
                                <span className="text-[9px] md:text-[clamp(0.4rem,0.9vw,0.7rem)] font-black uppercase tracking-widest text-blue-700 mb-0.5 whitespace-nowrap">Done</span>
                                <span className="text-[10px] md:text-[clamp(0.65rem,1.5vw,0.875rem)] font-black text-blue-600">{stats.completedOffers}</span>
                            </Link>
                        </div>
                        <div className="absolute -bottom-1 left-0 w-full h-[0.5px] bg-teal-400 rounded-full"></div>
                    </div>

                    <div className="flex items-center gap-1.5 md:gap-3 flex-shrink-0">
                        <div className="flex items-center bg-indigo-50/50 rounded-lg md:rounded-xl px-1 md:px-3 py-1 md:py-1.5 border border-indigo-100/50 flex-shrink-0">
                            <div className="mr-1 md:mr-3">
                                <span className="text-[8px] md:text-[clamp(0.4rem,0.8vw,0.7rem)] uppercase text-indigo-700 font-black block mb-0.5">Balance</span>
                                <div className="font-mono font-black text-indigo-600 text-[11px] md:text-[clamp(0.65rem,1.4vw,1rem)]">${stats.availableBalance.toFixed(2)}</div>
                            </div>
                            <Link href="/dashboard/withdraw" className="bg-indigo-600 text-white px-1.5 md:px-5 py-1 md:py-2.5 rounded-lg text-[10px] md:text-[clamp(0.55rem,1vw,0.75rem)] font-black hover:bg-indigo-700 shadow-md">Withdraw</Link>
                        </div>

                        <div className="relative">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors flex flex-col gap-0.5 w-9 h-9 items-center justify-center border border-slate-100">
                                <div className="w-0.5 h-0.5 bg-indigo-600 rounded-full"></div>
                                <div className="w-0.5 h-0.5 bg-indigo-600 rounded-full"></div>
                                <div className="w-0.5 h-0.5 bg-indigo-600 rounded-full"></div>
                            </button>

                            {isMenuOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)}></div>
                                    <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 p-1.5 animate-in fade-in slide-in-from-top-1">
                                        <Link href="/dashboard/offers" className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 rounded-xl transition-colors">🎯 Offers</Link>
                                        <Link href="/dashboard/referrals" className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 rounded-xl transition-colors">👥 Referrals</Link>
                                        <Link href="/blog" className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 rounded-xl transition-colors">📝 Read Blog</Link>
                                        <Link href="/dashboard/history" className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 rounded-xl transition-colors">📊 History</Link>
                                        <div className="h-px bg-slate-50 my-1.5"></div>
                                        <Link href="/dashboard/profile" className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 rounded-xl transition-colors">👤 Profile</Link>
                                        {session?.user?.role === 'ADMIN' && (
                                            <>
                                                <div className="h-px bg-slate-50 my-1.5 opacity-50"></div>
                                                <Link href="/dashboard/admin" className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-purple-600 hover:bg-purple-50 rounded-xl">🛡️ Admin Panel</Link>
                                            </>
                                        )}
                                        <div className="h-px bg-slate-50 my-1.5"></div>
                                        <a href="mailto:support@taskspot.site" className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 rounded-xl transition-colors">
                                            <span className="w-7 h-7 flex items-center justify-center bg-white border border-slate-100 rounded-lg shadow-sm">✉️</span> Contact Support
                                        </a>
                                        <div className="h-px bg-slate-50 my-1.5"></div>
                                        <button onClick={() => signOut({ callbackUrl: '/login' })} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl">🚪 Sign Out</button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-12">
                <div className={`${shouldAnimate ? 'transition-all duration-1000' : ''} overflow-hidden ${showWelcome ? 'max-h-[200px] opacity-100 mb-12' : 'max-h-0 opacity-0 mb-0'}`}>
                    <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">
                        Welcome back, <span className="text-indigo-600">{session?.user?.name || 'User'}</span>! 👋
                    </h2>
                    <p className="text-lg text-slate-500 font-medium italic opacity-70">
                        &quot;Quality is not an act, it is a habit.&quot; — Here&apos;s your overview
                    </p>
                </div>

                <div className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold">Featured Offers</h3>
                        <Link href="/dashboard/offers" className="text-sm font-bold text-purple-600 hover:text-purple-500">See All Offers →</Link>
                    </div>

                    {offers.length === 0 ? (
                        <div className="glass-card p-12 rounded-3xl text-center"><p>Loading offers...</p></div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                            {offers.map((offer) => {
                                const deviceTypes = offer.deviceTypes || ['desktop', 'mobile', 'tablet'];
                                const isAllDevices = deviceTypes.length >= 3;

                                return (
                                    <div key={offer.id} className="glass-card p-2 rounded-2xl card-hover border border-white/50 shadow-sm relative overflow-hidden group flex flex-col h-full min-h-[190px]">
                                        {/* Image Area (Enlarged) */}
                                        <div className="relative w-full h-32 -mt-2 -mx-2 mb-2 overflow-hidden rounded-t-2xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5">
                                            {offer.thumbnailUrl ? (
                                                <Image
                                                    src={offer.thumbnailUrl}
                                                    alt={offer.title}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                    unoptimized
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-4xl">🔥</div>
                                            )}

                                            {/* Reward Badge Overlay */}
                                            <div className="absolute top-2 right-2 font-mono font-bold text-emerald-600 bg-white/95 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-[13px] border border-emerald-500/20 shadow-md z-10">
                                                +${offer.userReward.toFixed(2)}
                                            </div>

                                            {/* Device Icons Overlay (Smart & Clean) */}
                                            <div className="absolute bottom-2 left-2 flex gap-2 text-black">
                                                {isAllDevices ? (
                                                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><title>All Devices</title><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                                                ) : (
                                                    <>
                                                        {deviceTypes.includes('android') && (
                                                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><title>Android</title><path d="M17.523 15.3414C17.0694 15.3414 16.6997 15.7111 16.6997 16.1647C16.6997 16.6183 17.0694 16.988 17.523 16.988C17.9766 16.988 18.3463 16.6183 18.3463 16.1647C18.3463 15.7111 17.9766 15.3414 17.523 15.3414ZM6.47702 15.3414C6.02344 15.3414 5.65373 15.7111 5.65373 16.1647C5.65373 16.6183 6.02344 16.988 6.47702 16.988C6.9306 16.988 7.30031 16.6183 7.30031 16.1647C7.30031 15.7111 6.9306 15.3414 6.47702 15.3414ZM17.9366 10.3752L19.8335 7.08775C19.9576 6.87271 19.8839 6.5975 19.6689 6.47343C19.4538 6.34937 19.1786 6.42306 19.0545 6.6381L17.1352 9.96255C15.6888 9.30232 13.9114 8.92723 12 8.92723C10.0886 8.92723 8.31118 9.30232 6.86478 9.96255L4.9455 6.6381C4.82143 6.42306 4.54622 6.34937 4.33118 6.47343C4.11613 6.5975 4.04245 6.87271 4.16652 7.08775L6.06338 10.3752C3.52227 11.7513 1.81592 14.3413 1.66699 17.3881H22.3331C22.1841 14.3413 20.4777 11.7513 17.9366 10.3752Z" /></svg>
                                                        )}
                                                        {(deviceTypes.includes('ios') || deviceTypes.includes('apple') || deviceTypes.includes('iphone')) && (
                                                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><title>Apple</title><path d="M17.05 20.28c-.96.95-2.04 1.72-3.12 1.72-1.05 0-1.46-.66-2.73-.66-1.28 0-1.74.64-2.73.64-1.12 0-2.31-.86-3.32-1.84C3.12 18.09 1.67 14.28 1.67 11.12c0-3.3 2.1-5.11 4.14-5.11 1.05 0 2.05.74 2.68.74.63 0 1.72-.81 2.92-.81 1.48 0 2.9.72 3.65 1.83-3.1 1.83-2.58 5.48.51 6.87-.7 1.78-1.58 3.54-2.52 4.54zM11.95 5.56c-.05-1.92 1.58-3.54 3.4-3.56.07 1.95-1.63 3.61-3.4 3.56z" /></svg>
                                                        )}
                                                        {(deviceTypes.includes('desktop') || deviceTypes.includes('pc') || deviceTypes.includes('windows')) && (
                                                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><title>PC</title><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Extremely Compact Text Area */}
                                        <div className="flex flex-col justify-start px-1">
                                            <h4 className="font-black text-[13px] line-clamp-1 group-hover:text-indigo-600 transition-colors uppercase tracking-tight leading-tight">{offer.title}</h4>
                                            <p className="text-[10px] text-slate-500 line-clamp-1 leading-none opacity-90 group-hover:opacity-100 transition-opacity">
                                                <span className="font-bold text-indigo-500/80 mr-1 uppercase">[{offer.category || 'TASK'}]</span>
                                                {offer.description}
                                            </p>
                                        </div>

                                        {/* Button (Very close to text) */}
                                        <div className="mt-1">
                                            <Link
                                                href={`/dashboard/offers?id=${offer.id}`}
                                                className="w-full bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-900 py-1 rounded-lg font-black text-[12px] uppercase tracking-wider block text-center transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_4px_12px_rgba(16,185,129,0.2)] hover:shadow-[0_6px_16px_rgba(16,185,129,0.3)] btn-reflect"
                                            >
                                                Start Earning
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="glass-card p-8 rounded-3xl shadow-sm border border-white/50">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl font-bold">Recent Activity</h3>
                        <Link href="/dashboard/history" className="text-sm font-bold text-purple-600">View All</Link>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-4 border-b border-slate-100 hover:bg-white/50 rounded-xl px-4 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-purple-500/10 rounded-full">✨</div>
                                <div>
                                    <div className="font-bold">Welcome Bonus</div>
                                    <div className="text-xs text-slate-400 uppercase tracking-wider">Account Initialization</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-green-500 font-mono font-bold">+$0.05</div>
                                <div className="text-[10px] text-slate-400">JUST NOW</div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}