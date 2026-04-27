"use client"
import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react';

export interface MediaItemType {
    id: number;
    type: string;
    title: string;
    desc: string;
    url: string;
    span: string;
    price?: string;
    badges?: string[];
}

const MediaItem = ({ item, className, onClick }: { item: MediaItemType, className?: string, onClick?: () => void }) => {
    if (item.type === 'video') {
        return (
            <div className={`${className} relative overflow-hidden`} onClick={onClick}>
                <video
                    className="w-full h-full object-cover"
                    playsInline
                    muted
                    loop
                    autoPlay
                >
                    <source src={item.url} type="video/mp4" />
                </video>
            </div>
        );
    }

    return (
        <img
            src={item.url}
            alt={item.title}
            className={`${className} object-cover cursor-pointer`}
            onClick={onClick}
            loading="lazy"
        />
    );
};

interface GalleryModalProps {
    selectedItem: MediaItemType;
    isOpen: boolean;
    onClose: () => void;
    setSelectedItem: (item: MediaItemType | null) => void;
    mediaItems: MediaItemType[];
}

const GalleryModal = ({ selectedItem, isOpen, onClose, setSelectedItem, mediaItems }: GalleryModalProps) => {
    const [dockPosition, setDockPosition] = useState({ x: 0, y: 0 });

    if (!isOpen) return null;

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 w-full h-screen backdrop-blur-xl bg-black/80 z-50 flex flex-col items-center justify-center"
            >
                <div className="w-full max-w-4xl p-4 flex flex-col items-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedItem.id}
                            className="relative w-full aspect-[4/3] md:aspect-[16/9] rounded-xl overflow-hidden shadow-2xl bg-black/40 border border-white/10"
                            initial={{ y: 20, scale: 0.95, opacity: 0 }}
                            animate={{ y: 0, scale: 1, opacity: 1 }}
                            exit={{ y: -20, scale: 0.95, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                            <MediaItem item={selectedItem} className="w-full h-full object-contain" />
                            
                            <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <div className="flex gap-2 mb-2">
                                            {selectedItem.badges?.map(badge => (
                                                <span key={badge} className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full 
                                                    ${badge === 'veg' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
                                                    badge === 'non-veg' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 
                                                    badge === 'egg' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 
                                                    'bg-white/20 text-white'}`}>
                                                    {badge}
                                                </span>
                                            ))}
                                        </div>
                                        <h3 className="text-white text-2xl md:text-3xl font-bold font-serif">{selectedItem.title}</h3>
                                        <p className="text-white/70 text-sm md:text-base mt-1">{selectedItem.desc}</p>
                                    </div>
                                    {selectedItem.price && (
                                        <div className="text-[#D4A853] text-xl md:text-2xl font-bold">
                                            {selectedItem.price}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <motion.button
                    className="absolute top-4 right-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-md"
                    onClick={onClose}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <X size={24} />
                </motion.button>
            </motion.div>
        </>
    );
};

export const InteractiveBentoGallery = ({ mediaItems, title, description }: { mediaItems: MediaItemType[], title: string, description: string }) => {
    const [selectedItem, setSelectedItem] = useState<MediaItemType | null>(null);

    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-12">
            <div className="mb-10 text-center">
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-3">{title}</h2>
                <p className="text-[#D4A853] font-medium tracking-wide">{description}</p>
            </div>
            
            <AnimatePresence mode="wait">
                {selectedItem ? (
                    <GalleryModal
                        selectedItem={selectedItem}
                        isOpen={true}
                        onClose={() => setSelectedItem(null)}
                        setSelectedItem={setSelectedItem}
                        mediaItems={mediaItems}
                    />
                ) : (
                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[150px] md:auto-rows-[200px]"
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: { staggerChildren: 0.1 }
                            }
                        }}
                    >
                        {mediaItems.map((item, index) => (
                            <motion.div
                                key={item.id}
                                className={`relative overflow-hidden rounded-2xl cursor-pointer group ${item.span}`}
                                onClick={() => setSelectedItem(item)}
                                variants={{
                                    hidden: { y: 20, opacity: 0 },
                                    visible: { y: 0, opacity: 1 }
                                }}
                                whileHover={{ scale: 0.98 }}
                            >
                                <MediaItem
                                    item={item}
                                    className="absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-110"
                                />
                                
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                                
                                <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end">
                                    <div className="flex gap-2 mb-2">
                                        {item.badges?.map(badge => (
                                            <span key={badge} className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-sm backdrop-blur-md
                                                ${badge === 'veg' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 
                                                badge === 'non-veg' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 
                                                badge === 'egg' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' : 
                                                'bg-white/20 text-white'}`}>
                                                {badge}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <h3 className="text-white text-lg md:text-xl font-bold font-serif leading-tight">
                                            {item.title}
                                        </h3>
                                        {item.price && (
                                            <span className="text-[#D4A853] font-bold text-sm md:text-base ml-2 whitespace-nowrap">
                                                {item.price}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
