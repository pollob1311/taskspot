'use client';

import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--text)] transition-colors duration-300">
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
