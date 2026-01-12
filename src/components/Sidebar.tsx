'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeProvider';
import {
    Home,
    Zap,
    Layout,
    ShoppingBag,
    Trophy,
    Users,
    Gift,
    User,
    MessageCircle,
    Sun,
    Moon
} from 'lucide-react';

export default function Sidebar() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const { theme, toggleTheme } = useTheme();

    const menuItems = [
        { label: 'Earn', icon: Home, href: '/dashboard', active: pathname === '/dashboard' },
        { label: 'Offers', icon: Layout, href: '/dashboard/offers', active: pathname.startsWith('/dashboard/offers') },
        { label: 'Surveys', icon: Zap, href: '/dashboard/surveys', active: pathname.startsWith('/dashboard/surveys') },
        { label: 'Shop', icon: ShoppingBag, href: '/dashboard/shop', active: pathname.startsWith('/dashboard/shop') },
        { label: 'Leaderboard', icon: Trophy, href: '/dashboard/leaderboard', active: pathname.startsWith('/dashboard/leaderboard') },
        { label: 'Referrals', icon: Users, href: '/dashboard/referrals', active: pathname.startsWith('/dashboard/referrals') },
        { label: 'Rewards', icon: Gift, href: '/dashboard/rewards', active: pathname.startsWith('/dashboard/rewards') },
        { label: 'Profile', icon: User, href: '/dashboard/profile', active: pathname.startsWith('/dashboard/profile') },
        { label: 'Support', icon: MessageCircle, href: '/support', active: pathname.startsWith('/support') },
    ];

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 dark:bg-black border-r border-slate-800 dark:border-slate-800/50 flex flex-col z-50">
            <div className="p-6">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <Image
                        src="/taskspot-logo.png"
                        alt="TaskSpot"
                        width={120}
                        height={48}
                        className="h-10 w-auto object-contain"
                        priority
                    />
                </Link>
            </div>

            <nav className="flex-grow px-4 pb-4 space-y-1 overflow-y-auto custom-scrollbar">
                {menuItems.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 group ${item.active
                            ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                    >
                        <item.icon className={`w-5 h-5 ${item.active ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'}`} />
                        {item.label}
                        {item.label === 'Surveys' && (
                            <span className="ml-auto bg-indigo-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black">
                                2
                            </span>
                        )}
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-800 space-y-4">
                <button
                    onClick={toggleTheme}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                >
                    {theme === 'dark' ? (
                        <>
                            <Sun className="w-5 h-5 text-amber-400" />
                            Light Mode
                        </>
                    ) : (
                        <>
                            <Moon className="w-5 h-5 text-indigo-400" />
                            Dark Mode
                        </>
                    )}
                </button>

                <div className="flex items-center gap-3 px-4 py-2 bg-slate-800/50 rounded-2xl">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                        {session?.user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex-grow min-w-0">
                        <div className="text-xs font-black text-white truncate">{session?.user?.name || 'User'}</div>
                        <div className="text-[10px] text-slate-500 uppercase font-bold">Standard User</div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
