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
    Moon,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

interface SidebarProps {
    isCollapsed: boolean;
    setIsCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
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
        <aside className={`fixed left-0 top-0 h-screen bg-[#CAD5E2] dark:bg-[#364153] border-r border-black/5 dark:border-white/10 flex flex-col z-50 backdrop-blur-xl transition-all duration-300 ${isCollapsed ? 'w-7' : 'w-[70px] md:w-48 xl:w-64'}`}>
            {/* Toggle Button */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-20 bg-indigo-600 text-white rounded-full p-1 shadow-lg z-50 hover:scale-110 active:scale-95 flex items-center justify-center border border-white/20"
            >
                {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
            </button>

            <div className={`p-1.5 flex flex-col items-center justify-center ${isCollapsed ? 'p-0.5' : 'md:p-6'}`}>
                <Link href="/dashboard" className="relative group">
                    <div className={`relative rounded-full border-2 border-indigo-500/20 group-hover:border-indigo-500/40 overflow-hidden shadow-lg ${isCollapsed ? 'w-5 h-5' : 'w-10 h-10 md:w-20 md:h-20 xl:w-28 xl:h-28'}`}>
                        <Image
                            src={isCollapsed ? "/sidebar-icon.png" : "/sidebar-logo.png"}
                            alt="Logo"
                            fill
                            className={isCollapsed ? "object-contain p-0.5" : "object-cover"}
                            priority
                        />
                    </div>
                </Link>
            </div>

            <nav className="flex-grow px-4 pb-4 space-y-1 overflow-y-auto custom-scrollbar">
                {menuItems.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className={`flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-3 px-1 md:px-4 py-2 md:py-2.5 rounded-xl text-sm font-bold group relative ${item.active
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'text-[var(--text)]/60 hover:text-[var(--text)] hover:bg-black/5 dark:hover:bg-white/5'
                            }`}
                    >
                        <item.icon className={`shrink-0 ${isCollapsed ? 'w-4 h-4' : 'w-4 h-4 md:w-5 md:h-5'} ${item.active ? 'text-white' : 'text-slate-500'}`} />
                        <span className={`truncate ${isCollapsed ? 'hidden' : 'block'} text-[8px] md:text-sm`}>{item.label}</span>

                        {/* Tooltip on hover when collapsed */}
                        {isCollapsed && (
                            <div className="absolute left-full ml-2 px-2 py-1 bg-indigo-600 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[100] shadow-xl">
                                {item.label}
                            </div>
                        )}

                        {item.label === 'Surveys' && (
                            <span className={`bg-indigo-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black ${isCollapsed ? 'absolute top-1 right-1 md:hidden' : 'absolute md:relative right-1 md:right-0 md:ml-auto'}`}>
                                2
                            </span>
                        )}
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-800 space-y-4">
                <button
                    onClick={toggleTheme}
                    className="w-full flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-3 px-1 md:px-4 py-3 rounded-xl text-sm font-bold text-[var(--text)]/60 hover:text-[var(--text)] hover:bg-black/5 dark:hover:bg-white/5 transition-all group relative"
                >
                    {theme === 'dark' ? (
                        <>
                            <Sun className={`shrink-0 text-amber-400 ${isCollapsed ? 'w-4 h-4' : 'w-4 h-4 md:w-5 md:h-5'}`} />
                            <span className={`${isCollapsed ? 'hidden' : 'block'} text-[8px] md:text-sm text-center md:text-left`}>Light</span>
                            {isCollapsed && (
                                <div className="absolute left-full ml-2 px-2 py-1 bg-indigo-600 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[100] shadow-xl">
                                    Light Mode
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <Moon className={`shrink-0 text-indigo-400 ${isCollapsed ? 'w-4 h-4' : 'w-4 h-4 md:w-5 md:h-5'}`} />
                            <span className={`${isCollapsed ? 'hidden' : 'block'} text-[8px] md:text-sm text-center md:text-left`}>Dark</span>
                            {isCollapsed && (
                                <div className="absolute left-full ml-2 px-2 py-1 bg-indigo-600 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[100] shadow-xl">
                                    Dark Mode
                                </div>
                            )}
                        </>
                    )}
                </button>

                <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-3 px-1 md:px-4 py-2 bg-black/5 dark:bg-white/5 rounded-2xl group relative">
                    <div className={`shrink-0 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold ${isCollapsed ? 'w-5 h-5 text-[8px]' : 'w-6 h-6 md:w-8 md:h-8 text-[10px] md:text-xs'}`}>
                        {session?.user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className={`flex-grow min-w-0 ${isCollapsed ? 'hidden' : 'block'}`}>
                        <div className="text-[8px] md:text-xs font-black text-[var(--text)] truncate text-center md:text-left">{session?.user?.name || 'User'}</div>
                        <div className="text-[6px] md:text-[10px] text-[var(--text)]/50 uppercase font-bold text-center md:text-left">Pro</div>
                    </div>
                    {isCollapsed && (
                        <div className="absolute left-full ml-4 px-2 py-1 bg-indigo-600 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-[100] shadow-xl">
                            {session?.user?.name || 'User'}
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}
