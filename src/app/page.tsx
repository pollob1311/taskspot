import { ShatterText } from '@/components/ShatterText';
import { BackgroundParticles } from '@/components/BackgroundParticles';
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
    return (
        <div className="min-h-screen relative">
            <BackgroundParticles />
            {/* Hero Section */}
            <section className="relative overflow-hidden min-h-[60vh] flex items-center justify-center">

                {/* ... other background elements ... */}

                <div className="relative container mx-auto px-4 z-10 -mt-10">
                    <div className="max-w-5xl mx-auto text-center">
                        {/* Logo Badge */}
                        <div className="inline-block mb-0 animate-fade-in">
                            <div className="flex items-center justify-center p-0">
                                <Image
                                    src="/taskspot-logo.png"
                                    alt="TaskSpot Logo"
                                    width={300}
                                    height={150}
                                    className="w-[300px] h-auto object-contain drop-shadow-xl hover:scale-105 transition-transform duration-300"
                                    priority
                                />
                            </div>
                        </div>

                        {/* Interactive Main Headline */}
                        <div className="mb-4 animate-slide-up w-full max-w-none">
                            <ShatterText />
                        </div>

                        <p className="text-xl md:text-2xl mb-6 text-gray-600 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            Join the elite network. Complete high-value tasks.
                            <br className="hidden md:block" />
                            Get paid in <span className="text-neon-cyan font-bold">Crypto</span>, <span className="text-neon-purple font-bold">Cards</span>, or <span className="text-neon-blue font-bold">Cash</span>.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                            <a
                                href="/register"
                                className="btn-gradient btn-reflect px-10 py-5 text-2xl font-black rounded-xl shadow-glow transition-all hover:scale-105"
                            >
                                Start Earning
                            </a>
                            <a
                                href="#how-it-works"
                                className="glass-card px-10 py-5 text-xl rounded-xl hover:bg-white transition-all border-gray-200 hover:border-neon-purple text-gray-800 flex items-center justify-center font-semibold"
                            >
                                How It Works
                            </a>
                            <a
                                href="/blog"
                                className="glass-card px-10 py-5 text-xl rounded-xl hover:bg-white transition-all border-gray-200 hover:border-neon-purple text-gray-800 flex items-center justify-center font-semibold"
                            >
                                Read Blog
                            </a>
                            <a
                                href="/register"
                                className="inline-block bg-white text-neon-cyan font-bold px-10 py-5 rounded-xl hover:scale-105 transition-transform text-xl shadow-lg border border-cyan-100 flex items-center justify-center"
                            >
                                Sign Up Now - It&apos;s Free!
                            </a>
                        </div>

                        {/* Trust Indicators */}
                        <div className="flex flex-wrap justify-center gap-12 text-sm text-gray-600 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                            <div className="flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-neon-success"></span>
                                <span>$500k+ Paid Out</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-neon-purple"></span>
                                <span>Instant Withdrawals</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-neon-blue"></span>
                                <span>Global Access</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-12 bg-[var(--background)]">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-8">
                        How It Works
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {/* Step 1 */}
                        <Link href="/register" className="glass-card p-8 rounded-2xl text-center card-hover block h-full">
                            <div className="text-5xl mb-4">📝</div>
                            <h3 className="text-2xl font-semibold mb-3">1. Register</h3>
                            <p className="text-[var(--muted)]">
                                Create your free account in under 2 minutes. No credit card required.
                            </p>
                        </Link>

                        {/* Step 2 */}
                        <div className="glass-card p-8 rounded-2xl text-center card-hover">
                            <div className="text-5xl mb-4">🎯</div>
                            <h3 className="text-2xl font-semibold mb-3">2. Complete Offers</h3>
                            <p className="text-[var(--muted)]">
                                Browse hundreds of offers and complete the ones you like. Earn points instantly.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="glass-card p-8 rounded-2xl text-center card-hover">
                            <div className="text-5xl mb-4">💸</div>
                            <h3 className="text-2xl font-semibold mb-3">3. Get Paid</h3>
                            <p className="text-[var(--muted)]">
                                Withdraw via PayPal, crypto, gift cards, or bank transfer. Your choice!
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Payment Methods */}
            <section className="py-20 bg-[var(--card)]">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-12">
                        Multiple Withdrawal Options
                    </h2>

                    <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
                        {[
                            '💳 Visa/Mastercard',
                            '💰 PayPal',
                            '₿ Bitcoin',
                            'Ξ Ethereum',
                            '💵 USDT',
                            '🎁 Gift Cards',
                            '📱 Mobile Money',
                            '🏦 Bank Transfer',
                        ].map((method, index) => (
                            <span
                                key={index}
                                className="glass-card px-6 py-3 rounded-full font-semibold"
                            >
                                {method}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-primary text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        Ready to Start Earning?
                    </h2>
                    <p className="text-xl mb-8">
                        Join thousands of users already making money online
                    </p>
                    <a
                        href="/register"
                        className="inline-block bg-white text-purple-600 font-bold px-8 py-4 rounded-full hover:scale-105 transition-transform text-lg"
                    >
                        Sign Up Now - It&apos;s Free!
                    </a>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[var(--card)] border-t border-[var(--muted)]/20 py-12">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="font-bold text-lg mb-4">TaskSpot</h3>
                            <p className="text-sm text-[var(--muted)]">
                                Earn rewards by completing simple tasks from trusted advertisers.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Company</h4>
                            <ul className="space-y-2 text-sm text-[var(--muted)]">
                                <li><a href="/about">About Us</a></li>
                                <li><a href="/contact">Contact</a></li>
                                <li><a href="/faq">FAQ</a></li>
                                <li><a href="/blog">Blog</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm text-[var(--muted)]">
                                <li><a href="/terms">Terms & Conditions</a></li>
                                <li><a href="/privacy">Privacy Policy</a></li>
                                <li><a href="/disclaimer">Disclaimer</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Support</h4>
                            <ul className="space-y-2 text-sm text-[var(--muted)]">
                                <li><a href="/help">Help Center</a></li>
                                <li><a href="/support">Contact Support</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-[var(--muted)]/20 text-center text-sm text-[var(--muted)]">
                        <p>&copy; 2025 TaskSpot. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
