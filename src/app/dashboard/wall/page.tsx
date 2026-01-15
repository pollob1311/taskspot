'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function EliteOfferWall() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    // এই লাইনটি এখন ব্যাকটিক (`) দিয়ে শুরু এবং শেষ হয়েছে
    const cpagripLink = `https://www.cpagrip.com/show.php?l=1867725&u=901217&tracking_id=${session?.user?.id || 'guest'}`;

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    <p className="text-slate-500 font-bold">Connecting to Task Wall...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">💰 Elite Offer Wall</h1>
                    <p className="text-slate-500 font-medium">Complete these special tasks to earn massive points!</p>
                </div>

                <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border-[12px] border-white ring-1 ring-slate-200">
                    <iframe
                        src={cpagripLink}
                        className="w-full h-[850px] border-none"
                        title="TaskSpot Premium Wall"
                        allow="clipboard-read; clipboard-write"
                    ></iframe>
                </div>

                <div className="mt-8 p-6 bg-amber-50 rounded-3xl border border-amber-100">
                    <p className="text-sm text-amber-800 font-medium text-center">
                        ⚠️ **Notice:** Do not use VPN or Proxy. Honest work is rewarded with 100% payouts!
                    </p>
                </div>
            </div>
        </div>
    );
}