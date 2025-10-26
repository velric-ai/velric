"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

// ==========================================
// 1. ANIMATED CIRCULAR PROGRESS (Card 1)
// ==========================================
export const AnimatedCircularProgress = ({ width = 280, height = 120 }) => {
    const [progress, setProgress] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        const animate = () => {
            setProgress((prev) => {
                if (prev >= 100) {
                    setIsCompleted(true);
                    // Stay at 100 for 3 seconds, then reset
                    setTimeout(() => {
                        setProgress(0);
                        setIsCompleted(false);
                    }, 3000);
                    return 100;
                }
                return prev + 0.5; // Smooth increment (slower)
            });
        };

        interval = setInterval(animate, 30);
        return () => clearInterval(interval);
    }, []);

    const circumference = 2 * Math.PI * 65;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/50 via-purple-800/30 to-purple-900/40 rounded-lg p-6">
            <div className="relative w-40 h-40 flex items-center justify-center">
                {/* Outer thick ring - background */}
                <svg
                    className="absolute w-full h-full"
                    viewBox="0 0 160 160"
                    style={{ transform: "rotate(-90deg)" }}
                >
                    {/* Background ring */}
                    <circle
                        cx="80"
                        cy="80"
                        r="65"
                        fill="none"
                        stroke="rgba(139, 92, 246, 0.15)"
                        strokeWidth="12"
                    />
                    {/* Animated progress ring - THICK */}
                    <circle
                        cx="80"
                        cy="80"
                        r="65"
                        fill="none"
                        stroke="url(#progressGradient)"
                        strokeWidth="12"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        style={{
                            filter: "drop-shadow(0 0 16px rgba(168, 85, 247, 0.9))",
                            transition: "stroke-dashoffset 0.05s linear",
                        }}
                    />
                    <defs>
                        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#c084fc" />
                            <stop offset="50%" stopColor="#a855f7" />
                            <stop offset="100%" stopColor="#0ea5e9" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Center text - animated number */}
                <div className="flex flex-col items-center justify-center z-10">
                    <motion.span
                        className="text-4xl font-bold bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent"
                        key={Math.floor(progress)}
                    >
                        {Math.floor(progress)}%
                    </motion.span>
                    <span className="text-sm text-purple-300 font-medium mt-2">
                        {isCompleted ? "Complete! ✓" : "Loading"}
                    </span>
                </div>

                {/* Decorative pulse on completion */}
                {isCompleted && (
                    <motion.div
                        className="absolute inset-0 rounded-full border-2 border-cyan-400"
                        initial={{ scale: 0.9, opacity: 1 }}
                        animate={{ scale: 1.3, opacity: 0 }}
                        transition={{ duration: 0.8 }}
                    />
                )}
            </div>
        </div>
    );
};

// ==========================================
// 2. ANIMATED TALENT/COMPANIES HORIZONTAL (Card 2 - No Guesswork)
// ==========================================
export const AnimatedTalentCompanies = ({ width = 280, height = 120, compact = false }) => {
    const [talentScale, setTalentScale] = useState(0.85);
    const [companyScale, setCompanyScale] = useState(0.85);
    const [dotPosition, setDotPosition] = useState(0);
    const [linePhase, setLinePhase] = useState(0);

    useEffect(() => {
        let frame = 0;
        const interval = setInterval(() => {
            frame = (frame + 1) % 120;

            // Pulsing scale for icons
            const pulseFactor = Math.sin((frame / 120) * Math.PI * 2);
            setTalentScale(0.88 + pulseFactor * 0.12);
            setCompanyScale(0.88 + pulseFactor * 0.12);

            // Animated dot moving left to right
            setDotPosition((frame / 120) * 100);
            setLinePhase(frame % 120);
        }, 30);

        return () => clearInterval(interval);
    }, []);

    if (compact) {
        // Mobile/compact version - VERTICAL ONLY
        return (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3 px-3 bg-gradient-to-br from-blue-900/50 via-blue-800/30 to-blue-900/40 rounded-lg">
                {/* Top: Talent Icon */}
                <motion.div
                    style={{ scale: talentScale }}
                    className="relative w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg"
                >
                    <div className="absolute w-14 h-14 rounded-full bg-emerald-400/30 animate-pulse" />
                    <svg className="w-7 h-7 text-white relative z-10" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                </motion.div>

                {/* Middle: Animated line */}
                <div className="relative w-1 h-6 bg-gradient-to-b from-emerald-400 via-cyan-400 to-purple-400 rounded">
                    <motion.div
                        className="absolute left-1/2 top-0 w-2 h-2 bg-white rounded-full -translate-x-1/2 shadow-lg"
                        animate={{ top: `${(dotPosition / 100) * 24}px` }}
                        transition={{ type: "tween", duration: 0 }}
                    />
                </div>

                {/* Bottom: Companies Icon */}
                <motion.div
                    style={{ scale: companyScale }}
                    className="relative w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg"
                >
                    <div className="absolute w-14 h-14 rounded-full bg-purple-400/30 animate-pulse" />
                    <svg className="w-7 h-7 text-white relative z-10" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
                    </svg>
                </motion.div>

                {/* Labels */}
                <div className="text-center mt-2">
                    <p className="text-xs text-emerald-400 font-bold">Talent</p>
                    <p className="text-xs text-gray-500">↓</p>
                    <p className="text-xs text-purple-400 font-bold">Companies</p>
                </div>
            </div>
        );
    }

    // Desktop version - HORIZONTAL
    return (
        <div className="w-full h-full flex items-center justify-center gap-6 px-4 bg-gradient-to-br from-blue-900/50 via-blue-800/30 to-blue-900/40 rounded-lg">
            {/* Talent Side */}
            <div className="flex flex-col items-center gap-2">
                <motion.div
                    style={{ scale: talentScale }}
                    className="relative w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-xl"
                >
                    <div className="absolute w-20 h-20 rounded-full bg-emerald-400/30 animate-pulse" />
                    <svg className="w-10 h-10 text-white relative z-10" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                </motion.div>
                <p className="text-sm text-emerald-400 font-bold">Talent</p>
            </div>

            {/* Connecting Line HORIZONTAL with animated arrow */}
            <div className="flex-1 h-16 relative flex items-center">
                {/* Line background */}
                <div className="w-full h-1.5 bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 rounded"></div>

                {/* Animated moving dot */}
                <motion.div
                    style={{ left: `${dotPosition}%` }}
                    className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-xl"
                    transition={{ type: "tween", duration: 0 }}
                >
                    <div className="absolute inset-0 rounded-full bg-white/50 animate-pulse" />
                </motion.div>

                {/* Arrow head that moves with the dot */}
                <motion.div
                    style={{ left: `${dotPosition}%` }}
                    className="absolute top-0 -translate-y-1/2"
                    transition={{ type: "tween", duration: 0 }}
                >
                    <svg className="w-5 h-5 text-emerald-400 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                    </svg>
                </motion.div>
            </div>

            {/* Companies Side */}
            <div className="flex flex-col items-center gap-2">
                <motion.div
                    style={{ scale: companyScale }}
                    className="relative w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-xl"
                >
                    <div className="absolute w-20 h-20 rounded-full bg-purple-400/30 animate-pulse" />
                    <svg className="w-10 h-10 text-white relative z-10" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
                    </svg>
                </motion.div>
                <p className="text-sm text-purple-400 font-bold">Companies</p>
            </div>
        </div>
    );
};

// ==========================================
// 3. ENHANCED AI DASHBOARD CHARTS (Card 3 - No Bias)
// ==========================================
export const AnimatedAIDashboard = ({ width = 400, height = 180, compact = false }) => {
    const [performanceValue, setPerformanceValue] = useState(0);
    const [growthValue, setGrowthValue] = useState(0);
    const [accuracyProgress, setAccuracyProgress] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        const animate = () => {
            setPerformanceValue((prev) => {
                if (prev >= 94) {
                    setIsCompleted(true);
                    setTimeout(() => {
                        setPerformanceValue(0);
                        setGrowthValue(0);
                        setAccuracyProgress(0);
                        setIsCompleted(false);
                    }, 3000);
                    return 94;
                }
                return prev + 0.5;
            });

            setGrowthValue((prev) => {
                if (prev >= 127) return 127;
                return prev + 0.6;
            });

            setAccuracyProgress((prev) => {
                if (prev >= 98.7) return 98.7;
                return prev + 0.45;
            });
        };

        interval = setInterval(animate, 30);
        return () => clearInterval(interval);
    }, []);

    const accuracyCircumference = 2 * Math.PI * 35;
    const accuracyDashoffset =
        accuracyCircumference - (accuracyProgress / 100) * accuracyCircumference;

    if (compact) {
        // Mobile/compact version
        return (
            <div className="w-full bg-gradient-to-br from-green-900/50 via-green-800/30 to-green-900/40 border border-green-500/20 rounded-lg p-3 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-gray-300">AI Dashboard</h4>
                    <motion.span
                        className="text-xs px-1.5 py-0.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold"
                        animate={{ opacity: [0.8, 1, 0.8] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        AI-POWERED
                    </motion.span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                    {/* Performance - Animated bars */}
                    <div className="flex flex-col items-center">
                        <div className="flex gap-0.5 mb-1 items-end h-7 bg-green-900/30 px-1 py-1 rounded">
                            <div className="w-0.5 bg-gradient-to-t from-blue-400 to-blue-300 rounded-sm" style={{ height: `${Math.min(performanceValue * 0.65, 100)}%` }}></div>
                            <div className="w-0.5 bg-gradient-to-t from-blue-400 to-blue-300 rounded-sm" style={{ height: `${Math.sin(performanceValue / 30) * 40 + 60}%` }}></div>
                            <div className="w-0.5 bg-gradient-to-t from-blue-400 to-blue-300 rounded-sm" style={{ height: `${Math.cos(performanceValue / 25) * 35 + 65}%` }}></div>
                            <div className="w-0.5 bg-gradient-to-t from-blue-400 to-blue-300 rounded-sm" style={{ height: `${Math.min(performanceValue, 94)}%` }}></div>
                        </div>
                        <p className="text-xs text-gray-400 mb-0.5 font-semibold">Performance</p>
                        <span className="text-xs font-bold text-blue-300">{Math.floor(performanceValue)}%</span>
                    </div>

                    {/* Growth - Animated arrow line */}
                    <div className="flex flex-col items-center">
                        <div className="h-7 w-full flex items-center justify-center bg-green-900/30 rounded px-1 relative overflow-hidden">
                            <svg className="w-full h-6" viewBox="0 0 100 60">
                                {/* Trend line */}
                                <polyline
                                    points={`5,55 ${5 + (growthValue / 127) * 40},${55 - (growthValue / 127) * 40} 50,20 ${50 + (growthValue / 127) * 30},${20 - (growthValue / 127) * 15} 95,15`}
                                    stroke="url(#growthGradient)"
                                    strokeWidth="2"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    style={{ transition: "all 0.05s linear" }}
                                />
                                {/* Arrow head */}
                                <polygon
                                    points={`${95 + (growthValue / 127) * 5},15 ${92 + (growthValue / 127) * 5},18 ${98 + (growthValue / 127) * 5},10`}
                                    fill="#22d3ee"
                                />
                                <defs>
                                    <linearGradient id="growthGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#22d3ee" />
                                        <stop offset="100%" stopColor="#06b6d4" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <p className="text-xs text-gray-400 mb-0.5 font-semibold">Growth</p>
                        <span className="text-xs font-bold text-cyan-300">+{Math.floor(growthValue)}%</span>
                    </div>

                    {/* Accuracy - Animated circle */}
                    <div className="flex flex-col items-center">
                        <div className="relative w-8 h-8 mb-1 flex items-center justify-center bg-green-900/30 rounded">
                            <svg className="w-7 h-7" viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)" }}>
                                <circle cx="50" cy="50" r="35" fill="none" stroke="rgba(236, 72, 153, 0.2)" strokeWidth="2" />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="35"
                                    fill="none"
                                    stroke="url(#accuracyGradient)"
                                    strokeWidth="2"
                                    strokeDasharray={accuracyCircumference}
                                    strokeDashoffset={accuracyDashoffset}
                                    strokeLinecap="round"
                                    style={{ transition: "stroke-dashoffset 0.05s linear", filter: "drop-shadow(0 0 4px rgba(236, 72, 153, 0.6))" }}
                                />
                                <defs>
                                    <linearGradient id="accuracyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#ec4899" />
                                        <stop offset="100%" stopColor="#f43f5e" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <p className="text-xs text-gray-400 mb-0.5 font-semibold">Accuracy</p>
                        <span className="text-xs font-bold text-pink-300">{accuracyProgress.toFixed(1)}%</span>
                    </div>
                </div>
            </div>
        );
    }

    // Desktop version
    return (
        <div className="w-full h-full bg-gradient-to-br from-green-900/50 via-green-800/30 to-green-900/40 border border-green-500/20 rounded-lg p-4 shadow-lg flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-gray-300">AI Dashboard</h4>
                <motion.span
                    className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold"
                    animate={{ opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    AI-POWERED
                </motion.span>
            </div>

            <div className="grid grid-cols-3 gap-4 flex-1">
                {/* Performance - Animated bars */}
                <div className="flex flex-col items-center justify-center">
                    <div className="flex gap-1 mb-2 items-end h-12 bg-gradient-to-b from-green-900/30 to-green-900/10 px-2 py-2 rounded">
                        <div className="w-1.5 bg-gradient-to-t from-blue-400 to-blue-300 rounded-sm" style={{ height: `${Math.min(performanceValue * 0.75, 100)}%`, transition: "all 0.05s linear" }}></div>
                        <div className="w-1.5 bg-gradient-to-t from-blue-400 to-blue-300 rounded-sm" style={{ height: `${Math.sin(performanceValue / 30) * 45 + 55}%`, transition: "all 0.05s linear" }}></div>
                        <div className="w-1.5 bg-gradient-to-t from-blue-400 to-blue-300 rounded-sm" style={{ height: `${Math.cos(performanceValue / 25) * 40 + 60}%`, transition: "all 0.05s linear" }}></div>
                        <div className="w-1.5 bg-gradient-to-t from-blue-400 to-blue-300 rounded-sm" style={{ height: `${Math.min(performanceValue, 94)}%`, transition: "all 0.05s linear" }}></div>
                    </div>
                    <p className="text-xs text-gray-400 mb-1 font-semibold">Performance</p>
                    <span className="text-lg font-bold text-blue-300">{Math.floor(performanceValue)}%</span>
                </div>

                {/* Growth - Animated arrow line */}
                <div className="flex flex-col items-center justify-center">
                    <div className="w-full h-12 flex items-center justify-center bg-gradient-to-b from-green-900/30 to-green-900/10 rounded px-2 overflow-hidden relative">
                        <svg className="w-full h-10" viewBox="0 0 120 60">
                            {/* Main trend line */}
                            <polyline
                                points={`5,55 ${5 + (growthValue / 127) * 50},${55 - (growthValue / 127) * 48} 65,12 ${65 + (growthValue / 127) * 35},${12 - (growthValue / 127) * 10} 110,8`}
                                stroke="url(#growthGradientDesktop)"
                                strokeWidth="2.5"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{ transition: "all 0.05s linear" }}
                            />
                            {/* Arrow head */}
                            <polygon
                                points={`${110 + (growthValue / 127) * 8},8 ${106 + (growthValue / 127) * 8},12 ${114 + (growthValue / 127) * 8},3`}
                                fill="#22d3ee"
                                style={{ transition: "all 0.05s linear" }}
                            />
                            <defs>
                                <linearGradient id="growthGradientDesktop" x1="0%" y1="100%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#22d3ee" />
                                    <stop offset="100%" stopColor="#06b6d4" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <p className="text-xs text-gray-400 mb-1 font-semibold">Growth</p>
                    <span className="text-lg font-bold text-cyan-300">+{Math.floor(growthValue)}%</span>
                </div>

                {/* Accuracy - Animated circle */}
                <div className="flex flex-col items-center justify-center">
                    <div className="relative w-12 h-12 mb-2 flex items-center justify-center bg-gradient-to-b from-green-900/30 to-green-900/10 rounded-full">
                        <svg className="w-11 h-11" viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)" }}>
                            <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(236, 72, 153, 0.2)" strokeWidth="2.5" />
                            <circle
                                cx="50"
                                cy="50"
                                r="40"
                                fill="none"
                                stroke="url(#accuracyGradientDesktop)"
                                strokeWidth="2.5"
                                strokeDasharray={accuracyCircumference}
                                strokeDashoffset={accuracyDashoffset}
                                strokeLinecap="round"
                                style={{ transition: "stroke-dashoffset 0.05s linear", filter: "drop-shadow(0 0 6px rgba(236, 72, 153, 0.7))" }}
                            />
                            <defs>
                                <linearGradient id="accuracyGradientDesktop" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#ec4899" />
                                    <stop offset="100%" stopColor="#f43f5e" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <p className="text-xs text-gray-400 mb-1 font-semibold">Accuracy</p>
                    <span className="text-lg font-bold text-pink-300">{accuracyProgress.toFixed(1)}%</span>
                </div>
            </div>
        </div>
    );
};

export default {
    AnimatedCircularProgress,
    AnimatedTalentCompanies,
    AnimatedAIDashboard,
};