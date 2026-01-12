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

            {/* Main Content Area */}
            <main className="lg:ml-64 min-h-screen">
                <div className="mx-auto min-h-screen">
                    {children}
                </div>
            </main>
        </div>
    );
}
