'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Star, Zap, Layout, ShieldCheck } from 'lucide-react';

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
}

const offerPartners: Partner[] = [
    { id: 'notik', name: 'Notik', gradient: 'partner-card-pink', tag: 'Hot', rating: 5 },
    { id: 'offery', name: 'Offery', gradient: 'partner-card-blue', tag: '+50%', rating: 5 },
    { id: 'adtwall', name: 'Adtwall', gradient: 'partner-card-purple', tag: '+50%', rating: 5 },
    { id: 'lootably', name: 'Lootably', gradient: 'partner-card-pink', tag: 'Hot', rating: 5 },
    { id: 'adscend', name: 'adscendmedia', gradient: 'partner-card-blue', tag: 'New', rating: 5 },
    { id: 'torox', name: 'Torox', gradient: 'partner-card-blue', tag: 'New', rating: 5 },
];

const surveyPartners: Partner[] = [
    { id: 'bitlab', name: 'BitLab', gradient: 'partner-card-pink', tag: 'Hot', rating: 5 },
    { id: 'pollfish', name: 'Pollfish', gradient: 'partner-card-blue', tag: '+15%', rating: 5 },
    { id: 'cpalead', name: 'CPALead', gradient: 'partner-card-purple', tag: 'New', rating: 5 },
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="p-4 lg:p-8 space-y-12">
            {/* Stats Header (Compact) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Available Balance', value: `$${stats.availableBalance.toFixed(2)}`, color: 'text-emerald-500' },
                    { label: 'Pending Balance', value: `$${stats.pendingBalance.toFixed(2)}`, color: 'text-amber-500' },
                    { label: 'Total Earned', value: `$${stats.totalEarned.toFixed(2)}`, color: 'text-indigo-500' },
                    { label: 'Offers Done', value: stats.completedOffers, color: 'text-blue-500' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
                        <div className="text-[10px] uppercase font-black text-slate-400 mb-1">{stat.label}</div>
                        <div className={`text-xl font-black ${stat.color}`}>{stat.value}</div>
                    </div>
                ))}
            </div>

            {/* Featured Offers Section */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Featured Offers</h2>
                    </div>
                    <Link href="/dashboard/offers" className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-4 py-1.5 rounded-full text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1">
                        View All <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {offers.length === 0 ? (
                        Array(6).fill(0).map((_, i) => (
                            <div key={i} className="aspect-[3/4] bg-slate-100 dark:bg-slate-900 rounded-2xl animate-pulse" />
                        ))
                    ) : (
                        offers.map((offer) => (
                            <Link key={offer.id} href={`/dashboard/offers?id=${offer.id}`} className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-2 rounded-2xl hover:scale-[1.02] transition-all duration-300 shadow-sm hover:shadow-xl">
                                <div className="relative aspect-square mb-3 overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-800">
                                    {offer.thumbnailUrl ? (
                                        <Image src={offer.thumbnailUrl} alt={offer.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" unoptimized />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-2xl">🎁</div>
                                    )}
                                    <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg">
                                        +${offer.userReward.toFixed(2)}
                                    </div>
                                </div>
                                <h3 className="text-xs font-black text-slate-900 dark:text-white line-clamp-1 mb-1 truncate uppercase">{offer.title}</h3>
                                <div className="flex items-center gap-1">
                                    <div className="flex -space-x-1">
                                        <Layout className="w-3 h-3 text-slate-400" />
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase truncate">{offer.category || 'Offer'}</span>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </section>

            {/* Offer Partners Section */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-indigo-500 fill-indigo-500" />
                        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Offer Partners</h2>
                    </div>
                    <Link href="/dashboard/offers" className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-4 py-1.5 rounded-full text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1">
                        View All <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {offerPartners.map((partner) => (
                        <div key={partner.id} className={`relative group aspect-[4/5] rounded-3xl overflow-hidden cursor-pointer ${partner.gradient} p-4 flex flex-col items-center justify-center transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-2xl`}>
                            {partner.tag && (
                                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                                    {partner.tag}
                                </div>
                            )}
                            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <span className="text-2xl font-black text-white">{partner.name[0]}</span>
                            </div>
                            <h3 className="text-sm font-black text-white uppercase tracking-wider mb-2">{partner.name}</h3>
                            <div className="flex items-center gap-0.5">
                                {Array(5).fill(0).map((_, i) => (
                                    <Star key={i} className={`w-3 h-3 ${i < partner.rating ? 'text-amber-300 fill-amber-300' : 'text-white/30'}`} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Survey Partners Section */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-emerald-500" />
                        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Survey Partners</h2>
                    </div>
                    <Link href="/dashboard/surveys" className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-4 py-1.5 rounded-full text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1">
                        View All <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {surveyPartners.map((partner) => (
                        <div key={partner.id} className={`relative group aspect-[4/5] rounded-3xl overflow-hidden cursor-pointer ${partner.gradient} p-4 flex flex-col items-center justify-center transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-2xl`}>
                            {partner.tag && (
                                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                                    {partner.tag}
                                </div>
                            )}
                            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <span className="text-2xl font-black text-white">{partner.name[0]}</span>
                            </div>
                            <h3 className="text-sm font-black text-white uppercase tracking-wider mb-2">{partner.name}</h3>
                            <div className="flex items-center gap-0.5">
                                {Array(5).fill(0).map((_, i) => (
                                    <Star key={i} className={`w-3 h-3 ${i < partner.rating ? 'text-amber-300 fill-amber-300' : 'text-white/30'}`} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
