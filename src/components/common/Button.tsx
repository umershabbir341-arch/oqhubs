"use client";

import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
    text: string;
    variant?: 'white' | 'black';
    size?: 'sm' | 'md' | 'lg';
    showArrow?: boolean;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
    text,
    variant = 'white',
    size = 'md',
    showArrow = true,
    className,
    type = 'button',
    ...props
}) => {
    const isWhite = variant === 'white';

    const sizeClasses = {
        sm: cn('h-[52px] pl-4 text-[14px]', showArrow ? 'pr-1' : 'pr-4'),
        md: cn('h-[62px] pl-5 text-[16px]', showArrow ? 'pr-1.5' : 'pr-5'),
        lg: cn('h-[78px] pl-7 text-[18px]', showArrow ? 'pr-2' : 'pr-7')
    };

    const arrowSizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-[44px] h-[44px]',
        lg: 'w-[54px] h-[54px]'
    };

    const iconSize = {
        sm: 14,
        md: 18,
        lg: 22
    };

    return (
        <motion.button
            whileHover="hover"
            initial="initial"
            type={type}
            className={cn(
                "relative flex items-center justify-between rounded-full font-bold overflow-hidden cursor-pointer border-none transition-shadow duration-300",
                isWhite ? "bg-white text-black" : "bg-[#0c0c0c] text-white",
                "shadow-[0_4px_14px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)]",
                sizeClasses[size],
                !showArrow && "justify-center",
                className
            )}
            {...props}
        >
            {/* Fill Animation Layer */}
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
                            scale: 35,
                            opacity: 1,
                            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
                        }
                    }}
                />
            </div>

            {/* Content Container */}
            <div className={cn(
                "relative z-10 flex items-center justify-between h-full",
                showArrow ? "w-full" : "w-auto"
            )}>
                <motion.span
                    className={cn("tracking-tight", showArrow && "pl-1")}
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

                {showArrow && (
                    <div className={cn(
                        "flex items-center justify-center rounded-full shrink-0 transition-colors duration-300",
                        variant === 'white' ? "bg-black" : "bg-white",
                        arrowSizeClasses[size],
                        size === 'lg' ? "ml-6" : size === 'md' ? "ml-4" : "ml-3"
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
                )}
            </div>
        </motion.button>
    );
};

export default Button;
