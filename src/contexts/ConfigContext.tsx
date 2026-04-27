import React, { createContext, useContext, type ReactNode } from 'react';
import yaml from 'js-yaml';

// @ts-ignore
import menuYaml from '../config/menu.yaml?raw';
// @ts-ignore
import homepageYaml from '../config/homepage.yaml?raw';

export interface MenuItem {
  id: string;
  name: string;
  slug: string;
  price: string;
  type: string;
  show: boolean;
  image_count: number;
  images: string[];
}

export interface MenuCategory {
  category: string;
  domain: string;
  subdomain: string;
  items: MenuItem[];
}

export interface HomepageConfig {
  hero: {
    title: string;
    subtitle: string;
    logo: string;
    video: string;
    links: {
      menu: string;
      about: string;
    };
  };
  about: {
    sections: {
      id: number;
      title: string;
      description: string;
      imageUrl: string;
      reverse: boolean;
    }[];
  };
  gallery: {
    title: string;
    subtitle: string;
    items: {
      id: number;
      type: string;
      title: string;
      desc: string;
      url: string;
      span: string;
    }[];
  };
  footer: {
    morphing_texts: string[];
    logo: string;
    description: string;
    contact: {
      address: string;
      hours: string;
      phone: string;
      email: string;
    };
    links: {
      map: string;
      phone: string;
      email: string;
    };
    copyright_text: string;
    video: string;
  };
}

interface ConfigContextType {
  menuData: MenuCategory[];
  homepageData: HomepageConfig;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

const parseMenu = (yamlStr: string): MenuCategory[] => {
  const data = yaml.load(yamlStr) as any[];
  return data.map(cat => ({
    ...cat,
    items: cat.items.map((item: any) => ({
      ...item,
      images: Array.from({ length: item.image_count }, (_, i) => 
        `/menu_media/menu__${cat.domain}__${cat.subdomain}__${item.slug}__${i}.jpg`
      )
    }))
  }));
};

const parseHomepage = (yamlStr: string): HomepageConfig => {
  return yaml.load(yamlStr) as HomepageConfig;
};

export const ConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const menuData = parseMenu(menuYaml);
  const homepageData = parseHomepage(homepageYaml);

  return (
    <ConfigContext.Provider value={{ menuData, homepageData }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};
