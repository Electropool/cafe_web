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
  syncToYaml: () => Promise<boolean>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

import { useConfig } from './ConfigContext';
import { API_URL } from '../config';

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { menuData: initialMenuData } = useConfig();
  const [menuData, setMenuData] = useState<MenuCategoryData[]>(initialMenuData as MenuCategoryData[]);

  // Fetch from API on mount
  useEffect(() => {
    fetch(`${API_URL}/api/menu`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setMenuData(data);
        }
      })
      .catch(err => console.error("Failed to fetch menu from API:", err));
  }, []);

  const updateItem = async (categoryName: string, updatedItem: MenuItemData) => {
    try {
      const res = await fetch(`${API_URL}/api/menu/item`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: categoryName, item: updatedItem })
      });
      if (res.ok) {
        setMenuData(prev => prev.map(cat => {
          if (cat.category === categoryName) {
            return {
              ...cat,
              items: cat.items.map(item => item.id === updatedItem.id ? updatedItem : item)
            };
          }
          return cat;
        }));
      }
    } catch (err) {
      console.error("Failed to update item:", err);
    }
  };

  const deleteItem = async (categoryName: string, itemId: string) => {
    try {
      const res = await fetch(`${API_URL}/api/menu/item/${itemId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setMenuData(prev => prev.map(cat => {
          if (cat.category === categoryName) {
            return {
              ...cat,
              items: cat.items.filter(item => item.id !== itemId)
            };
          }
          return cat;
        }));
      }
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  const addItem = async (categoryName: string, newItem: MenuItemData) => {
    try {
      const res = await fetch(`${API_URL}/api/menu/item`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: categoryName, item: newItem })
      });
      if (res.ok) {
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
      }
    } catch (err) {
      console.error("Failed to add item:", err);
    }
  };

  const toggleItemVisibility = async (categoryName: string, itemId: string) => {
    try {
      const res = await fetch(`${API_URL}/api/menu/item/${itemId}/toggle`, {
        method: 'POST'
      });
      if (res.ok) {
        setMenuData(prev => prev.map(cat => {
          if (cat.category === categoryName) {
            return {
              ...cat,
              items: cat.items.map(item => item.id === itemId ? { ...item, show: !item.show } : item)
            };
          }
          return cat;
        }));
      }
    } catch (err) {
      console.error("Failed to toggle visibility:", err);
    }
  };

  const syncToYaml = async () => {
    try {
      const res = await fetch(`${API_URL}/api/sync-yaml`, {
        method: 'POST'
      });
      const data = await res.json();
      if (!res.ok) {
        console.error("Sync error from server:", data.error);
        alert(`Sync failed: ${data.error}`);
        return false;
      }
      return data.success;
    } catch (err) {
      console.error("Failed to sync to YAML:", err);
      return false;
    }
  };

  return (
    <AdminContext.Provider value={{ menuData, setMenuData, updateItem, deleteItem, addItem, toggleItemVisibility, syncToYaml }}>
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
