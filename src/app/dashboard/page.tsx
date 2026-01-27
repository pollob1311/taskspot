'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Star, Zap, Layout, ShieldCheck, Diamond, Menu } from 'lucide-react';

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

interface Partner {
    id: string;
    name: string;
    logo?: string;
    gradient: string;
    tag?: string;
    rating: number;
    href?: string;
}

const offerPartners: Partner[] = [
    { id: 'cpagrip', name: 'CPAGrip', gradient: 'partner-card-pink', tag: 'Hot', rating: 5, href: '/dashboard/offers' },
    { id: 'timewall', name: 'Time Wall', gradient: 'partner-card-purple', tag: 'Hot', rating: 5, href: 'tasks' },
];

const surveyPartners: Partner[] = [
    { id: 'timewall', name: 'Time Wall', gradient: 'partner-card-blue', tag: 'Hot', rating: 5, href: 'surveys' },
];

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

    const timeWallBase = "https://timewall.io/users/login?oid=fe9888054267aa75";
    const userId = session?.user?.id || 'guest';
    const timeWallTaskUrl = `${timeWallBase}&uid=${userId}&tab=tasks`;
    const timeWallSurveyUrl = `${timeWallBase}&uid=${userId}&tab=surveys`;

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--background)]">
            <header className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-40 h-16">
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

                    <div className="flex-grow flex flex-col items-center justify-center relative px-1 md:px-8 overflow-hidden">
                        <div className="flex items-center divide-x divide-slate-100 bg-slate-50/50 rounded-lg md:rounded-xl border border-slate-100/50 w-full md:w-auto justify-between md:justify-center overflow-x-auto no-scrollbar">
                            <Link href="/dashboard/history" className="px-1 md:px-4 py-1 flex flex-col justify-center flex-1 min-w-[50px] md:min-w-[120px] hover:bg-white transition-all duration-300">
                                <span className="text-[7px] md:text-[clamp(0.4rem,0.9vw,0.7rem)] font-black uppercase tracking-tight text-indigo-600 mb-0 whitespace-nowrap text-center">Earn</span>
                                <span className="text-[9px] md:text-[clamp(0.65rem,1.5vw,0.875rem)] font-black text-indigo-900 text-center">${stats.totalEarned.toFixed(1)}</span>
                            </Link>
                            <Link href="/dashboard/withdraw" className="px-1 md:px-4 py-1 flex flex-col justify-center flex-1 min-w-[50px] md:min-w-[100px] hover:bg-white transition-all duration-300">
                                <span className="text-[7px] md:text-[clamp(0.4rem,0.9vw,0.7rem)] font-black uppercase tracking-tight text-emerald-700 mb-0 whitespace-nowrap text-center">Avail</span>
                                <span className="text-[9px] md:text-[clamp(0.65rem,1.5vw,0.875rem)] font-black text-emerald-600 text-center">${stats.availableBalance.toFixed(1)}</span>
                            </Link>
                            <Link href="/dashboard/history" className="px-1 md:px-4 py-1 flex flex-col justify-center flex-1 min-w-[50px] md:min-w-[100px] hover:bg-white transition-all duration-300">
                                <span className="text-[7px] md:text-[clamp(0.4rem,0.9vw,0.7rem)] font-black uppercase tracking-tight text-amber-700 mb-0 whitespace-nowrap text-center">Pend</span>
                                <span className="text-[9px] md:text-[clamp(0.65rem,1.5vw,0.875rem)] font-black text-amber-500 text-center">${stats.pendingBalance.toFixed(1)}</span>
                            </Link>
                            <Link href="/dashboard/history" className="px-1 md:px-4 py-1 flex flex-col justify-center flex-1 min-w-[40px] md:min-w-[110px] hover:bg-white transition-all duration-300">
                                <span className="text-[7px] md:text-[clamp(0.4rem,0.9vw,0.7rem)] font-black uppercase tracking-tight text-blue-700 mb-0 whitespace-nowrap text-center">Done</span>
                                <span className="text-[9px] md:text-[clamp(0.65rem,1.5vw,0.875rem)] font-black text-blue-600 text-center">{stats.completedOffers}</span>
                            </Link>
                        </div>
                        <div className="absolute -bottom-1 left-0 w-full h-[0.5px] bg-teal-400 rounded-full"></div>
                    </div>

                    <div className="flex items-center gap-1 md:gap-3 flex-shrink-0">
                        <div className="flex items-center bg-indigo-50/50 rounded-lg md:rounded-xl px-1 md:px-3 py-0.5 md:py-1.5 border border-indigo-100/50 flex-shrink-0">
                            <div className="mr-1 md:mr-3 hidden xs:block">
                                <span className="text-[7px] md:text-[clamp(0.4rem,0.8vw,0.7rem)] uppercase text-indigo-700 font-black block mb-0">Balance</span>
                                <div className="font-mono font-black text-indigo-600 text-[9px] md:text-[clamp(0.65rem,1.4vw,1rem)]">${stats.availableBalance.toFixed(1)}</div>
                            </div>
                            <Link href="/dashboard/withdraw" className="bg-indigo-600 text-white px-2 md:px-5 py-1.5 md:py-2.5 rounded-lg text-[9px] md:text-[clamp(0.55rem,1vw,0.75rem)] font-black hover:bg-indigo-700 shadow-md">Withdraw</Link>
                        </div>

                        <div className="relative">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors flex flex-col gap-0.5 w-9 h-9 items-center justify-center border border-slate-100">
                                <Menu className="w-5 h-5 text-indigo-600" />
                            </button>

                            {isMenuOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)}></div>
                                    <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 p-1.5 animate-in fade-in slide-in-from-top-1">
                                        <Link href="/dashboard/offers" className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-indigo-50 rounded-xl transition-colors">🎯 Offers</Link>

                                        {/* Elite Offers বাটন যোগ করা হয়েছে */}
                                        <Link href="/dashboard/wall" className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-indigo-600 bg-indigo-50/50 hover:bg-indigo-100 rounded-xl transition-colors">
                                            <span className="w-7 h-7 flex items-center justify-center bg-white border border-indigo-100 rounded-lg shadow-sm text-sm">💎</span> Elite Wall
                                        </Link>

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
                                            <span className="w-7 h-7 flex items-center justify-center bg-white border border-slate-100 rounded-lg shadow-sm">✉️</span> Support
                                        </a>
                                        <div className="h-px bg-slate-50 my-1.5"></div>
                                        <button onClick={() => signOut({ callbackUrl: '/login' })} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors">🚪 Sign Out</button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 lg:py-12">
                <div className={`${shouldAnimate ? 'transition-all duration-1000' : ''} overflow-hidden ${showWelcome ? 'max-h-[200px] opacity-100 mb-12' : 'max-h-0 opacity-0 mb-0'}`}>
                    <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">
                        Welcome back, <span className="text-indigo-600">{session?.user?.name || 'User'}</span>! 👋
                    </h2>
                    <p className="text-lg text-slate-500 font-medium italic opacity-70">
                        &quot;Quality is not an act, it is a habit.&quot; — Here&apos;s your overview
                    </p>
                </div>

                {/* Featured Offers Section with Elite Wall CTA */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                            <h3 className="text-2xl font-bold uppercase tracking-tight">Featured Offers</h3>
                        </div>
                        <div className="hidden sm:flex items-center gap-2">
                            <Link href="/dashboard/wall" className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-2 rounded-xl text-[10px] font-black shadow-lg shadow-indigo-100 hover:scale-105 transition-all">
                                <Diamond className="w-3 h-3" /> ACCESS ELITE WALL
                            </Link>
                            <a href={timeWallTaskUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-emerald-600 text-white px-3 py-2 rounded-xl text-[10px] font-black shadow-lg shadow-emerald-100 hover:scale-105 transition-all">
                                <Zap className="w-3 h-3" /> OFFER WALL
                            </a>
                        </div>
                    </div>

                    {offers.length === 0 ? (
                        <div className="glass-card p-12 rounded-3xl text-center"><p>Loading offers...</p></div>
                    ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6 gap-2 sm:gap-3">
                            {offers.map((offer) => (
                                <Link key={offer.id} href={`/dashboard/offers?id=${offer.id}`} className="glass-card p-1.5 sm:p-2 rounded-xl sm:rounded-2xl card-hover border border-white/50 shadow-sm relative overflow-hidden group flex flex-col h-full min-h-[140px] sm:min-h-[170px]">
                                    <div className="relative w-full h-16 sm:h-24 -mt-1.5 sm:-mt-2 -mx-1.5 sm:-mx-2 mb-1.5 sm:mb-2 overflow-hidden rounded-t-xl sm:rounded-t-2xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5">
                                        {offer.thumbnailUrl ? (
                                            <Image src={offer.thumbnailUrl} alt={offer.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" unoptimized />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xl sm:text-2xl">🔥</div>
                                        )}
                                        <div className="absolute top-0.5 sm:top-1 right-0.5 sm:right-1 font-mono font-bold text-emerald-600 bg-white/95 backdrop-blur-sm px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[11px] border border-emerald-500/20 shadow-sm z-10">
                                            +${offer.userReward.toFixed(2)}
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-start px-0.5 sm:px-1">
                                        <h4 className="font-black text-[9px] sm:text-[11px] line-clamp-1 group-hover:text-indigo-600 transition-colors uppercase tracking-tight leading-tight">{offer.title}</h4>
                                        <p className="text-[8px] sm:text-[9px] text-slate-500 line-clamp-1 leading-none opacity-90 group-hover:opacity-100 transition-opacity">
                                            <span className="font-bold text-indigo-500/80 mr-1 uppercase">[{offer.category || 'TASK'}]</span>
                                            {offer.description}
                                        </p>
                                    </div>
                                    <div className="mt-1">
                                        <div className="w-full bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-900 py-0.5 sm:py-1 rounded-md sm:rounded-lg font-black text-[8px] sm:text-[10px] uppercase tracking-wider block text-center transition-all transform hover:scale-[1.02] active:scale-[0.98]">
                                            Start Earning
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Offer Partners Section */}
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <Zap className="w-5 h-5 text-indigo-500 fill-indigo-500" />
                            <h3 className="text-2xl font-bold uppercase tracking-tight">Offer Partners</h3>
                        </div>
                        <Link href="/dashboard/offers" className="text-sm font-bold text-indigo-600 hover:text-indigo-500 flex items-center gap-1">
                            See All <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {offerPartners.map((partner) => {
                            const isExternal = partner.href === 'tasks' || partner.href === 'surveys';
                            const linkHref = partner.href === 'tasks'
                                ? timeWallTaskUrl
                                : partner.href === 'surveys'
                                    ? timeWallSurveyUrl
                                    : partner.href && partner.href.startsWith('/')
                                        ? partner.href
                                        : "/dashboard/offers";
                            const LinkComponent = isExternal ? 'a' : Link;
                            const linkProps = isExternal ? { href: linkHref, target: "_blank", rel: "noopener noreferrer" } : { href: linkHref };

                            return (
                                <LinkComponent key={partner.id} {...linkProps as any} className={`relative group aspect-[4/2.5] rounded-2xl overflow-hidden cursor-pointer ${partner.gradient} p-3 flex flex-col items-center justify-center transition-all duration-300 hover:scale-105 shadow-md`}>
                                    {partner.tag && <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-md text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase">{partner.tag}</div>}
                                    <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center mb-1 group-hover:scale-110 transition-transform"><span className="text-xl font-black text-white">{partner.name[0]}</span></div>
                                    <h3 className="text-[11px] font-black text-white uppercase tracking-wider mb-1">{partner.name}</h3>
                                    <div className="flex items-center gap-0.5">
                                        {Array(5).fill(0).map((_, i) => (<Star key={i} className={`w-2 h-2 ${i < partner.rating ? 'text-amber-300 fill-amber-300' : 'text-white/30'}`} />))}
                                    </div>
                                </LinkComponent>
                            );
                        })}
                    </div>
                </section>

                {/* Survey Partners Section */}
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-emerald-500" />
                            <h3 className="text-2xl font-bold uppercase tracking-tight">Survey Partners</h3>
                        </div>
                        <Link href="/dashboard/offers" className="text-sm font-bold text-indigo-600 hover:text-indigo-500 flex items-center gap-1">
                            See All <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {surveyPartners.map((partner) => {
                            const isExternal = partner.href === 'tasks' || partner.href === 'surveys';
                            const linkHref = partner.href === 'tasks'
                                ? timeWallTaskUrl
                                : partner.href === 'surveys'
                                    ? timeWallSurveyUrl
                                    : partner.href && partner.href.startsWith('/')
                                        ? partner.href
                                        : "/dashboard/offers";
                            const LinkComponent = isExternal ? 'a' : Link;
                            const linkProps = isExternal ? { href: linkHref, target: "_blank", rel: "noopener noreferrer" } : { href: linkHref };

                            return (
                                <LinkComponent key={partner.id} {...linkProps as any} className={`relative group aspect-[4/2.5] rounded-2xl overflow-hidden cursor-pointer ${partner.gradient} p-3 flex flex-col items-center justify-center transition-all duration-300 hover:scale-105 shadow-md`}>
                                    {partner.tag && <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-md text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase">{partner.tag}</div>}
                                    <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center mb-1 group-hover:scale-110 transition-transform"><span className="text-xl font-black text-white">{partner.name[0]}</span></div>
                                    <h3 className="text-[11px] font-black text-white uppercase tracking-wider mb-1">{partner.name}</h3>
                                    <div className="flex items-center gap-0.5">
                                        {Array(5).fill(0).map((_, i) => (<Star key={i} className={`w-2 h-2 ${i < partner.rating ? 'text-amber-300 fill-amber-300' : 'text-white/30'}`} />))}
                                    </div>
                                </LinkComponent>
                            );
                        })}
                    </div>
                </section>

                {/* Recent Activity */}
                <div className="glass-card p-6 lg:p-8 rounded-3xl shadow-sm border border-white/50">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl font-bold uppercase tracking-tight">Recent Activity</h3>
                        <Link href="/dashboard/history" className="text-sm font-bold text-indigo-600">View All</Link>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-4 border-b border-slate-100 hover:bg-white/50 rounded-xl px-4 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-500/10 rounded-full">✨</div>
                                <div>
                                    <div className="font-bold">Welcome Bonus</div>
                                    <div className="text-xs text-slate-400 uppercase tracking-wider">Account Initialization</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-emerald-500 font-mono font-bold">+$0.05</div>
                                <div className="text-[10px] text-slate-400">JUST NOW</div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}