'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import OTPInput from './OTPInput';
import Swal from 'sweetalert2';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState<'form' | 'verification'>('form');
    const { login, isEmailVerified, sendOTP, verifyOTP } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!isEmailVerified(email)) {
            const result = await Swal.fire({
                title: 'Verify Email',
                text: 'Your email is not verified. Would you like to send a verification code now?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Yes, send code',
                confirmButtonColor: '#000',
                cancelButtonColor: '#d33'
            });

            if (result.isConfirmed) {
                const code = await sendOTP(email);
                if (code) {
                    setStep('verification');
                }
            }
            setIsSubmitting(false);
            return;
        }

        const success = await login(email, password);
        if (success) {
            window.location.href = '/';
        }
        setIsSubmitting(false);
    };

    const handleVerify = async (code: string) => {
        const isVerified = await verifyOTP(email, code);
        if (isVerified) {
            // Attempt auto-login if password is present
            if (password) {
                const success = await login(email, password);
                if (success) {
                    window.location.href = '/';
                    return;
                }
            }

            setStep('form');
            Swal.fire({
                title: 'Verified!',
                text: 'Email verified successfully. You can now login.',
                icon: 'success',
                confirmButtonColor: '#000'
            });
        } else {
            alert('Invalid verification code. Please try again.');
        }
    };

    const handleResend = async () => {
        await sendOTP(email);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md p-8 bg-black border border-white/5 rounded-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)]"
        >
            {step === 'form' ? (
                <>
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold tracking-tighter mb-2 text-white">WELCOME BACK</h1>
                        <p className="text-zinc-400">Login to access your OQHUBS account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-medium uppercase tracking-widest text-zinc-300 ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-zinc-900/50 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-white/20 transition-colors placeholder:text-zinc-600"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs font-medium uppercase tracking-widest text-zinc-300">Password</label>
                                <button type="button" className="text-[10px] uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">Forgot?</button>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-zinc-900/50 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-white/20 transition-colors placeholder:text-zinc-600"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full group relative overflow-hidden bg-white text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    CONTINUE
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm">
                        <span className="text-zinc-400">Don't have an account? </span>
                        <Link href="/signup" className="text-white hover:text-white/80 underline decoration-white/20 underline-offset-4 transition-all uppercase tracking-widest text-[10px] font-bold">Sign up</Link>
                    </div>
                </>
            ) : (
                <OTPInput
                    email={email}
                    onVerify={handleVerify}
                    onResend={handleResend}
                />
            )}
        </motion.div>
    );
};

export default LoginForm;
