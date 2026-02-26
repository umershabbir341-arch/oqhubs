'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, RefreshCcw, Loader2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OTPInputProps {
    email: string;
    onVerify: (code: string) => Promise<void>;
    onResend: () => Promise<void>;
}

const OTPInput = ({ email, onVerify, onResend }: OTPInputProps) => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else {
            setCanResend(true);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleChange = (index: number, value: string) => {
        // Only allow numbers
        const numericValue = value.replace(/[^0-9]/g, '');

        if (numericValue.length > 1) {
            // Handle paste
            const pastedData = numericValue.slice(0, 6).split('');
            const newOtp = [...otp];
            pastedData.forEach((char, i) => {
                if (index + i < 6) newOtp[index + i] = char;
            });
            setOtp(newOtp);
            // Focus last pasted or next empty
            const nextIndex = Math.min(index + pastedData.length, 5);
            inputRefs.current[nextIndex]?.focus();
            return;
        }

        const newOtp = [...otp];
        newOtp[index] = numericValue;
        setOtp(newOtp);

        if (numericValue !== '' && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const code = otp.join('');
        if (code.length !== 6) return;

        setIsSubmitting(true);
        try {
            await onVerify(code);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResend = async () => {
        if (!canResend) return;
        setCanResend(false);
        setTimer(60);
        await onResend();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 border border-white/10 mb-4">
                    <ShieldCheck className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tighter">VERIFY YOUR EMAIL</h2>
                <p className="text-zinc-400 text-sm max-w-[280px] mx-auto">
                    We've sent a code to <span className="text-white font-medium">{email}</span>
                </p>
            </div>

            <div className="flex justify-between gap-2 max-w-sm mx-auto">
                {otp.map((digit, index) => (
                    <input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="w-12 h-16 md:w-14 md:h-20 bg-zinc-900 border border-white/5 rounded-xl text-2xl font-bold text-white text-center focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all"
                    />
                ))}
            </div>

            <div className="space-y-4">
                <button
                    type="submit"
                    disabled={isSubmitting || otp.some(d => d === '')}
                    className="w-full group relative overflow-hidden bg-white text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            VERIFY & CONTINUE
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>

                <div className="text-center pt-2">
                    {canResend ? (
                        <button
                            type="button"
                            onClick={handleResend}
                            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
                        >
                            <RefreshCcw className="w-3 h-3" />
                            Resend Code
                        </button>
                    ) : (
                        <p className="text-xs font-bold uppercase tracking-widest text-zinc-600">
                            Resend code in {timer}s
                        </p>
                    )}
                </div>
            </div>
        </form>
    );
};

export default OTPInput;
