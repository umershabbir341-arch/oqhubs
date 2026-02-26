"use client";

import React from 'react';
import { motion } from 'motion/react';

const Loader = () => {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{
                opacity: 0,
                transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
            }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-background overflow-hidden"
        >
            {/* Background elements for depth */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.05 }}
                exit={{ opacity: 0 }}
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
            >
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-primary to-transparent" />
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-primary to-transparent" />
            </motion.div>

            <div className="relative flex flex-col items-center gap-12">
                {/* Brand Text with Shimmer Effect */}
                <div className="relative overflow-hidden pt-2">
                    <motion.h1
                        initial={{ y: 60, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{
                            y: -20,
                            opacity: 0,
                            transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
                        }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="text-6xl md:text-8xl font-black tracking-tighter uppercase text-primary m-0 leading-none"
                    >
                        OQHUBS
                    </motion.h1>

                    {/* Animated Shimmer Over Text */}
                    <motion.div
                        initial={{ x: "-150%" }}
                        animate={{ x: "150%" }}
                        transition={{
                            repeat: Infinity,
                            duration: 2.5,
                            ease: "easeInOut",
                            repeatDelay: 0.2
                        }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 mix-blend-overlay"
                    />
                </div>

                {/* Geometric Progress Indicator */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: 0.3 }}
                    className="flex gap-4"
                >
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            animate={{
                                scale: [1, 1.4, 1],
                                opacity: [0.4, 1, 0.4],
                                borderRadius: ["2px", "50%", "2px"]
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: i * 0.15,
                                ease: "easeInOut"
                            }}
                            className="w-2.5 h-2.5 bg-primary"
                        />
                    ))}
                </motion.div>

                {/* Subtle Progress Bar-ish indicator at the bottom */}
                <motion.div
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.3 } }}
                    className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-64 h-[2px] bg-primary/5 overflow-hidden origin-center"
                >
                    <motion.div
                        animate={{
                            x: ["-100%", "100%"],
                            transition: {
                                duration: 1.8,
                                repeat: Infinity,
                                ease: [0.4, 0, 0.2, 1]
                            }
                        }}
                        className="w-1/2 h-full bg-primary/40"
                    />
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Loader;
