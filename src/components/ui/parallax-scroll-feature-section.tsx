'use client'

import { useRef } from "react"
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown } from "lucide-react"
import { cn } from "@/lib/utils";

export const ScrollFeatureSection = ({ sections }: { sections: any[] }) => {
    const sectionRefs = sections.map(() => useRef(null));
    
    const scrollYProgress = sections.map((_, index) => {
        return useScroll({
            target: sectionRefs[index],
            offset: ["start end", "center center"]
        }).scrollYProgress;
    });

    const opacityContents = scrollYProgress.map(progress => 
        useTransform(progress, [0, 0.8, 1], [0, 0.5, 1])
    );
    
    const clipProgresses = scrollYProgress.map(progress => 
        useTransform(progress, [0, 1], ["inset(0 100% 0 0)", "inset(0 0% 0 0)"])
    );
    
    const translateContents = scrollYProgress.map(progress => 
        useTransform(progress, [0, 1], [100, 0])
    );

  return (
    <div className="bg-white dark:bg-[#0D0D0D] text-gray-900 dark:text-[#F5F0E8] py-16 md:py-20 transition-colors duration-500">
        <div className="flex flex-col md:px-0 px-10 max-w-6xl mx-auto">
            {sections.map((section, index) => (
                <div 
                    key={section.id}
                    ref={sectionRefs[index]} 
                    className={`min-h-[70vh] flex flex-col md:flex-row items-center justify-center md:gap-20 gap-10 py-10 ${section.reverse ? 'md:flex-row-reverse' : ''}`}
                >
                    <motion.div 
                        style={{ y: translateContents[index], opacity: opacityContents[index] }}
                        className="flex-1 space-y-6"
                    >
                        <h2 className="text-3xl md:text-5xl font-serif text-[#B48A33] dark:text-[#D4A853]">{section.title}</h2>
                        <p className="text-base md:text-lg text-gray-600 dark:text-[#F5F0E8]/80 leading-relaxed font-light">
                            {section.description}
                        </p>
                    </motion.div>
                    
                    <motion.div 
                        style={{ 
                            opacity: opacityContents[index],
                            clipPath: clipProgresses[index],
                        }}
                        className="flex-1 relative aspect-square md:aspect-[4/3] w-full max-w-md"
                    >
                        {section.type === 'video' ? (
                            <video 
                                src={section.imageUrl} 
                                className="w-full h-full object-cover rounded-2xl shadow-2xl border border-white/5" 
                                autoPlay muted loop playsInline
                            />
                        ) : (
                            <img 
                                src={section.imageUrl} 
                                className="w-full h-full object-cover rounded-2xl shadow-2xl border border-white/5" 
                                alt={section.title}
                            />
                        )}
                    </motion.div>
                </div>
            ))}
        </div>
    </div>
  );
};
