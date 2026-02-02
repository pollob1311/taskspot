'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { BackgroundParticles } from '@/components/BackgroundParticles';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Verifying your email...');

    useEffect(() => {
        const token = searchParams.get('token');

        if (!token) {
            setStatus('error');
            setMessage('Missing verification token.');
            return;
        }

        const verifyToken = async () => {
            try {
                const response = await fetch(`/api/auth/verify?token=${token}`);
                if (response.ok) {
                    setStatus('success');
                    setMessage('Your email has been successfully verified! You can now log in to your account.');
                } else {
                    const data = await response.json();
                    setStatus('error');
                    setMessage(data.error || 'Verification failed. The link may have expired or is invalid.');
                }
            } catch (error) {
                setStatus('error');
                setMessage('An error occurred. Please try again later.');
            }
        };

        verifyToken();
    }, [searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 font-sans antialiased relative">
            <BackgroundParticles />
            <div className="bg-white/90 border border-slate-200 shadow-xl max-w-md w-full p-10 rounded-3xl text-center relative z-10">
                {status === 'loading' && (
                    <div className="flex flex-col items-center">
                        <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mb-6" />
                        <h1 className="text-2xl font-black text-slate-900 mb-2">Verifying...</h1>
                        <p className="text-slate-500 font-medium">{message}</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center">
                        <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-6" />
                        <h1 className="text-2xl font-black text-slate-900 mb-2">Verified!</h1>
                        <p className="text-slate-500 font-medium mb-8">{message}</p>
                        <Link
                            href="/login"
                            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
                        >
                            Go to Login
                        </Link>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex flex-col items-center">
                        <XCircle className="w-16 h-16 text-red-500 mb-6" />
                        <h1 className="text-2xl font-black text-slate-900 mb-2">Verification Failed</h1>
                        <p className="text-slate-500 font-medium mb-8">{message}</p>
                        <Link
                            href="/register"
                            className="w-full bg-slate-100 text-slate-700 py-4 rounded-2xl font-black text-lg hover:bg-slate-200 transition-all active:scale-95 mb-4"
                        >
                            Back to Register
                        </Link>
                        <Link
                            href="/support"
                            className="text-indigo-600 font-bold hover:underline"
                        >
                            Need help? Contact Support
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyEmailContent />
        </Suspense>
    );
}
