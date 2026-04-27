import React from 'react';
import { Link } from 'react-router-dom';
import { GooeyText } from '@/components/ui/gooey-text-morphing';
import { ScrollFeatureSection } from '@/components/ui/parallax-scroll-feature-section';
import { ShufflingGallery } from '@/components/ui/shuffling-gallery';
import { MapPin, Phone, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

import { useConfig } from '../contexts/ConfigContext';

const Home = () => {
  const { homepageData } = useConfig();
  const { hero, about, gallery, footer } = homepageData;

  return (
    <div className="relative w-full transition-colors duration-500">

      {/* Hero Section */}
      <section className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-white dark:bg-black">
        {/* Background Videos - High Opacity */}
        <div className="absolute inset-0 opacity-100 dark:opacity-90 pointer-events-none transition-opacity duration-1000">
          <video 
            src={hero.video} 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Minimal Overlay for readability */}
        <div className="absolute inset-0 bg-black/10 dark:bg-black/40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white dark:to-[#0D0D0D] pointer-events-none" />

        <motion.div 
          className="relative z-10 text-center flex flex-col items-center px-6 mt-10"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <img 
            src={hero.logo} 
            alt="Cafe Logo" 
            className="w-24 md:w-40 mb-6 drop-shadow-md dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          />
          <h1 className="text-3xl md:text-7xl font-serif font-bold text-gray-900 dark:text-white mb-2 drop-shadow-sm tracking-tight leading-tight">
            {hero.title}
          </h1>
          <p className="text-sm md:text-2xl text-[#B48A33] dark:text-[#F5D547] font-light tracking-wide italic mb-6 drop-shadow-sm px-4">
            {hero.subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-6 w-full max-w-[280px] sm:max-w-none">
            <Link 
              to={hero.links.menu}
              className="px-6 py-2.5 md:px-10 md:py-4 rounded-full bg-[#D4A853] hover:bg-[#F5D547] text-black font-bold text-[10px] md:text-sm transition-all duration-300 hover:scale-105 shadow-md uppercase tracking-widest text-center"
            >
              Our Menu
            </Link>
            <a 
              href={hero.links.about}
              className="px-6 py-2.5 md:px-10 md:py-4 rounded-full bg-white/40 dark:bg-transparent border border-black/10 dark:border-white/30 text-gray-800 dark:text-white font-semibold text-[10px] md:text-sm transition-all duration-300 hover:bg-[#D4A853] hover:text-black hover:border-transparent backdrop-blur-sm uppercase tracking-widest text-center"
            >
              About Us
            </a>
          </div>
        </motion.div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/50 animate-bounce">
          <span className="text-xs tracking-widest uppercase mb-2">Scroll</span>
          <div className="w-[1px] h-10 bg-gradient-to-b from-white/50 to-transparent" />
        </div>
      </section>

      {/* Main Content with Slide Animation */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* About & Story Section */}
        <section id="about" className="relative w-full">
          <ScrollFeatureSection sections={about.sections} />
        </section>

        {/* Gallery / Vibe Section */}
        <section className="bg-white dark:bg-[#0D0D0D] py-10 relative overflow-hidden transition-colors duration-500">
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4A853]/10 dark:bg-[#D4A853]/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="mb-8 text-center px-4">
            <h2 className="text-2xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white mb-2">{gallery.title}</h2>
            <p className="text-[#B48A33] dark:text-[#F5D547] font-medium tracking-wide text-sm md:text-base">{gallery.subtitle}</p>
          </div>
          <ShufflingGallery images={gallery.items.map(item => item.url)} />
        </section>
      </motion.div>

      {/* Footer Section */}
      <footer id="footer" className="relative bg-[#FDFBF7] dark:bg-[#050505] pt-16 md:pt-24 pb-12 overflow-hidden border-t border-black/5 dark:border-white/5 transition-colors duration-500">
        <div className="absolute inset-0 opacity-60 dark:opacity-40 pointer-events-none">
          <video 
            src={footer.video} 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-white/20 dark:bg-black/60 pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="mb-12 md:mb-20">
            {/* Morphing Text */}
            <GooeyText 
              texts={footer.morphing_texts} 
              morphTime={1.5} 
              cooldownTime={1.5}
              textClassName="text-[#D4A853] dark:text-[#F5D547]"
              className="h-[100px] md:h-[150px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start space-y-4">
              <img src={footer.logo} alt="Cafe Logo" className="w-16 md:w-20 opacity-80 hover:opacity-100 transition-opacity" />
              <p className="text-gray-600 dark:text-[#F5F0E8]/60 text-xs md:text-sm max-w-xs leading-relaxed">
                {footer.description}
              </p>
            </div>
            
            <div className="flex flex-col space-y-3 md:space-y-4 items-center md:items-start">
              <h4 className="text-gray-900 dark:text-white font-serif text-base md:text-lg tracking-widest uppercase font-bold">Find Us</h4>
              <p className="text-gray-600 dark:text-[#F5F0E8]/60 text-xs md:text-sm whitespace-pre-line">
                {footer.contact.address}
              </p>
              <p className="text-[#B48A33] dark:text-[#D4A853] text-xs md:text-sm mt-2 font-bold uppercase tracking-wider">{footer.contact.hours}</p>
            </div>

            <div className="flex flex-col space-y-3 md:space-y-4 items-center md:items-start">
              <h4 className="text-gray-900 dark:text-white font-serif text-base md:text-lg tracking-widest uppercase font-bold">Connect</h4>
              <p className="text-gray-600 dark:text-[#F5F0E8]/60 text-xs md:text-sm mb-2">
                {footer.contact.phone}<br />
                {footer.contact.email}
              </p>
              <div className="flex space-x-3">
                <a href={footer.links.map} className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center hover:bg-[#D4A853] dark:hover:bg-[#F5D547] hover:text-black transition-all">
                  <MapPin size={16} />
                </a>
                <a href={footer.links.phone} className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center hover:bg-[#D4A853] dark:hover:bg-[#F5D547] hover:text-black transition-all">
                  <Phone size={16} />
                </a>
                <a href={footer.links.email} className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center hover:bg-[#D4A853] dark:hover:bg-[#F5D547] hover:text-black transition-all">
                  <Mail size={16} />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-black/5 dark:border-white/10 text-center text-gray-500 dark:text-[#F5F0E8]/40 text-[10px] md:text-xs">
            © {new Date().getFullYear()} {footer.copyright_text}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
