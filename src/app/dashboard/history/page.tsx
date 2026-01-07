'use client';

import Link from 'next/link';

export default function HistoryPage() {
    return (
        <div className="min-h-screen bg-[var(--background)] py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <Link href="/dashboard" className="text-purple-600 hover:text-purple-500 font-semibold mb-8 inline-block">
                    ← Back to Dashboard
                </Link>

                <h1 className="text-4xl font-bold mb-8">Transaction History</h1>

                <div className="glass-card rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-gray-700">Date</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">Type</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">Description</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">Amount</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <tr>
                                    <td className="px-6 py-4 text-sm text-[var(--muted)]">2025-12-18</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">BONUS</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm">Welcome Bonus</td>
                                    <td className="px-6 py-4 font-mono font-bold text-green-500">+$0.05</td>
                                    <td className="px-6 py-4">
                                        <span className="text-green-500 text-sm">Completed</span>
                                    </td>
                                </tr>
                                {/* Empty State if no more data */}
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-[var(--muted)]">
                                        No more transactions found.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
