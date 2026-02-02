'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { BackgroundParticles } from '@/components/BackgroundParticles';

function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        if (!token) {
            setError('Invalid or missing reset token');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Password reset successful! Redirecting to login...');
                setTimeout(() => {
                    router.push('/login?message=Your password has been reset successfully. Please log in.');
                }, 3000);
            } else {
                setError(data.error || 'Something went wrong. Please try again.');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 font-sans antialiased relative">
                <BackgroundParticles />
                <div className="bg-white/90 border border-green-100 shadow-xl max-w-md w-full p-8 rounded-2xl relative z-10 text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid Reset Link</h1>
                    <p className="text-slate-600 mb-6">This link is invalid or has expired.</p>
                    <Link href="/forgot-password" className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold">
                        Request New Link
                    </Link>
                </div>
            </div>
        );
    }

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
                    <h1 className="text-3xl font-extrabold text-[#0f172a] mb-2 tracking-tight">Set New Password</h1>
                    <p className="text-slate-500 font-medium">Create a new secure password</p>
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
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                New Password
                            </label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all font-medium"
                                placeholder="Min. 8 characters"
                                minLength={8}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all font-medium"
                                placeholder="Re-enter password"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-lg font-bold shadow-lg shadow-green-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
                        >
                            {loading ? 'Updating Password...' : 'Reset Password'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordContent />
        </Suspense>
    );
}
