import React, { createContext, useContext, useState, useEffect } from 'react';

export interface MenuItemData {
  id: string;
  name: string;
  price: string;
  images: string[];
  type: string;
  show: boolean;
}

export interface MenuCategoryData {
  category: string;
  items: MenuItemData[];
}

interface AdminContextType {
  menuData: MenuCategoryData[];
  setMenuData: React.Dispatch<React.SetStateAction<MenuCategoryData[]>>;
  updateItem: (categoryName: string, updatedItem: MenuItemData) => void;
  deleteItem: (categoryName: string, itemId: string) => void;
  addItem: (categoryName: string, newItem: MenuItemData) => void;
  toggleItemVisibility: (categoryName: string, itemId: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

import { useConfig } from './ConfigContext';

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { menuData: initialMenuData } = useConfig();
  
  const [menuData, setMenuData] = useState<MenuCategoryData[]>(() => {
    const saved = localStorage.getItem('cafe_menu_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse menu data", e);
      }
    }
    // Transform MenuItem from ConfigContext to MenuItemData for AdminContext
    // AdminContext uses images array directly, which is what ConfigContext provides
    return initialMenuData as MenuCategoryData[];
  });

  useEffect(() => {
    localStorage.setItem('cafe_menu_data', JSON.stringify(menuData));
  }, [menuData]);

  const updateItem = (categoryName: string, updatedItem: MenuItemData) => {
    setMenuData(prev => prev.map(cat => {
      if (cat.category === categoryName) {
        return {
          ...cat,
          items: cat.items.map(item => item.id === updatedItem.id ? updatedItem : item)
        };
      }
      return cat;
    }));
  };

  const deleteItem = (categoryName: string, itemId: string) => {
    setMenuData(prev => prev.map(cat => {
      if (cat.category === categoryName) {
        return {
          ...cat,
          items: cat.items.filter(item => item.id !== itemId)
        };
      }
      return cat;
    }));
  };

  const addItem = (categoryName: string, newItem: MenuItemData) => {
    setMenuData(prev => {
      const catExists = prev.find(c => c.category === categoryName);
      if (catExists) {
        return prev.map(cat => {
          if (cat.category === categoryName) {
            return { ...cat, items: [...cat.items, newItem] };
          }
          return cat;
        });
      } else {
        return [...prev, { category: categoryName, items: [newItem] }];
      }
    });
  };

  const toggleItemVisibility = (categoryName: string, itemId: string) => {
    setMenuData(prev => prev.map(cat => {
      if (cat.category === categoryName) {
        return {
          ...cat,
          items: cat.items.map(item => item.id === itemId ? { ...item, show: !item.show } : item)
        };
      }
      return cat;
    }));
  };

  return (
    <AdminContext.Provider value={{ menuData, setMenuData, updateItem, deleteItem, addItem, toggleItemVisibility }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
