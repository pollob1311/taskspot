'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export const ShatterText = () => {
    const text = "Earn Your Reward";
    const characters = text.split("");
    const [scatterValues, setScatterValues] = useState<{ x: number, y: number, r: number }[]>([]);

    useEffect(() => {
        // Generate random values only on client side to avoid hydration mismatch
        const values = characters.map(() => ({
            x: Math.random() * 400 - 200,
            y: Math.random() * 400 - 200,
            r: Math.random() * 360 - 180
        }));
        setScatterValues(values);
    }, [text, characters]); // Added characters to fix ESLint warning

    const charVariants = {
        idle: (i: number) => ({
            y: [0, -15, 0],
            transition: {
                y: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.1,
                }
            }
        }),
        hover: (i: number) => {
            const scatter = scatterValues[i] || { x: 0, y: 0, r: 0 };
            return {
                x: scatter.x,
                y: scatter.y,
                rotate: scatter.r,
                color: ["#111827", "#7c3aed", "#0891b2"],
                scale: 0.5,
                transition: {
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                    color: { duration: 0.6, type: "tween" }
                }
            };
        }
    };

    const words = text.split(" ");
    let charCounter = 0;

    return (
        <div className="relative inline-block cursor-default group pb-10">
            {/* Background Moving Dot (nodir dheu) */}
            <motion.div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-96 md:h-96 rounded-full bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-cyan-500/20 blur-3xl -z-10"
                animate={{
                    x: ["-50%", "-45%", "-55%", "-50%"],
                    y: ["-50%", "-55%", "-45%", "-50%"],
                    scale: [1, 1.2, 0.9, 1],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Shattering Text */}
            <h1 className="text-[clamp(1.5rem,8vw,8rem)] font-black tracking-tight flex items-center justify-center gap-x-[2vw] lg:gap-x-[4vw] text-gray-900 select-none relative z-10 w-full px-4 leading-none whitespace-nowrap overflow-visible">
                {words.map((word, wordIndex) => {
                    return (
                        <div key={wordIndex} className="flex items-center gap-x-[1px] sm:gap-x-[2px] relative">
                            {word.split("").map((char) => {
                                const currentIndex = charCounter++;
                                return (
                                    <motion.span
                                        key={currentIndex}
                                        className="inline-block relative"
                                        custom={currentIndex}
                                        variants={charVariants}
                                        animate="idle"
                                        whileHover="hover"
                                    >
                                        {char}
                                    </motion.span>
                                );
                            })}

                            {/* Attach Dot to the last word */}
                            {wordIndex === words.length - 1 && (
                                <span className="w-[0.12em] h-[0.12em] md:w-[0.2em] md:h-[0.2em] rounded-full inline-block dot-cycle border-none bg-neon-purple absolute -right-[0.25em] bottom-[0.2em]"></span>
                            )}
                        </div>
                    );
                })}
            </h1>
        </div>
    );
};
