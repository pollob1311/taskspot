'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * TaskSpot Elite Offer Wall Page
 * এই পেজটি সরাসরি CPAGrip থেকে হাজার হাজার অফার আপনার সাইটে দেখাবে।
 */
export default function EliteOfferWall() {
    const { data: session, status } = useSession();
    const router = useRouter();

    // ইউজার লগইন না থাকলে তাকে লগইন পেজে পাঠিয়ে দিবে
    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    // আপনার CPAGrip এর একদম সঠিক এবং ভেরিফাইড ডাইরেক্ট লিঙ্ক
    // u=901217 (আপনার আইডি), id=1867725 (আপনার ওয়াল আইডি)
    // tracking_id=${session?.user?.id} এটি নিশ্চিত করবে যে ইউজার কাজ করলে আপনার সাইটে টাকা যোগ হবে।
    const cpagripLink = `https://www.cpagrip.com/show.php?id=1867725&u=901217&tracking_id=${session?.user?.id || 'guest'}`;

    // সেশন লোড হওয়ার সময় একটি সুন্দর এনিমেশন দেখাবে
    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    <p className="text-slate-500 font-bold tracking-widest animate-pulse uppercase text-xs">Connecting to Secure Wall...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans">
            <div className="max-w-6xl mx-auto">

                {/* পেজ হেডার */}
                <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center justify-center md:justify-start gap-2">
                            💰 ELITE OFFER WALL
                        </h1>
                        <p className="text-slate-500 font-medium mt-1 italic">
                            Complete high-value tasks below to earn massive reward points!
                        </p>
                    </div>
                    <div className="bg-indigo-600 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100">
                        Offers Updated Every Hour
                    </div>
                </div>

                {/* অফারওয়াল কন্টেইনার (Iframe) */}
                <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border-[12px] border-white ring-1 ring-slate-200 relative group">
                    <iframe
                        src={cpagripLink}
                        className="w-full h-[850px] md:h-[900px] border-none"
                        title="TaskSpot Premium Offerwall"
                        allow="clipboard-read; clipboard-write"
                        loading="lazy"
                    ></iframe>
                </div>

                {/* নিরাপত্তা সতর্কবার্তা */}
                <div className="mt-8 p-6 bg-amber-50 rounded-3xl border border-amber-100 flex items-start gap-4">
                    <div className="text-2xl">⚠️</div>
                    <div>
                        <h4 className="font-bold text-amber-900 text-sm uppercase">Security Rules:</h4>
                        <p className="text-sm text-amber-800 leading-relaxed mt-1">
                            Do NOT use **VPN, Proxy, or AdBlockers**. Each completion is verified by our system. Fraudulent activities will result in an immediate permanent ban and forfeiture of all earnings. Honest work is rewarded with **100% guaranteed payouts**!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}