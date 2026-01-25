'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--text)]">
            {/* Sidebar */}
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

            {/* Main Content Area */}
            <main className={`min-h-screen ${isCollapsed ? 'ml-8' : 'ml-[140px] md:ml-48 xl:ml-64'}`}>
                <div className="mx-auto min-h-screen">
                    {children}
                </div>
            </main>
        </div>
    );
}
