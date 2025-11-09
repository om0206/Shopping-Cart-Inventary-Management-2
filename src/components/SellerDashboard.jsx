import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // --- NEW ---
import { 
  FaPlus, FaEdit, FaTrash, FaTimes, 
  FaBoxOpen, FaShoppingBag, FaSignOutAlt // --- NEW ---
} from 'react-icons/fa';

// --- Product Modal Component (for Add/Edit) ---
const ProductModal = ({ isOpen, onClose, onSubmit, product, mode }) => {
  const [formData, setFormData] = useState({
    brand: '', name: '', category: 'Apparel', price: 0, originalPrice: 0,
    discountPercent: 0, imageUrl: '', sizes: '', tag: ''
  });

  // Load data on modal open (for "Edit")
  useEffect(() => {
    if (mode === 'edit' && product) {
      setFormData({
        ...product,
        sizes: product.sizes.join(', ')
      });
    } else {
      // Reset form for "Add"
      setFormData({
        brand: '', name: '', category: 'Apparel', price: 0, originalPrice: 0,
        discountPercent: 0, imageUrl: '', sizes: '', tag: ''
      });
    }
  }, [product, mode, isOpen]);

  // --- AUTO-CALCULATE DISCOUNT ---
  useEffect(() => {
    const price = parseFloat(formData.price);
    const originalPrice = parseFloat(formData.originalPrice);

    if (originalPrice > 0 && price > 0 && price < originalPrice) {
      const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
      setFormData(prev => ({ ...prev, discountPercent: discount }));
    } else {
      setFormData(prev => ({ ...prev, discountPercent: 0 }));
    }
  }, [formData.price, formData.originalPrice]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      originalPrice: parseFloat(formData.originalPrice),
      discountPercent: parseInt(formData.discountPercent),
      sizes: formData.sizes.split(',').map(s => s.trim()).filter(s => s),
    };
    onSubmit(productData);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50" onClick={onClose}></div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-gray-800 text-white rounded-lg shadow-xl z-50">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-2xl font-bold">
            {mode === 'add' ? 'Add New Product' : 'Edit Product'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <FaTimes size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* ... (rest of form is correct) ... */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Brand</label>
              <input type="text" name="brand" value={formData.brand} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Product Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2" required />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Price (₹)</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Original Price (₹)</label>
              <input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Discount (%)</label>
              <input type="number" name="discountPercent" value={formData.discountPercent} className="w-full bg-gray-600 border border-gray-600 rounded-lg p-2" readOnly />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Image URL</label>
            <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Sizes (comma-separated)</label>
            <input type="text" name="sizes" value={formData.sizes} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2" placeholder="e.g., S, M, L, XL" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Category</label>
              <input type="text" name="category" value={formData.category} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Tag (e.g., Hot Deal)</label>
              <input type="text" name="tag" value={formData.tag} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2" />
            </div>
          </div>
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-700">
            <button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg">Cancel</button>
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg">{mode === 'add' ? 'Add Product' : 'Save Changes'}</button>
          </div>
        </form>
      </div>
    </>
  );
};


// --- Orders Tab Component ---
const OrdersTab = ({ orders }) => {
  // ... (This component is correct, no changes needed) ...
  if (orders.length === 0) {
    return <div className="p-6 text-gray-400 text-center">No new orders.</div>;
  }
  return (
    <div className="p-4 space-y-4">
      {orders.map(order => (
        <div key={order.id} className="bg-gray-700 rounded-lg shadow-lg p-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-gray-600 pb-2 mb-2">
            <div>
              <h3 className="text-xl font-bold">Order #{order.id}</h3>
              <p className="text-sm text-gray-400">Date: {order.date}</p>
            </div>
            <span className="text-lg font-bold text-cyan-400 mt-2 sm:mt-0">₹{order.total.toFixed(0)}</span>
          </div>
          <div className="mb-2">
            <h4 className="font-semibold mb-1">Customer: {order.customer}</h4>
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${order.status === 'Pending' ? 'bg-yellow-500 text-gray-900' : 'bg-green-500 text-white'}`}>{order.status}</span>
          </div>
          <h4 className="font-semibold mb-1">Items:</h4>
          <ul className="list-disc list-inside text-gray-300">
            {order.items.map(item => (<li key={item.id}>{item.name} (x{item.quantity})</li>))}
          </ul>
        </div>
      ))}
    </div>
  );
};


// --- Products Tab Component ---
const ProductsTab = ({ allProducts, onOpenEditModal, onDelete }) => {
  // ... (This component is correct, no changes needed) ...
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-gray-700">
          <tr>
            <th className="p-4">Image</th><th className="p-4">Name</th><th className="p-4">Price</th><th className="p-4">Category</th><th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {allProducts.map(product => (
            <tr key={product.id} className="border-b border-gray-700">
              <td className="p-4"><img src={product.imageUrl} alt={product.name} className="w-16 h-16 rounded-lg object-cover" onError={(e) => e.target.src = 'https://placehold.co/100x100/1e293b/9ca3af?text=No+Img'}/></td>
              <td className="p-4"><div className="font-semibold">{product.name}</div><div className="text-sm text-gray-400">{product.brand}</div></td>
              <td className="p-4"><div className="font-bold text-cyan-400">₹{product.price.toFixed(0)}</div>{product.originalPrice > 0 && (<div className="text-sm text-gray-500 line-through">₹{product.originalPrice.toFixed(0)}</div>)}</td>
              <td className="p-4">{product.category}</td>
              <td className="p-4">
                <div className="flex space-x-2">
                  <button onClick={() => onOpenEditModal(product)} className="text-yellow-400 hover:text-yellow-300 p-2"><FaEdit size={18} /></button>
                  <button onClick={() => onDelete(product.id)} className="text-red-500 hover:text-red-400 p-2"><FaTrash size={18} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


// --- Main Seller Dashboard Component ---
export default function SellerDashboard({ allProducts, orders, onAddProduct, onEditProduct, onDeleteProduct }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentProduct, setCurrentProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('products');
  
  const navigate = useNavigate(); // --- NEW ---

  // --- NEW: Logout Function ---
  const handleLogout = () => {
    navigate('/login'); // Redirect to login page
  };

  // --- Modal Control Functions (all correct) ---
  const handleOpenAddModal = () => {
    setModalMode('add');
    setCurrentProduct(null);
    setIsModalOpen(true);
  };
  const handleOpenEditModal = (product) => {
    setModalMode('edit');
    setCurrentProduct(product);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleSubmitModal = (productData) => {
    if (modalMode === 'add') {
      onAddProduct(productData);
    } else {
      onEditProduct({ ...productData, id: currentProduct.id });
    }
    handleCloseModal();
  };
  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      onDeleteProduct(productId);
    }
  };

  return (
    <>
      <main className="container mx-auto p-6">
        {/* --- UPDATED HEADER --- */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-4 sm:mb-0">Seller Dashboard</h1>
          
          <div className="flex items-center space-x-4">
            {activeTab === 'products' && (
              <button
                onClick={handleOpenAddModal}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                <FaPlus />
                <span>Add New Product</span>
              </button>
            )}
            {/* --- NEW LOGOUT BUTTON --- */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* --- Tab Navigation --- */}
        <div className="flex border-b border-gray-700 mb-4">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center space-x-2 py-3 px-6 text-lg font-semibold ${activeTab === 'products' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400'}`}
          >
            <FaBoxOpen />
            <span>Manage Products</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center space-x-2 py-3 px-6 text-lg font-semibold ${activeTab === 'orders' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400'}`}
          >
            <FaShoppingBag />
            <span>View Orders</span>
          </button>
        </div>

        {/* --- Conditional Content --- */}
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {activeTab === 'products' ? (
            <ProductsTab 
              allProducts={allProducts}
              onOpenEditModal={handleOpenEditModal}
              onDelete={handleDelete}
            />
          ) : (
            <OrdersTab orders={orders} />
          )}
        </div>
      </main>

      {/* --- Render the Modal --- */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitModal}
        product={currentProduct}
        mode={modalMode}
      />
    </>
  );
}