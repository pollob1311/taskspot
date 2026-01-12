'use client';

import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-white transition-colors duration-300">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block">
                <Sidebar />
            </div>

            {/* Mobile Header (Placeholder for now) */}
            <div className="lg:hidden h-16 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 bg-white dark:bg-black sticky top-0 z-40">
                <button className="p-2 -ml-2 text-slate-500">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                </button>
                <div className="flex-grow flex justify-center">
                    <img src="/taskspot-logo.png" alt="Logo" className="h-8" />
                </div>
            </div>

            {/* Main Content Area */}
            <main className="lg:ml-64 min-h-screen">
                <div className="max-w-[1600px] mx-auto min-h-screen">
                    {children}
                </div>
            </main>
        </div>
    );
}
