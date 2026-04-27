import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';
import type { MenuItemData } from '../../contexts/AdminContext';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';

const CATEGORIES = ["Hot Beverages", "Cold Beverages", "Mocktails", "Veg Snacks", "Non-Veg Snacks", "Main Items"];
const TYPES = ["veg", "non-veg", "egg"];

const AdminEditItem = () => {
  const { category: urlCategory, id } = useParams<{ category?: string, id?: string }>();
  const navigate = useNavigate();
  const { menuData, addItem, updateItem, deleteItem } = useAdmin();
  
  const isEditing = Boolean(id);

  const [name, setName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [type, setType] = useState('veg');
  const [isDoublePrice, setIsDoublePrice] = useState(false);
  const [priceSingle, setPriceSingle] = useState('');
  const [priceHalf, setPriceHalf] = useState('');
  const [priceFull, setPriceFull] = useState('');
  const [show, setShow] = useState(true);
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    if (isEditing && urlCategory && id) {
      const catData = menuData.find(c => c.category === decodeURIComponent(urlCategory));
      const item = catData?.items.find(i => i.id === id);
      if (item && catData) {
        setName(item.name);
        setCategory(catData.category);
        setType(item.type);
        setShow(item.show !== false);
        setImages(item.images);

        if (item.price.includes('|')) {
          setIsDoublePrice(true);
          const match = item.price.match(/Half: (.*?) \| Full: (.*)/);
          if (match) {
            setPriceHalf(match[1].replace('₹', '').trim());
            setPriceFull(match[2].replace('₹', '').trim());
          }
        } else {
          setIsDoublePrice(false);
          setPriceSingle(item.price.replace('₹', '').trim());
        }
      }
    }
  }, [isEditing, urlCategory, id, menuData]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const validFiles = files.filter(f => f.size <= 5 * 1024 * 1024);
      if (validFiles.length !== files.length) alert("Some files exceed 5MB.");
      if (images.length + validFiles.length > 5) return alert("Max 5 images.");
      const newImageUrls = validFiles.map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...newImageUrls].slice(0, 5));
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert("Name is required");
    let finalPrice = "";
    if (isDoublePrice) {
      if (!priceHalf || !priceFull) return alert("Both prices required");
      finalPrice = `Half: ₹${priceHalf} | Full: ₹${priceFull}`;
    } else {
      if (!priceSingle) return alert("Price required");
      finalPrice = `₹${priceSingle}`;
    }
    const newItem: MenuItemData = {
      id: isEditing && id ? id : `item-${Date.now()}`,
      name,
      price: finalPrice,
      images,
      type,
      show
    };
    if (isEditing && urlCategory) {
      const oldCat = decodeURIComponent(urlCategory);
      if (oldCat === category) {
        updateItem(category, newItem);
      } else {
        // Changed category: delete from old, add to new
        deleteItem(oldCat, newItem.id);
        addItem(category, newItem);
      }
    } else {
      addItem(category, newItem);
    }
    navigate('/admin/menu');
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <button 
        onClick={() => navigate('/admin/menu')}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 md:mb-8 transition-colors text-sm"
      >
        <ArrowLeft size={16} />
        <span>Back</span>
      </button>

      <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#D4A853] mb-6 md:mb-8">
        {isEditing ? 'Edit Item' : 'Add Item'}
      </h1>

      <form onSubmit={handleSave} className="space-y-6 md:space-y-8 bg-[#111] p-5 md:p-8 rounded-2xl border border-white/5 shadow-xl">
        {/* Images */}
        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">Images (Max 5, 5MB each)</label>
          <div className="flex flex-wrap gap-3">
            {images.map((img, idx) => (
              <div key={idx} className="relative w-20 h-20 md:w-24 md:h-24 rounded-lg bg-black overflow-hidden border border-white/10 group">
                <img src={img} alt="" className="w-full h-full object-cover" />
                <button 
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 bg-black/80 text-white rounded-full p-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            {images.length < 5 && (
              <label className="w-20 h-20 md:w-24 md:h-24 rounded-lg border-2 border-dashed border-white/10 hover:border-[#D4A853] flex flex-col items-center justify-center cursor-pointer text-gray-500 hover:text-[#D4A853] transition-colors bg-white/[0.02]">
                <Upload size={20} className="mb-1" />
                <span className="text-[8px] uppercase tracking-wider">Upload</span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
              </label>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {/* Name */}
          <div className="md:col-span-2">
            <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider">Item Name</label>
            <input 
              type="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#D4A853] text-sm"
              placeholder="e.g., Cold Coffee"
            />
          </div>

          {/* Domain / Category */}
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider">Domain (Category)</label>
            <select 
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#D4A853] appearance-none text-sm"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Type */}
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider">Dietary Type</label>
            <select 
              value={type}
              onChange={e => setType(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#D4A853] appearance-none text-sm"
            >
              <option value="veg">Vegetarian</option>
              <option value="non-veg">Non-Veg</option>
              <option value="egg">Contains Egg</option>
            </select>
          </div>

          {/* Price */}
          <div className="md:col-span-2 space-y-4 border-t border-white/5 pt-6 mt-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 mb-2">
              <label className="text-xs text-gray-500 uppercase tracking-wider">Pricing Method:</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-400">
                  <input type="radio" checked={!isDoublePrice} onChange={() => setIsDoublePrice(false)} className="accent-[#D4A853]" />
                  Single
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-400">
                  <input type="radio" checked={isDoublePrice} onChange={() => setIsDoublePrice(true)} className="accent-[#D4A853]" />
                  Half/Full
                </label>
              </div>
            </div>

            {isDoublePrice ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-gray-600 mb-1 uppercase tracking-widest">Half (₹)</label>
                  <input type="number" value={priceHalf} onChange={e => setPriceHalf(e.target.value)} className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#D4A853] text-sm" />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-600 mb-1 uppercase tracking-widest">Full (₹)</label>
                  <input type="number" value={priceFull} onChange={e => setPriceFull(e.target.value)} className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#D4A853] text-sm" />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-[10px] text-gray-600 mb-1 uppercase tracking-widest">Price (₹)</label>
                <input type="number" value={priceSingle} onChange={e => setPriceSingle(e.target.value)} className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#D4A853] text-sm" />
              </div>
            )}
          </div>

          {/* Show toggle */}
          <div className="md:col-span-2 border-t border-white/5 pt-6 mt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} className="sr-only" />
                <div className={`block w-10 h-5 md:w-12 md:h-6 rounded-full transition-colors ${show ? 'bg-[#D4A853]' : 'bg-gray-600'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-3 h-3 md:w-4 md:h-4 rounded-full transition-transform ${show ? 'transform translate-x-5 md:translate-x-6' : ''}`}></div>
              </div>
              <span className="text-xs md:text-sm font-medium text-gray-300">Show on website</span>
            </label>
          </div>
        </div>

        <div className="pt-6 border-t border-white/5">
          <button 
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-[#D4A853] hover:bg-[#F5D547] text-black px-8 py-3 rounded-xl font-bold transition-all shadow-lg text-sm"
          >
            <Save size={18} />
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminEditItem;
