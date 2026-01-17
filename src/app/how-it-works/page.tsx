import Link from 'next/link';
import { BackgroundParticles } from '@/components/BackgroundParticles';

export default function HowItWorksPage() {
    return (
        <div className="min-h-screen relative overflow-x-hidden bg-slate-50/50 isolate">
            <BackgroundParticles />
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-100/40 via-purple-50/40 to-transparent pointer-events-none -z-10" />

            <main className="relative z-10 py-20 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 uppercase tracking-tight">How It Works</h1>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">Start earning in 3 simple steps.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="glass-card bg-white/80 p-8 rounded-[30px] shadow-xl border border-white/50 backdrop-blur-xl relative overflow-hidden group hover:scale-[1.02] transition-transform">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-indigo-500/20 transition-colors"></div>
                            <div className="text-6xl mb-6 relative z-10">📝</div>
                            <h3 className="text-2xl font-black mb-4 text-slate-900">1. Register</h3>
                            <p className="text-slate-600 font-medium leading-relaxed">Create your free account in under 2 minutes. No credit card required, instant access to all features.</p>
                        </div>

                        <div className="glass-card bg-white/80 p-8 rounded-[30px] shadow-xl border border-white/50 backdrop-blur-xl relative overflow-hidden group hover:scale-[1.02] transition-transform">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-purple-500/20 transition-colors"></div>
                            <div className="text-6xl mb-6 relative z-10">🎯</div>
                            <h3 className="text-2xl font-black mb-4 text-slate-900">2. Complete Offers</h3>
                            <p className="text-slate-600 font-medium leading-relaxed">Browse hundreds of high-paying offers. Play games, take surveys, and test apps to earn real rewards.</p>
                        </div>

                        <div className="glass-card bg-white/80 p-8 rounded-[30px] shadow-xl border border-white/50 backdrop-blur-xl relative overflow-hidden group hover:scale-[1.02] transition-transform">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-emerald-500/20 transition-colors"></div>
                            <div className="text-6xl mb-6 relative z-10">💸</div>
                            <h3 className="text-2xl font-black mb-4 text-slate-900">3. Get Paid</h3>
                            <p className="text-slate-600 font-medium leading-relaxed">Withdraw your earnings instantly via PayPal, Crypto, or Gift Cards once you reach the minimum threshold.</p>
                        </div>
                    </div>

                    <div className="mt-16 text-center">
                        <a href="/register" style={{ position: 'relative', zIndex: 999999, cursor: 'pointer' }} className="inline-block bg-indigo-600 text-white px-12 py-5 text-xl font-black rounded-2xl shadow-2xl hover:scale-105 transition-all">
                            Start Earning Now
                        </a>
                        <div className="mt-8">
                            <a href="/" style={{ position: 'relative', zIndex: 999999, cursor: 'pointer' }} className="text-indigo-600 font-bold hover:underline">
                                ← Back to Home
                            </a>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
