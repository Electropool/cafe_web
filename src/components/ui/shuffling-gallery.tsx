"use client"
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ShufflingGalleryProps {
  images: string[]
  interval?: number
}

export const ShufflingGallery = ({ images, interval = 3000 }: ShufflingGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, interval)
    return () => clearInterval(timer)
  }, [images.length, interval])

  // Show 4 images at a time in a grid, shuffling
  const displayIndices = [
    currentIndex % images.length,
    (currentIndex + 1) % images.length,
    (currentIndex + 2) % images.length,
    (currentIndex + 3) % images.length,
  ]

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-[200px] md:h-[300px]">
        {displayIndices.map((idx, i) => (
          <div key={`${i}-${images[idx]}`} className="relative overflow-hidden rounded-2xl shadow-lg">
            <AnimatePresence mode="wait">
              <motion.img
                key={images[idx]}
                src={images[idx]}
                alt="Gallery"
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors duration-500" />
          </div>
        ))}
      </div>
    </div>
  )
}
