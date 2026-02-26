'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import OTPInput from './OTPInput';

const SignupForm = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState<'form' | 'verification'>('form');
    const { signup, login, sendOTP, verifyOTP } = useAuth();
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        setIsSubmitting(true);
        try {
            const code = await sendOTP(formData.email);
            if (code) {
                setStep('verification');
            }
        } catch (error) {
            console.error('Error sending OTP', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleVerify = async (code: string) => {
        const isVerified = await verifyOTP(formData.email, code);
        if (isVerified) {
            const input = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password
            };
            const success = await signup(input);
            if (success) {
                // Auto-login after successful signup
                const loginSuccess = await login(formData.email, formData.password);
                if (loginSuccess) {
                    window.location.href = '/';
                } else {
                    router.push('/login');
                }
            }
        } else {
            alert('Invalid verification code. Please try again.');
        }
    };

    const handleResend = async () => {
        await sendOTP(formData.email);
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
                        <h1 className="text-3xl font-bold tracking-tighter mb-2 text-white">JOIN THE CLUB</h1>
                        <p className="text-zinc-400">Create your OQHUBS account today</p>
                    </div>

                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-medium uppercase tracking-widest text-zinc-300 ml-1">First Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                    <input
                                        type="text"
                                        name="firstName"
                                        required
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="w-full bg-zinc-900/50 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-white/20 transition-colors placeholder:text-zinc-600"
                                        placeholder="John"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium uppercase tracking-widest text-zinc-300 ml-1">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    required
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full bg-zinc-900/50 border border-white/5 rounded-xl py-4 px-4 text-sm text-white focus:outline-none focus:border-white/20 transition-colors placeholder:text-zinc-600"
                                    placeholder="Doe"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium uppercase tracking-widest text-zinc-300 ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-zinc-900/50 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-white/20 transition-colors placeholder:text-zinc-600"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium uppercase tracking-widest text-zinc-300 ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full bg-zinc-900/50 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-white/20 transition-colors placeholder:text-zinc-600"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium uppercase tracking-widest text-zinc-300 ml-1">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full bg-zinc-900/50 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-white/20 transition-colors placeholder:text-zinc-600"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full group relative overflow-hidden bg-white text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    CREATE ACCOUNT
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm">
                        <span className="text-zinc-400">Already have an account? </span>
                        <Link href="/login" className="text-white hover:text-white/80 underline decoration-white/20 underline-offset-4 transition-all uppercase tracking-widest text-[10px] font-bold">Login</Link>
                    </div>
                </>
            ) : (
                <OTPInput
                    email={formData.email}
                    onVerify={handleVerify}
                    onResend={handleResend}
                />
            )}
        </motion.div>
    );
};

export default SignupForm;
