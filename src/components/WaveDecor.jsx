import React from 'react';
import { motion } from 'framer-motion';

const WaveDecor = ({ className, side = 'left', top = '0%', color = '#3b82f6', opacity = 0.3, orientation = 'vertical' }) => {
    const isVertical = orientation === 'vertical';
    const isLeft = side === 'left';

    // Randomize animation duration slightly
    const duration = 15 + Math.random() * 5;

    const styles = isVertical ? {
        position: 'absolute',
        top: top,
        [isLeft ? 'left' : 'right']: 0,
        width: '300px',
        height: '800px',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        transform: isLeft ? 'scaleX(1)' : 'scaleX(-1)'
    } : {
        position: 'absolute',
        top: top, /* Used as vertical offset */
        left: 0,
        width: '100%',
        height: '300px',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        // For horizontal, 'side' could determine if it flips vertically, but let's keep it simple for now
    };

    const viewBox = isVertical ? "0 0 300 800" : "0 0 1440 300";

    return (
        <div
            className={`wave-decor ${className || ''}`}
            style={styles}
        >
            <svg
                width="100%"
                height="100%"
                viewBox={viewBox}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
            >
                <defs>
                    {/* Gradient depends on orientation */}
                    {isVertical ? (
                        <linearGradient id={`grad-${top}-${side}`} x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor={color} stopOpacity="0" />
                            <stop offset="50%" stopColor={color} stopOpacity={opacity} />
                            <stop offset="100%" stopColor={color} stopOpacity="0" />
                        </linearGradient>
                    ) : (
                        <linearGradient id={`grad-${top}-${side}`} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={color} stopOpacity="0" />
                            <stop offset="20%" stopColor={color} stopOpacity={opacity} />
                            <stop offset="80%" stopColor={color} stopOpacity={opacity} />
                            <stop offset="100%" stopColor={color} stopOpacity="0" />
                        </linearGradient>
                    )}
                </defs>

                {isVertical ? (
                    <>
                        {/* Wave 1 - Slow & Wide */}
                        <motion.path
                            d="M150,0 Q250,200 150,400 T150,800"
                            stroke={`url(#grad-${top}-${side})`}
                            strokeWidth="2"
                            fill="none"
                            animate={{
                                d: [
                                    "M150,0 Q250,200 150,400 T150,800", // Start
                                    "M150,0 Q280,200 150,400 T150,800", // Wide right
                                    "M150,0 Q250,200 150,400 T150,800", // Center
                                    "M150,0 Q120,200 150,400 T150,800", // Wide left
                                    "M150,0 Q250,200 150,400 T150,800"  // End (Matches Start)
                                ]
                            }}
                            transition={{
                                duration: duration,
                                repeat: Infinity,
                                ease: "linear" /* Linear helps seamlessness with symmetrical keyframes */
                            }}
                        />

                        {/* Wave 2 - Offset & Faster */}
                        <motion.path
                            d="M100,0 Q200,250 100,500 T100,800"
                            stroke={`url(#grad-${top}-${side})`}
                            strokeWidth="1.5"
                            fill="none"
                            style={{ opacity: 0.7 }}
                            animate={{
                                d: [
                                    "M100,0 Q200,250 100,500 T100,800",
                                    "M100,0 Q230,250 100,500 T100,800",
                                    "M100,0 Q200,250 100,500 T100,800",
                                    "M100,0 Q170,250 100,500 T100,800",
                                    "M100,0 Q200,250 100,500 T100,800"
                                ]
                            }}
                            transition={{
                                duration: duration * 1.3,
                                repeat: Infinity,
                                ease: "linear",
                                delay: 1
                            }}
                        />
                    </>
                ) : (
                    <>
                        {/* Horizontal Paths */}
                        <motion.path
                            d="M0,150 Q360,50 720,150 T1440,150"
                            stroke={`url(#grad-${top}-${side})`}
                            strokeWidth="2"
                            fill="none"
                            animate={{
                                d: [
                                    "M0,150 Q360,50 720,150 T1440,150",
                                    "M0,150 Q360,250 720,150 T1440,150",
                                    "M0,150 Q360,50 720,150 T1440,150"
                                ]
                            }}
                            transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <motion.path
                            d="M0,100 Q400,200 800,100 T1440,100"
                            stroke={`url(#grad-${top}-${side})`}
                            strokeWidth="1.5"
                            fill="none"
                            style={{ opacity: 0.7 }}
                            animate={{
                                d: [
                                    "M0,100 Q400,200 800,100 T1440,100",
                                    "M0,100 Q400,0 800,100 T1440,100",
                                    "M0,100 Q400,200 800,100 T1440,100"
                                ]
                            }}
                            transition={{ duration: duration * 1.3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                        />
                    </>
                )}
            </svg>
        </div>
    );
};

export default WaveDecor;
