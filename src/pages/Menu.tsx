import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Menu as MenuIcon, X } from 'lucide-react';
import { GradientBackground } from '@/components/ui/gradient-background';
import ImageSlideshow from '@/components/ui/image-slideshow';
import { MenuContainer, MenuItem } from '@/components/ui/fluid-menu';
import { AnnouncementPopup } from '@/components/ui/announcement-popup';

import { useAdmin } from '../contexts/AdminContext';
const TypeLogo = ({ type }: { type: string }) => {
  if (type === 'veg') {
    return (
      <div className="w-4 h-4 md:w-5 md:h-5 flex items-center justify-center border-2 border-green-600 bg-white rounded-sm" title="Vegetarian">
        <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-green-600 rounded-full"></div>
      </div>
    );
  }
  if (type === 'non-veg') {
    return (
      <div className="w-4 h-4 md:w-5 md:h-5 flex items-center justify-center border-2 border-red-600 bg-white rounded-sm" title="Non-Vegetarian">
        <div className="w-0 h-0 border-l-[4px] md:border-l-[5px] border-l-transparent border-r-[4px] md:border-r-[5px] border-r-transparent border-b-[6px] md:border-b-[8px] border-b-red-600 mt-0.5"></div>
      </div>
    );
  }
  if (type === 'egg') {
    return (
      <div className="w-4 h-4 md:w-5 md:h-5 flex items-center justify-center border-2 border-yellow-500 bg-white rounded-sm" title="Contains Egg">
        <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-yellow-500 rounded-full"></div>
      </div>
    );
  }
  return null;
};

import { useConfig } from '../contexts/ConfigContext';

const Menu = () => {
  const { menuData } = useAdmin();
  const { homepageData } = useConfig();

  // Filter out hidden items and empty categories
  const visibleMenuData = menuData.map(cat => ({
    ...cat,
    items: (cat.items || []).filter(item => item.show !== false)
  })).filter(cat => cat.items.length > 0);

  return (
    <div className="min-h-screen transition-colors duration-500">
      <GradientBackground 
        className="min-h-screen pb-20 bg-transparent"
        gradients={["linear-gradient(135deg, rgba(212,168,83,0.05) 0%, rgba(212,168,83,0) 100%)"]}
        overlay={false}
        showBlobs={true}
      >
        <AnnouncementPopup />
        {/* Top Header */}
        <div className="fixed top-0 left-0 right-0 z-40 p-4 sm:p-6 bg-white/80 dark:bg-black/60 backdrop-blur-md flex justify-center items-center border-b border-black/5 dark:border-white/5">
          <img src={homepageData.hero.logo} alt="Cafe Logo" className="h-8 md:h-12 w-auto opacity-90 drop-shadow-sm" />
        </div>

        {/* Floating Navigation Menu (Right side) - Differentiated by high contrast theme */}
        <div className="fixed bottom-6 right-6 md:right-8 z-50">
          <MenuContainer triggerClassName="bg-gray-900 dark:bg-white shadow-[0_0_20px_rgba(0,0,0,0.3)] dark:shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            <MenuItem 
              icon={
                <div className="relative w-5 h-5 md:w-6 md:h-6 flex items-center justify-center text-white dark:text-black">
                  <MenuIcon size={18} strokeWidth={2.5} className="absolute inset-0 transition-all duration-300 origin-center opacity-100 scale-100 rotate-0 [div[data-expanded=true]_&]:opacity-0 [div[data-expanded=true]_&]:scale-0" />
                  <X size={18} strokeWidth={2.5} className="absolute inset-0 transition-all duration-300 origin-center opacity-0 scale-0 -rotate-180 [div[data-expanded=true]_&]:opacity-100 [div[data-expanded=true]_&]:scale-100 [div[data-expanded=true]_&]:rotate-0" />
                </div>
              } 
            />
            {visibleMenuData.map((category, idx) => (
              <MenuItem key={idx}>
                <a 
                  href={`#cat-${idx}`} 
                  className="flex items-center justify-center h-full w-full hover:text-[#B48A33] dark:hover:text-[#F5D547] transition-colors"
                  title={category.category}
                >
                  <span className="text-[7px] md:text-[8px] font-bold tracking-widest uppercase leading-none text-center px-1">
                    {category.category.split(' ').map((word, i) => <React.Fragment key={i}>{word}<br/></React.Fragment>)}
                  </span>
                </a>
              </MenuItem>
            ))}
          </MenuContainer>
        </div>

        {/* Main Menu Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 md:pt-32 pb-20 relative z-10 w-full">
          <div className="text-center mb-8 md:mb-16">
            <span className="px-3 py-1 bg-[#F5E6CA] dark:bg-[#B48A33]/20 text-[#8B6E3F] dark:text-[#F5D547] text-[8px] md:text-xs font-bold tracking-[0.2em] uppercase rounded-full mb-3 inline-block">
              Experience
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-serif font-bold text-gray-900 dark:text-white mb-2 md:mb-4 tracking-tight">Our Menu</h1>
            <div className="w-12 md:w-24 h-1 bg-[#D4A853] mx-auto opacity-40 rounded-full" />
          </div>

          <div className="space-y-16 md:space-y-20">
            {visibleMenuData.map((category, catIdx) => (
              <div key={catIdx} id={`cat-${catIdx}`} className="scroll-mt-24 md:scroll-mt-32">
                <div className="relative mb-6 md:mb-10 inline-block">
                  <h2 className="text-xl md:text-4xl font-serif text-gray-900 dark:text-[#D4A853] relative z-10 px-3 py-1.5 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4A853]" />
                    {category.category}
                  </h2>
                  <div className="absolute inset-0 bg-[#F5E6CA] dark:bg-[#B48A33]/10 -skew-x-6 z-0 rounded-lg" />
                </div>
                
                <div className="grid grid-cols-1 gap-4 md:gap-6">
                  {category.items.map((item, itemIdx) => (
                    <div 
                      key={itemIdx} 
                      className="flex bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl md:rounded-2xl overflow-hidden hover:shadow-lg dark:hover:bg-white/10 transition-all group h-24 md:h-36"
                    >
                      {/* Image Section - Left */}
                      <div className="w-[100px] md:w-1/3 sm:w-2/5 h-full flex-shrink-0 bg-gray-100 dark:bg-black">
                        <ImageSlideshow images={item.images} />
                      </div>
                      
                      {/* Details Section - Right */}
                      <div className="flex-1 p-3 md:p-5 flex flex-col justify-center">
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <div className="flex items-center gap-1.5 md:gap-2">
                            <TypeLogo type={item.type} />
                            <h3 className="text-sm md:text-2xl font-bold font-serif text-gray-900 dark:text-white group-hover:text-[#B48A33] dark:group-hover:text-[#F5D547] transition-colors leading-tight">
                              {item.name}
                            </h3>
                          </div>
                        </div>
                        
                        <div className="mt-auto">
                          <div className="text-[10px] md:text-sm font-bold text-[#8B6E3F] dark:text-[#F5D547] bg-[#F5E6CA]/50 dark:bg-black/40 inline-block px-2.5 py-1 rounded-md border border-[#D4A853]/20">
                            {item.price}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Short Menu Footer */}
        <footer className="max-w-4xl mx-auto px-6 py-10 border-t border-black/5 dark:border-white/10 text-center">
          <p className="text-gray-500 dark:text-white/40 text-[10px] md:text-xs tracking-widest uppercase">
            Prices are inclusive of all taxes. © {new Date().getFullYear()} {homepageData.footer.copyright_text}
          </p>
        </footer>
      </GradientBackground>
    </div>
  );
};

export default Menu;
