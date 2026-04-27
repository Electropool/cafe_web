import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Zap, Gift, Coffee } from 'lucide-react';
import { AnimatedShinyText } from './animated-shiny-text';
import { cn } from '@/lib/utils';

const announcements = [
  { text: "Happy Hour: 20% OFF on all Cold Drinks!", icon: Zap, color: "text-yellow-500" },
  { text: "Special Combo: Coffee + Sandwich at ₹149", icon: Coffee, color: "text-[#D4A853]" },
  { text: "Price Drop: Hot Chocolate now at ₹49!", icon: Zap, color: "text-red-500" },
  { text: "Sunday Brunch: Buy 1 Pizza Get 1 Mocktail Free", icon: Gift, color: "text-purple-500" },
  { text: "✨ Flash Offer: Any Burger at just ₹99", icon: Sparkles, color: "text-[#F5D547]" },
  { text: "New Arrival: Try our Red Sauce Pasta!", icon: ArrowRight, color: "text-orange-500" },
  { text: "Late Night Jam: Flat 15% OFF after 9 PM", icon: Coffee, color: "text-blue-500" }
];

export function AnnouncementPopup() {
  const [currentAnnouncement, setCurrentAnnouncement] = useState<typeof announcements[0] | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show first announcement after 3 seconds
    const initialTimeout = setTimeout(() => {
      triggerRandom();
    }, 3000);

    // Then trigger every 15-20 seconds
    const interval = setInterval(() => {
      triggerRandom();
    }, 20000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  const triggerRandom = () => {
    const randomIdx = Math.floor(Math.random() * announcements.length);
    setCurrentAnnouncement(announcements[randomIdx]);
    setIsVisible(true);

    // Hide after 4 seconds
    setTimeout(() => {
      setIsVisible(false);
    }, 4500);
  };

  return (
    <div className="fixed top-24 md:top-32 left-0 right-0 z-[100] pointer-events-none flex justify-center px-4">
      <AnimatePresence mode="wait">
        {isVisible && currentAnnouncement && (
          <motion.div
            initial={{ y: -100, opacity: 0, scale: 0.5 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -100, opacity: 0, scale: 0.5 }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 30,
              opacity: { duration: 0.2 }
            }}
            className="pointer-events-auto"
          >
            <div className={cn(
              "group rounded-2xl border-2 border-[#D4A853]/30 bg-white/95 dark:bg-black/90 backdrop-blur-xl px-6 py-3 shadow-[0_20px_50px_rgba(212,168,83,0.3)] transition-all duration-300",
              "hover:scale-105 active:scale-95 border-b-4"
            )}>
              <AnimatedShinyText className="inline-flex items-center justify-center transition ease-out">
                <div className={cn("mr-3 p-1.5 rounded-lg bg-black/5 dark:bg-white/5", currentAnnouncement.color)}>
                  <currentAnnouncement.icon className="size-5 md:size-6" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-[10px] md:text-xs font-black tracking-widest uppercase text-[#B48A33] dark:text-[#F5D547] mb-0.5">
                    Limited Time Offer
                  </span>
                  <span className="text-xs md:text-sm font-bold tracking-tight text-gray-900 dark:text-gray-100">
                    {currentAnnouncement.text}
                  </span>
                </div>
                <div className="ml-4 pl-4 border-l border-black/10 dark:border-white/10">
                  <ArrowRight className="size-4 text-[#D4A853] animate-pulse" />
                </div>
              </AnimatedShinyText>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
