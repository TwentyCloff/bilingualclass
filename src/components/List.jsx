import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Edit3, ExternalLink, Package, Tag, DollarSign } from 'lucide-react';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

export default function List() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Electronics',
    priority: 'Medium',
    link: '',
    description: '',
    quantity: 1
  });

  const categories = [
    'Electronics', 'Clothing', 'Food & Beverage', 'Books', 'Health & Beauty', 
    'Home & Garden', 'Sports', 'Toys & Games', 'Automotive', 'Other'
  ];

  const priorities = ['Low', 'Medium', 'High', 'Urgent'];

  // Improved realtime listener with caching
  useEffect(() => {
    const q = query(collection(db, 'shopping-items'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const itemsList = [];
        let runningTotal = 0;
        
        querySnapshot.forEach((doc) => {
          const item = { 
            id: doc.id, 
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate?.() || null
          };
          itemsList.push(item);
          runningTotal += (item.price * (item.quantity || 1));
        });
        
        setItems(itemsList);
        setTotalPrice(runningTotal);
      },
      (error) => {
        console.error("Error loading items:", error);
      }
    );
    
    return () => unsubscribe();
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      category: 'Electronics',
      priority: 'Medium',
      link: '',
      description: '',
      quantity: 1
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) return;

    setIsSubmitting(true);
    try {
      const now = new Date();
      const docId = now.getTime().toString();
      
      const itemData = {
        ...formData,
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        description: formData.description.trim(),
        link: formData.link.trim(),
        createdAt: now,
        updatedAt: now,
        status: 'active'
      };

      if (editingId) {
        await updateDoc(doc(db, 'shopping-items', editingId), {
          ...itemData,
          updatedAt: now
        });
        setPopupMessage('Item updated successfully!');
      } else {
        await setDoc(doc(db, 'shopping-items', docId), itemData);
        setPopupMessage('Item added to list!');
      }
      
      resetForm();
      setShowAddForm(false);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    } catch (error) {
      console.error('Error saving item:', error);
      setPopupMessage('Error saving item!');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      price: item.price.toString(),
      category: item.category,
      priority: item.priority,
      link: item.link || '',
      description: item.description || '',
      quantity: item.quantity || 1
    });
    setEditingId(item.id);
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    try {
      await deleteDoc(doc(db, 'shopping-items', id));
      setPopupMessage('Item deleted!');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Urgent': return 'text-red-400 bg-red-400/10';
      case 'High': return 'text-orange-400 bg-orange-400/10';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/10';
      case 'Low': return 'text-green-400 bg-green-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  // Calculate total by category
  const getCategoryTotals = () => {
    const categoryMap = {};
    
    items.forEach(item => {
      if (!categoryMap[item.category]) {
        categoryMap[item.category] = 0;
      }
      categoryMap[item.category] += (item.price * (item.quantity || 1));
    });
    
    return Object.entries(categoryMap).map(([category, total]) => ({
      category,
      total,
      percentage: (total / totalPrice) * 100
    })).sort((a, b) => b.total - a.total);
  };

  const categoryTotals = getCategoryTotals();

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Corner Elements */}
      <div className="absolute top-6 left-6 w-8 h-8 border-t border-l border-white/20"></div>
      <div className="absolute top-6 right-6 w-8 h-8 border-t border-r border-white/20"></div>
      <div className="absolute bottom-6 left-6 w-8 h-8 border-b border-l border-white/20"></div>
      <div className="absolute bottom-6 right-6 w-8 h-8 border-b border-r border-white/20"></div>

      {/* Floating Total Price */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-gradient-to-br from-purple-600 to-blue-500 p-4 rounded-xl shadow-2xl border border-white/20 backdrop-blur-sm">
          <div className="flex items-center">
            <div className="bg-white/20 p-2 rounded-lg mr-3">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-white/80">Total Value</p>
              <p className="text-2xl font-bold">{formatPrice(totalPrice)}</p>
            </div>
          </div>
          <div className="mt-2 text-xs text-white/60">
            {items.length} items • {categoryTotals.length} categories
          </div>
          
          {/* Category breakdown tooltip on hover */}
          <div className="group relative mt-2">
            <div className="text-xs bg-white/10 px-2 py-1 rounded cursor-help">
              View breakdown
            </div>
            <div className="absolute bottom-full right-0 mb-2 w-64 bg-black/90 border border-white/20 rounded-lg p-3 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
              <h4 className="text-sm font-medium mb-2">Spending by Category</h4>
              <div className="space-y-2">
                {categoryTotals.map((cat) => (
                  <div key={cat.category} className="text-xs">
                    <div className="flex justify-between mb-1">
                      <span>{cat.category}</span>
                      <span>{formatPrice(cat.total)}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1.5">
                      <div 
                        className="bg-gradient-to-r from-purple-400 to-blue-400 h-1.5 rounded-full" 
                        style={{ width: `${cat.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 px-6 py-20 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-400 hover:text-white mr-8 transition-all duration-300 group"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:transform group-hover:-translate-x-1 transition-transform" />
              Back
            </button>
            
            <div>
              <h1 className="text-4xl md:text-5xl font-light tracking-wider bg-gradient-to-r from-white via-white/80 to-white/60 bg-clip-text text-transparent">
                Shopping List
              </h1>
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-white to-transparent mt-4 mb-2"></div>
              <p className="text-gray-400 font-light">Manage your wishlist items</p>
            </div>
          </div>

          <button
            onClick={() => {
              setShowAddForm(!showAddForm);
              if (showAddForm) resetForm();
            }}
            className="flex items-center px-4 py-2 border border-white/20 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Item
          </button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <div className="border border-white/20 p-6 rounded-lg bg-black/30 backdrop-blur-sm mb-8">
            <h3 className="text-xl font-light mb-6 flex items-center">
              <Package className="w-5 h-5 mr-2" />
              {editingId ? 'Edit Item' : 'Add New Item'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2 uppercase tracking-wider font-light">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-black/50 border border-white/20 px-4 py-3 rounded-lg focus:outline-none focus:border-white/40 focus:bg-black/70 transition-all duration-300"
                    placeholder="Enter item name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2 uppercase tracking-wider font-light">
                    Price (IDR) *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full bg-black/50 border border-white/20 px-4 py-3 rounded-lg focus:outline-none focus:border-white/40 focus:bg-black/70 transition-all duration-300"
                    placeholder="Enter price"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2 uppercase tracking-wider font-light">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-black/50 border border-white/20 px-4 py-3 rounded-lg focus:outline-none focus:border-white/40 focus:bg-black/70 transition-all duration-300"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2 uppercase tracking-wider font-light">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    className="w-full bg-black/50 border border-white/20 px-4 py-3 rounded-lg focus:outline-none focus:border-white/40 focus:bg-black/70 transition-all duration-300"
                  >
                    {priorities.map((priority) => (
                      <option key={priority} value={priority}>{priority}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2 uppercase tracking-wider font-light">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
                    className="w-full bg-black/50 border border-white/20 px-4 py-3 rounded-lg focus:outline-none focus:border-white/40 focus:bg-black/70 transition-all duration-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2 uppercase tracking-wider font-light">
                  Purchase Link (Optional)
                </label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData({...formData, link: e.target.value})}
                  className="w-full bg-black/50 border border-white/20 px-4 py-3 rounded-lg focus:outline-none focus:border-white/40 focus:bg-black/70 transition-all duration-300"
                  placeholder="https://example.com/product"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2 uppercase tracking-wider font-light">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-black/50 border border-white/20 px-4 py-3 rounded-lg focus:outline-none focus:border-white/40 focus:bg-black/70 transition-all duration-300 min-h-[80px] resize-none"
                  placeholder="Additional notes about this item..."
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 flex justify-center items-center py-3 px-4 border border-white/20 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      {editingId ? 'Updating...' : 'Adding...'}
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      {editingId ? 'Update Item' : 'Add Item'}
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    resetForm();
                  }}
                  className="px-6 py-3 border border-white/20 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Items List */}
        <div className="space-y-4">
          <h2 className="text-xl font-light tracking-wider mb-6 flex items-center">
            <Package className="w-5 h-5 mr-2 text-white/60" />
            Items ({items.length})
          </h2>

          {items.length === 0 ? (
            <div className="text-center py-12 text-gray-400 border border-white/10 rounded-lg bg-black/20">
              <Package className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg mb-2">No items in your list</p>
              <p className="text-sm">Start by adding your first item!</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="border border-white/10 p-6 rounded-lg bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-medium text-white mr-4">{item.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 mb-2">
                      <span className="text-2xl font-light text-green-400">
                        {formatPrice(item.price * (item.quantity || 1))}
                      </span>
                      {item.quantity > 1 && (
                        <span className="text-sm text-gray-400">
                          ({item.quantity} × {formatPrice(item.price)})
                        </span>
                      )}
                      <span className="text-sm text-gray-400 bg-white/5 px-2 py-1 rounded">
                        {item.category}
                      </span>
                    </div>
                    
                    {item.description && (
                      <p className="text-gray-300 text-sm mb-2">{item.description}</p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {item.link && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 transition-colors flex items-center text-sm"
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            View Product
                          </a>
                        )}
                      </div>
                      
                      <span className="text-xs text-gray-500">
                        {item.createdAt?.toLocaleDateString?.('id-ID') || 'Unknown date'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded-lg transition-all duration-300"
                      title="Edit Item"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-all duration-300"
                      title="Delete Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Success Popup */}
        {showPopup && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-black/90 border border-green-500/30 px-6 py-3 rounded-lg shadow-lg z-50 backdrop-blur-md animate-fade-in">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
              <p className="text-green-400">{popupMessage}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
