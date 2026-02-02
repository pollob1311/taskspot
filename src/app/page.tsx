'use client';

import { ShatterText } from '@/components/ShatterText';
import { Zap, Diamond, ChevronDown, ChevronUp } from 'lucide-react';
import { BackgroundParticles } from '@/components/BackgroundParticles';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { blogPosts } from '@/lib/blog-data';

export default function HomePage() {
    const router = useRouter();

    const handleSignIn = (e: React.FormEvent) => {
        e.preventDefault();
        router.push('/login');
    };

    return (
        <div className="min-h-screen relative overflow-x-hidden bg-slate-50/50 isolate">
            <BackgroundParticles />
            <main className="relative z-10">
                {/* 1. Hero Section - Natural Interaction Model */}
                <section className="min-h-[70vh] flex items-center justify-center py-4 md:py-8 relative z-50 bg-gradient-to-b from-indigo-200/40 via-purple-100/40 to-transparent">
                    <div className="container mx-auto px-4 md:px-8">
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 xl:gap-16">
                            {/* Left: Sign-In Box */}
                            <div className="w-full max-w-[400px] lg:min-w-[360px] xl:min-w-[400px] order-2 lg:order-1 flex-shrink-0 relative z-[9999]">
                                <div className="glass-card p-8 rounded-[40px] shadow-2xl border border-slate-100 backdrop-blur-xl bg-white/90">
                                    <h3 className="text-xl font-black text-slate-900 mb-6 text-center lg:text-left">Welcome Back!</h3>
                                    <form onSubmit={handleSignIn} className="space-y-4">
                                        <div className="space-y-4 text-left">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</label>
                                                <input type="email" placeholder="name@example.com" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Password</label>
                                                <input type="password" placeholder="••••••••" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900" />
                                            </div>
                                        </div>
                                        <button
                                            type="submit"
                                            className="block w-full text-center bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
                                        >
                                            Sign In
                                        </button>
                                        <div className="text-center pt-2">
                                            <a href="/register" style={{ position: 'relative', zIndex: 999999, cursor: 'pointer' }} className="text-sm font-bold text-indigo-600 hover:underline">Create Account →</a>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            {/* Right: Main Content */}
                            <div className="flex-1 flex flex-col items-center lg:items-end text-center lg:text-right order-1 lg:order-2 w-full overflow-visible pr-4 lg:pr-8">
                                <div className="mb-6 md:mb-10">
                                    <Image src="/taskspot-logo.png" alt="TaskSpot Logo" width={320} height={160} className="w-[180px] md:w-[280px] xl:w-[350px] h-auto object-contain drop-shadow-2xl" priority />
                                </div>

                                <div className="mb-6 w-full flex justify-center lg:justify-end overflow-visible">
                                    <div className="w-full">
                                        <ShatterText />
                                    </div>
                                </div>

                                <p className="text-base sm:text-lg md:text-2xl xl:text-3xl mb-8 text-slate-600 max-w-3xl font-medium leading-relaxed px-4 lg:px-0">
                                    Join the elite network. Complete high-value tasks.
                                    <br className="hidden md:block" />
                                    Get paid in <span className="text-cyan-500 font-black">Crypto</span>, <span className="text-purple-500 font-black">Cards</span>, or <span className="text-indigo-600 font-black">Cash</span>.
                                </p>

                                <div className="flex flex-wrap gap-4 justify-center lg:justify-end mb-10 relative z-[9999]">
                                    <a href="/register" style={{ position: 'relative', zIndex: 999999, cursor: 'pointer' }} className="bg-indigo-600 text-white px-10 py-4 md:px-12 md:py-5 text-lg md:text-xl font-black rounded-2xl shadow-xl hover:scale-105 transition-all">Start Earning</a>
                                    <a href="/blog" style={{ position: 'relative', zIndex: 999999, cursor: 'pointer' }} className="glass-card bg-white px-8 py-4 md:px-10 md:py-5 text-lg rounded-2xl border border-slate-200 font-bold text-slate-700 hover:bg-slate-50">Read Blog</a>
                                </div>

                                <div className="flex flex-wrap justify-center lg:justify-end gap-6 md:gap-10 text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                        <span>$500k+ Paid Out</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span>Global Access</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. How It Works Section */}
                <section id="how-it-works" className="py-4 md:py-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-slate-50/40 backdrop-blur-sm z-0"></div>
                    <div className="container mx-auto px-4 text-center relative z-20">
                        <a
                            href="/how-it-works"
                            className="text-4xl font-black text-slate-900 mb-6 uppercase cursor-pointer select-none inline-flex items-center gap-3 hover:text-indigo-600 transition-colors"
                            style={{ position: 'relative', zIndex: 999999 }}
                        >
                            How It Works <sup className="text-xs text-indigo-500 font-bold">New Page ↗</sup>
                        </a>
                        <p className="text-slate-500 text-sm font-bold max-w-xl mx-auto">
                            Click above to learn how you can start earning in 3 simple steps.
                        </p>
                    </div>
                </section>

                {/* 2.1 Running Featured Offers */}
                <section className="py-8 md:py-12 relative overflow-hidden border-t border-slate-500" style={{ backgroundColor: '#666666' }}>
                    <div className="absolute inset-0 bg-black/10 backdrop-blur-sm z-0"></div>
                    <div className="container mx-auto px-4 relative z-20">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-2">
                                <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">Running Featured Offers</h2>
                            </div>
                            <a href="/register" style={{ position: 'relative', zIndex: 999999, cursor: 'pointer' }} className="hidden sm:flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg shadow-indigo-100 hover:scale-105 transition-all">
                                <Diamond className="w-3 h-3" /> REGISTER TO ACCESS
                            </a>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                            {[
                                { id: 1, title: 'Download & Play', reward: 1.50, cat: 'GAME', img: '🎮' },
                                { id: 2, title: 'Survey Expert', reward: 2.20, cat: 'SURVEY', img: '📝' },
                                { id: 3, title: 'Sign Up Bonus', reward: 0.75, cat: 'SIGNUP', img: '✨' },
                                { id: 4, title: 'Mobile App Test', reward: 3.10, cat: 'MOBILE', img: '📱' },
                                { id: 5, title: 'Crypto Wallet', reward: 5.00, cat: 'HOT', img: '₿' },
                                { id: 6, title: 'Watch & Earn', reward: 0.25, cat: 'VIDEO', img: '🎬' },
                                { id: 7, title: 'Quick Task', reward: 1.10, cat: 'CASH', img: '💸' },
                                { id: 8, title: 'Premium Survey', reward: 4.50, cat: 'SURVEY', img: '⭐' },
                                { id: 9, title: 'Beta Testing', reward: 2.80, cat: 'APP', img: '🛠️' },
                                { id: 10, title: 'Daily Reward', reward: 0.50, cat: 'BONUS', img: '🎁' }
                            ].map((offer) => (
                                <a key={offer.id} href="/register" style={{ position: 'relative', zIndex: 999999, cursor: 'pointer' }} className="glass-card p-2 rounded-2xl card-hover border border-white/50 shadow-sm relative overflow-hidden group flex flex-col h-full min-h-[190px] bg-white/60">
                                    <div className="relative w-full h-32 -mt-2 -mx-2 mb-2 overflow-hidden rounded-t-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center text-4xl">
                                        {offer.img}
                                        <div className="absolute top-2 right-2 font-mono font-bold text-emerald-600 bg-white/95 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-[13px] border border-emerald-500/20 shadow-md z-10">
                                            +${offer.reward.toFixed(2)}
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-start px-1">
                                        <h4 className="font-black text-[13px] line-clamp-1 group-hover:text-indigo-600 transition-colors uppercase tracking-tight leading-tight">{offer.title}</h4>
                                        <p className="text-[10px] text-slate-500 line-clamp-1 leading-none opacity-90 group-hover:opacity-100 transition-opacity">
                                            <span className="font-bold text-indigo-500/80 mr-1 uppercase">[{offer.cat}]</span>
                                            High paying task for active users.
                                        </p>
                                    </div>
                                    <div className="mt-1">
                                        <div className="w-full bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-900 py-1 rounded-lg font-black text-[12px] uppercase tracking-wider block text-center transition-all transform hover:scale-[1.02]">
                                            Start Earning
                                        </div>
                                    </div>
                                </a >
                            ))}
                        </div>
                    </div>
                </section>

                {/* 3. Payment Methods */}
                <section className="py-12 md:py-16 relative overflow-hidden border-t border-slate-100 text-center bg-indigo-600">
                    {/* Animated Background Logos Layer */}
                    <div className="absolute inset-0 z-0 pointer-events-none">
                        {/* PayPal Floating */}
                        <div className="absolute top-[10%] left-[5%] animate-floating-slow">
                            <Image src="/images/payments/paypal.png" alt="PayPal" width={100} height={50} className="drop-shadow-sm object-contain" unoptimized />
                        </div>
                        {/* Mastercard Floating */}
                        <div className="absolute bottom-[15%] left-[82%] animate-floating">
                            <Image src="/images/payments/mastercard.png" alt="Mastercard" width={90} height={50} className="drop-shadow-sm object-contain" unoptimized />
                        </div>
                        {/* Bitcoin Floating */}
                        <div className="absolute top-[20%] left-[85%] animate-floating-fast">
                            <Image src="/images/payments/bitcoin.png" alt="Bitcoin" width={70} height={70} className="drop-shadow-md object-contain" unoptimized />
                        </div>
                        {/* USDT Floating */}
                        <div className="absolute bottom-[20%] left-[10%] animate-floating-slow">
                            <Image src="/images/payments/usdt.png" alt="USDT" width={70} height={70} className="drop-shadow-md object-contain" unoptimized />
                        </div>
                        {/* Litecoin Floating */}
                        <div className="absolute top-[60%] left-[5%] animate-floating">
                            <Image src="/images/payments/litecoin.png" alt="Litecoin" width={65} height={65} className="drop-shadow-md object-contain" unoptimized />
                        </div>
                        {/* GiftCard Floating */}
                        <div className="absolute bottom-[2%] left-[75%] animate-floating-slow">
                            <Image src="/images/payments/giftcard.png" alt="Gift Card" width={110} height={70} className="drop-shadow-lg object-contain" unoptimized />
                        </div>
                    </div>


                    <div className="container mx-auto px-4 relative z-20">
                        <h2 className="text-3xl font-black text-white mb-6 uppercase tracking-tight">Multiple Withdrawal Options</h2>
                        <div className="flex flex-wrap justify-center gap-4 md:gap-6 max-w-5xl mx-auto">
                            {[
                                { name: 'Visa/Mastercard', icon: '💳' },
                                { name: 'PayPal', icon: '💰' },
                                { name: 'Bitcoin', icon: '₿' },
                                { name: 'Ethereum', icon: 'Ξ' },
                                { name: 'USDT', icon: '💵' },
                                { name: 'Gift Cards', icon: '🎁' },
                                { name: 'Mobile Money', icon: '📱' },
                                { name: 'Bank Transfer', icon: '🏦' }
                            ].map((method, index) => (
                                <span key={index} className="bg-white/80 border border-white/50 px-6 py-2 rounded-2xl font-bold text-slate-700 shadow-sm hover:bg-white transition-all text-sm backdrop-blur-md">
                                    <span className="mr-2">{method.icon}</span>{method.name}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 3.1 Latest Blog Posts */}
                <section className="py-8 md:py-12 relative overflow-hidden border-t border-slate-500 bg-slate-600 z-[30]">
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-0"></div>
                    <div className="container mx-auto px-4 relative z-20">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">📝 Latest from Blog</h2>
                            <a href="/blog" style={{ position: 'relative', zIndex: 999999, cursor: 'pointer' }} className="text-sm font-bold text-indigo-400 hover:text-indigo-300">
                                See All Blog →
                            </a>
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {blogPosts.slice(0, 4).map((post) => (
                                <a key={post.id} href={`/blog/${post.slug}`} style={{ position: 'relative', zIndex: 999999, cursor: 'pointer', display: 'flex' }} className="glass-card p-6 rounded-3xl bg-white/60 border border-white/50 group hover:scale-[1.02] transition-all flex-col h-full hover:bg-white/80">
                                    <div className="flex flex-col h-full w-full">
                                        <div className="mb-4">
                                            <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest group-hover:bg-indigo-100 transition-colors">
                                                {post.category}
                                            </span>
                                        </div>
                                        <h4 className="text-base font-black text-slate-900 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors mb-4">
                                            {post.title}
                                        </h4>
                                        <p className="text-xs text-slate-500 line-clamp-4 leading-relaxed font-medium flex-grow">
                                            {post.excerpt}
                                        </p>
                                        <div className="mt-4 pt-4 border-t border-slate-100/50 flex items-center text-indigo-500 text-[10px] font-bold uppercase tracking-wide group-hover:text-indigo-600">
                                            Read More <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 3.2 Ready to Start Earning CTA */}
                {/* 3.2 Ready to Start Earning CTA */}
                <section className="py-12 md:py-16 relative overflow-hidden bg-indigo-600 text-white text-center">
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-400 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
                    </div>
                    <div className="container mx-auto px-4 relative z-10">
                        <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">Ready to Start Earning?</h2>
                        <p className="text-lg md:text-xl text-indigo-100 mb-8 max-w-2xl mx-auto font-medium">Join thousands of users already making money online. Your first reward is just minutes away!</p>
                        <a href="/register" style={{ position: 'relative', zIndex: 999999, cursor: 'pointer' }} className="inline-block bg-white text-indigo-600 px-8 py-3 md:px-10 md:py-4 text-lg font-black rounded-2xl shadow-xl hover:scale-105 transition-all">Sign Up Now - It&apos;s Free!</a>
                    </div>
                </section>
            </main>

            {/* 4. Footer - Natural Interaction Model */}
            <footer className="relative z-[60] border-t border-slate-700 py-4 md:py-6 bg-slate-800">
                <div className="absolute inset-0 bg-black/20 backdrop-blur-md -z-10"></div>
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
                        <div>
                            <h3 className="font-black text-xl mb-6 text-indigo-400 tracking-tight uppercase">TaskSpot</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">Earn rewards by completing simple tasks from trusted advertisers.</p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-6 text-white uppercase text-xs tracking-widest">Company</h4>
                            <ul className="space-y-4 text-sm font-bold text-slate-400">
                                <li><a href="/about" style={{ position: 'relative', zIndex: 999999, cursor: 'pointer' }} className="hover:text-indigo-400 transition-all">About Us</a></li>
                                <li><a href="/contact" style={{ position: 'relative', zIndex: 999999, cursor: 'pointer' }} className="hover:text-indigo-400 transition-all">Contact</a></li>
                                <li><a href="/faq" style={{ position: 'relative', zIndex: 999999, cursor: 'pointer' }} className="hover:text-indigo-400 transition-all">FAQ</a></li>
                                <li><a href="/blog" style={{ position: 'relative', zIndex: 999999, cursor: 'pointer' }} className="hover:text-indigo-400 transition-all">Blog</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-6 text-white uppercase text-xs tracking-widest">Legal</h4>
                            <ul className="space-y-4 text-sm font-bold text-slate-400">
                                <li><a href="/terms" style={{ position: 'relative', zIndex: 999999, cursor: 'pointer' }} className="hover:text-indigo-400 transition-all">Terms &amp; Conditions</a></li>
                                <li><a href="/privacy" style={{ position: 'relative', zIndex: 999999, cursor: 'pointer' }} className="hover:text-indigo-400 transition-all">Privacy Policy</a></li>
                                <li><a href="/disclaimer" style={{ position: 'relative', zIndex: 999999, cursor: 'pointer' }} className="hover:text-indigo-400 transition-all">Disclaimer</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-6 text-white uppercase text-xs tracking-widest">Support</h4>
                            <ul className="space-y-4 text-sm font-bold text-slate-400">
                                <li><a href="/help" style={{ position: 'relative', zIndex: 999999, cursor: 'pointer' }} className="hover:text-indigo-400 transition-all">Help Center</a></li>
                                <li><a href="/support" style={{ position: 'relative', zIndex: 999999, cursor: 'pointer' }} className="hover:text-indigo-400 transition-all">Contact Support</a></li>
                                <li className="text-[10px] text-slate-500 lowercase pt-2">Email: <a href="mailto:support@taskspot.site" className="hover:text-indigo-400 transition-colors">support@taskspot.site</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-700 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        <p>© 2026 TaskSpot Official Platform.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}