'use client';
import { useSession } from 'next-auth/react';

export default function EliteOfferWall() {
    const { data: session } = useSession();

    // আপনার CPAGrip লিঙ্ক এবং ট্র্যাকিং আইডি
    const cpagripLink = `https://www.cpagrip.com/show.php?l=1867725&u=901217&tracking_id=${session?.user?.id}`;

    return (
        <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">💰 Elite Offer Wall</h1>
                        <p className="text-slate-500 font-medium mt-1">Complete these special tasks to earn massive points!</p>
                    </div>
                    <div className="hidden md:block bg-indigo-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg shadow-indigo-100">
                        OFFERS UPDATED DAILY
                    </div>
                </div>

                {/* Offerwall Container */}
                <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border-[12px] border-white ring-1 ring-slate-200">
                    {!session ? (
                        <div className="h-[600px] flex items-center justify-center text-slate-400 font-bold">
                            Please wait, loading tracking system...
                        </div>
                    ) : (
                        <iframe
                            src={cpagripLink}
                            className="w-full h-[850px] border-none"
                            title="TaskSpot Premium Wall"
                            allow="clipboard-read; clipboard-write"
                        ></iframe>
                    )}
                </div>

                <div className="mt-8 p-6 bg-amber-50 rounded-3xl border border-amber-100">
                    <p className="text-sm text-amber-800 font-medium">
                        ⚠️ **Notice:** Do not use VPN or Proxy. If multiple accounts are detected from the same device, your balance will be forfeited. Honest work is rewarded with 100% payouts!
                    </p>
                </div>
            </div>
        </div>
    );
}