'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type GradientBackgroundProps = React.ComponentProps<'div'> & {
	gradients?: string[];
	animationDuration?: number;
	animationDelay?: number;
	enableCenterContent?: boolean;
	overlay?: boolean;
	overlayOpacity?: number;
    showBlobs?: boolean;
};

const Default_Gradients = [
    "linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)",
    "linear-gradient(135deg, #2d1e15 0%, #1a1a1a 100%)",
    "linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 100%)"
  ]

export function GradientBackground({
	children,
	className = '',
	gradients = Default_Gradients,
	animationDuration = 8,
	animationDelay = 0.5,
	overlay = true,
	overlayOpacity = 0.7,
    showBlobs = false,
}: GradientBackgroundProps) {
	return (
		<div className={cn('w-full relative min-h-screen overflow-hidden bg-white dark:bg-black', className)}>
			{/* Animated gradient background */}
			<motion.div
				className="absolute inset-0"
				style={{ background: gradients[0] }}
				animate={{ background: gradients }}
				transition={{
					delay: animationDelay,
					duration: animationDuration,
					repeat: Number.POSITIVE_INFINITY,
					ease: 'easeInOut',
				}}
			/>

            {/* Optional Blobs for shader effect */}
            {showBlobs && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div 
                        className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#D4A853]/10 dark:bg-[#D4A853]/5 blur-[120px]"
                        animate={{
                            x: [0, 50, 0],
                            y: [0, 30, 0],
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div 
                        className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-[#D4A853]/15 dark:bg-[#D4A853]/10 blur-[150px]"
                        animate={{
                            x: [0, -40, 0],
                            y: [0, -60, 0],
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    />
                </div>
            )}

			{/* Optional overlay */}
			{overlay && (
				<div
					className="absolute inset-0 bg-white dark:bg-black"
					style={{ opacity: overlayOpacity }}
				/>
			)}

			{/* Content wrapper - Removed restrictive flex center */}
			{children && (
				<div className="relative z-10">
					{children}
				</div>
			)}
		</div>
	);
}
