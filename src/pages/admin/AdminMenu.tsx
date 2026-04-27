import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';

const AdminMenu = () => {
  const { menuData, deleteItem, toggleItemVisibility, syncToYaml } = useAdmin();
  const navigate = useNavigate();
  const [deleteTarget, setDeleteTarget] = React.useState<{ category: string, id: string, name: string } | null>(null);

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteItem(deleteTarget.category, deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-white mb-2">Menu Management</h1>
          <p className="text-gray-400 text-sm">Manage your cafe's menu items, prices, and visibility.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button 
            onClick={async () => {
              const success = await syncToYaml();
              if (success) alert('Database synced to YAML successfully!');
              else alert('Failed to sync to YAML. Check console.');
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#10b3a3] hover:bg-[#15c5b5] text-white px-6 py-2.5 rounded-lg font-bold transition-all shadow-lg text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            <span>Update / Sync YAML</span>
          </button>
          <button 
            onClick={() => navigate('/admin/menu/add')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#D4A853] hover:bg-[#F5D547] text-black px-6 py-2.5 rounded-lg font-bold transition-all shadow-lg text-sm"
          >
            <Plus size={18} />
            <span>Add Menu Item</span>
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {menuData.map((category) => (
          <div key={category.category} className="bg-[#111] border border-white/5 rounded-xl overflow-hidden shadow-xl">
            <div className="bg-[#1a1a1a] px-4 md:px-6 py-3 md:py-4 border-b border-white/5">
              <h2 className="text-lg md:text-xl font-serif font-bold text-[#D4A853]">{category.category}</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-[#0a0a0a] text-[10px] md:text-xs uppercase tracking-wider text-gray-500 border-b border-white/5">
                    <th className="px-4 md:px-6 py-3 md:py-4 font-medium">Item</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 font-medium">Price</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 font-medium text-center">Status</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {category.items.map((item) => (
                    <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 md:px-6 py-3 md:py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-black overflow-hidden border border-white/10 flex-shrink-0">
                            {item.images[0] ? (
                              <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-600 text-[8px]">No img</div>
                            )}
                          </div>
                          <span className={`font-medium transition-colors ${item.show ? 'text-gray-200' : 'text-gray-500'} line-clamp-1`}>{item.name}</span>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4 text-gray-400 text-xs md:text-sm whitespace-nowrap">{item.price}</td>
                      <td className="px-4 md:px-6 py-3 md:py-4 text-center">
                        <button 
                          onClick={() => toggleItemVisibility(category.category, item.id)}
                          className={`inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full transition-colors ${item.show ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}
                          title={item.show ? "Visible" : "Hidden"}
                        >
                          {item.show ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4 text-right">
                        <div className="flex items-center justify-end gap-2 md:gap-3">
                          <button 
                            onClick={() => navigate(`/admin/menu/edit/${encodeURIComponent(category.category)}/${item.id}`)}
                            className="p-1.5 md:p-2 text-gray-400 hover:text-[#D4A853] hover:bg-[#D4A853]/10 rounded-lg"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => setDeleteTarget({ category: category.category, id: item.id, name: item.name })}
                            className="p-1.5 md:p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {category.items.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-gray-500 italic text-xs">No items in this category.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1a1a1a] border border-white/10 p-6 rounded-2xl w-full max-w-sm shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-2">Delete Item?</h2>
            <p className="text-sm text-gray-400 mb-6">Are you sure you want to delete <span className="text-white font-bold">{deleteTarget.name}</span>? This action cannot be undone.</p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setDeleteTarget(null)}
                className="flex-1 bg-white/5 hover:bg-white/10 text-white py-2 rounded-lg font-bold transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 rounded-lg font-bold transition-colors shadow-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMenu;
