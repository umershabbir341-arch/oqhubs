"use client";

import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps {
    text: string;
    onClick?: () => void;
    className?: string;
    variant?: 'white' | 'black';
    size?: 'sm' | 'md' | 'lg';
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
    text,
    onClick,
    className,
    variant = 'white',
    size = 'md'
}) => {
    const isWhite = variant === 'white';

    const sizeClasses = {
        sm: 'h-[42px] px-5 text-[14px]',
        md: 'h-[52px] px-6 text-[16px]',
        lg: 'h-[62px] px-8 text-[18px]'
    };

    const arrowSizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-12 h-12'
    };

    const iconSize = {
        sm: 16,
        md: 18,
        lg: 22
    };

    return (
        <motion.button
            whileHover="hover"
            initial="initial"
            onClick={onClick}
            className={cn(
                "relative flex items-center justify-between rounded-full font-bold overflow-hidden cursor-pointer border-none transition-shadow duration-300",
                isWhite ? "bg-white text-black" : "bg-[#0c0c0c] text-white",
                "shadow-[0_4px_14px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)]",
                sizeClasses[size],
                className
            )}
        >
            {/* Fill Animation Layer - Grows from the arrow position */}
            <div className="absolute inset-0 z-0 flex items-center justify-end pr-[4px]">
                <motion.div
                    className={cn(
                        "rounded-full",
                        isWhite ? "bg-[#1a1a1a]" : "bg-white"
                    )}
                    variants={{
                        initial: {
                            width: "40px",
                            height: "40px",
                            scale: 0,
                            opacity: 0
                        },
                        hover: {
                            scale: 35, // Large enough to cover the whole button
                            opacity: 1,
                            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
                        }
                    }}
                />
            </div>

            {/* Content Container - Spaced Apart */}
            <div className="relative z-10 flex items-center justify-between w-full h-full">
                <motion.span
                    className="tracking-tight pl-1"
                    variants={{
                        initial: { color: isWhite ? "#000000" : "#ffffff" },
                        hover: {
                            color: isWhite ? "#ffffff" : "#000000",
                            transition: { duration: 0.4, ease: "easeInOut" }
                        }
                    }}
                >
                    {text}
                </motion.span>

                <div className={cn(
                    "flex items-center justify-center rounded-full shrink-0 transition-colors duration-300 ml-4",
                    arrowSizeClasses[size],
                    isWhite ? "bg-black" : "bg-white"
                )}>
                    <motion.div
                        variants={{
                            initial: { x: 0 },
                            hover: {
                                x: 2,
                                transition: { duration: 0.4, ease: "easeOut" }
                            }
                        }}
                    >
                        <ArrowRight
                            size={iconSize[size]}
                            color={isWhite ? "white" : "black"}
                        />
                    </motion.div>
                </div>
            </div>
        </motion.button>
    );
};

export default AnimatedButton;
