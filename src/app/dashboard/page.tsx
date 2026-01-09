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
    thumbnailUrl?: string | null; // ডাটাবেস থেকে ছবি আনার জন্য
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
                .then(data => setOffers(data.slice(0, 6)))
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
                    <p className="text-lg text-slate-500 font-medium italic opacity-70">"Quality is not an act, it is a habit." — Here&apos;s your overview</p>
                </div>

                <div className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold">Featured Offers</h3>
                        <Link href="/dashboard/offers" className="text-sm font-bold text-purple-600 hover:text-purple-500">See All Offers →</Link>
                    </div>

                    {offers.length === 0 ? (
                        <div className="glass-card p-12 rounded-3xl text-center"><p>Loading offers...</p></div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {offers.map((offer) => (
                                <div key={offer.id} className="glass-card p-6 rounded-2xl card-hover border border-white/50 shadow-sm relative overflow-hidden group">
                                    <div className="flex justify-between items-start mb-4">
                                        {/* এটিই ছবির নতুন কোড */}
                                        <div className="relative w-14 h-14 overflow-hidden rounded-xl border border-white/40 shadow-sm flex-shrink-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10">
                                            {offer.thumbnailUrl ? (
                                                <Image src={offer.thumbnailUrl} alt={offer.title} fill className="object-cover" unoptimized />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-2xl">🔥</div>
                                            )}
                                        </div>
                                        <div className="font-mono font-bold text-green-500 bg-green-500/10 px-3 py-1 rounded-full text-xs border border-green-500/20">
                                            +${offer.userReward.toFixed(2)}
                                        </div>
                                    </div>
                                    <h4 className="font-bold text-lg mb-2 line-clamp-1">{offer.title}</h4>
                                    <p className="text-xs text-slate-500 mb-5 line-clamp-2">{offer.description}</p>
                                    <Link href={`/dashboard/offers?id=${offer.id}`} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-sm block text-center hover:bg-slate-800">Start Earning</Link>
                                </div>
                            ))}
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