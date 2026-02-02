'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BackgroundParticles } from '@/components/BackgroundParticles';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('If an account exists with that email, we have sent a reset link.');
            } else {
                setError(data.error || 'Something went wrong. Please try again.');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 font-sans antialiased relative">
            <BackgroundParticles />
            <div className="bg-white/90 border border-green-100 shadow-xl max-w-md w-full p-8 rounded-2xl relative z-10">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-6">
                        <Image
                            src="/taskspot-logo.png"
                            alt="TaskSpot"
                            width={384}
                            height={96}
                            className="h-24 w-auto object-contain"
                            priority
                        />
                    </div>
                    <h1 className="text-3xl font-extrabold text-[#0f172a] mb-2 tracking-tight">Forgot Password</h1>
                    <p className="text-slate-500 font-medium">Enter your email to reset your password</p>
                </div>

                {error && (
                    <div className="bg-red-500/20 border border-red-500 text-red-700 px-4 py-3 rounded-lg mb-4 text-center font-bold">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-emerald-500/20 border border-emerald-500 text-emerald-700 px-4 py-3 rounded-lg mb-4 text-center font-bold">
                        {success}
                    </div>
                )}

                {!success && (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all font-medium"
                                placeholder="your@email.com"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-lg font-bold shadow-lg shadow-green-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
                        >
                            {loading ? 'Sending Request...' : 'Send Reset Link'}
                        </button>
                    </form>
                )}

                <div className="mt-8 text-center border-t border-slate-100 pt-6">
                    <p className="text-slate-500 font-medium">
                        Remembered your password?{' '}
                        <Link href="/login" className="text-green-600 hover:text-green-700 font-bold transition-colors">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
