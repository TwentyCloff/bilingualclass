import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, ShoppingCart, Trash2, Edit3, ExternalLink, Calculator, Package, Tag, DollarSign } from 'lucide-react';
import { collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

export default function List() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

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

  useEffect(() => {
    const q = query(collection(db, 'shopping-items'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const itemsList = [];
      querySnapshot.forEach((doc) => {
        itemsList.push({ id: doc.id, ...doc.data() });
      });
      setItems(itemsList);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'cart-items'), orderBy('addedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const cartList = [];
      querySnapshot.forEach((doc) => {
        cartList.push({ id: doc.id, ...doc.data() });
      });
      setCartItems(cartList);
    });
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
    try {
      await deleteDoc(doc(db, 'shopping-items', id));
      setPopupMessage('Item deleted!');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const addToCart = async (item) => {
    try {
      const cartDocId = new Date().getTime().toString();
      await setDoc(doc(db, 'cart-items', cartDocId), {
        ...item,
        originalId: item.id,
        addedAt: new Date(),
        cartQuantity: 1
      });
      setPopupMessage('Added to cart!');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = async (cartId) => {
    try {
      await deleteDoc(doc(db, 'cart-items', cartId));
      setPopupMessage('Removed from cart!');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateCartQuantity = async (cartId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateDoc(doc(db, 'cart-items', cartId), {
        cartQuantity: newQuantity
      });
    } catch (error) {
      console.error('Error updating cart quantity:', error);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getTotalCart = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.cartQuantity), 0);
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

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Corner Elements */}
      <div className="absolute top-6 left-6 w-8 h-8 border-t border-l border-white/20"></div>
      <div className="absolute top-6 right-6 w-8 h-8 border-t border-r border-white/20"></div>
      <div className="absolute bottom-6 left-6 w-8 h-8 border-b border-l border-white/20"></div>
      <div className="absolute bottom-6 right-6 w-8 h-8 border-b border-r border-white/20"></div>

      <div className="relative z-10 px-6 py-20 max-w-6xl mx-auto">
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

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowCart(!showCart)}
              className="relative flex items-center px-4 py-2 border border-white/20 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Cart ({cartItems.length})
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-xs rounded-full flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </button>
            
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
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
                            {formatPrice(item.price)}
                          </span>
                          <span className="text-sm text-gray-400 bg-white/5 px-2 py-1 rounded">
                            {item.category}
                          </span>
                          <span className="text-sm text-gray-400">
                            Qty: {item.quantity}
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
                            {item.createdAt?.toDate?.()?.toLocaleDateString('id-ID')}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => addToCart(item)}
                          className="p-2 text-green-400 hover:text-green-300 hover:bg-green-400/10 rounded-lg transition-all duration-300"
                          title="Add to Cart"
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </button>
                        
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
          </div>

          {/* Cart Sidebar */}
          <div className={`lg:col-span-1 ${showCart ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-8">
              <div className="border border-white/20 p-6 rounded-lg bg-black/30 backdrop-blur-sm">
                <h3 className="text-xl font-light mb-6 flex items-center justify-between">
                  <span className="flex items-center">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Shopping Cart
                  </span>
                  <span className="text-sm text-gray-400">({cartItems.length} items)</span>
                </h3>
                
                {cartItems.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Your cart is empty</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                      {cartItems.map((item) => (
                        <div key={item.id} className="border border-white/10 p-3 rounded-lg bg-black/40">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-sm font-medium text-white">{item.name}</h4>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-400 hover:text-red-300 ml-2"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-green-400 text-sm">
                              {formatPrice(item.price)}
                            </span>
                            
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => updateCartQuantity(item.id, item.cartQuantity - 1)}
                                className="w-6 h-6 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded text-xs"
                              >
                                -
                              </button>
                              <span className="text-sm w-8 text-center">{item.cartQuantity}</span>
                              <button
                                onClick={() => updateCartQuantity(item.id, item.cartQuantity + 1)}
                                className="w-6 h-6 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded text-xs"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          
                          <div className="text-right text-xs text-gray-400 mt-1">
                            Subtotal: {formatPrice(item.price * item.cartQuantity)}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t border-white/20 pt-4">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-lg font-medium flex items-center">
                          <Calculator className="w-4 h-4 mr-2" />
                          Total:
                        </span>
                        <span className="text-xl font-bold text-green-400">
                          {formatPrice(getTotalCart())}
                        </span>
                      </div>
                      
                      <button className="w-full py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white rounded-lg transition-all duration-300 flex items-center justify-center">
                        <DollarSign className="w-4 h-4 mr-2" />
                        Proceed to Checkout
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Success Popup */}
        {showPopup && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-black/90 border border-green-500/30 px-6 py-3 rounded-lg shadow-lg z-50 backdrop-blur-md">
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
