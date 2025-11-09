import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Import Components
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import CustomerDashboard from './components/CustomerDashboard';
import Navbar from './components/Navbar';
import CartPage from './components/CartPage';
import CategorySidebar from './components/CategorySidebar';
import SellerDashboard from './components/SellerDashboard';

// --- MOCK DATA (Initial State) ---
const initialProducts = [
  { id: 1, brand: 'yciothy', name: 'Men Printed Polo Neck Po...', price: 299, originalPrice: 899, 
    discountPercent: 66, category: 'Apparel', imageUrl: 'https://rukminim2.flixcart.com/image/612/612/xif0q/t-shirt/q/r/4/m-polo-8016-kajaru-original-imaheznunfdce2uw.jpeg?q=70', sizes: ['S', 'M', 'L', 'XL', 'XXL'], tag: 'Hot Deal' },
  { id: 2, brand: 'Alan Jones', name: 'Men Solid Polo Neck Cotton...', price: 279, originalPrice: 999, discountPercent: 72, category: 'Apparel',
     imageUrl: 'https://rukminim2.flixcart.com/image/612/612/xif0q/t-shirt/e/e/j/m-tdgy-mrrnplaind164-tripr-original-imah8cnnvybxmj5w.jpeg?q=70', sizes: ['S', 'M', 'L'], tag: 'Hot Deal' },
  { id: 3, brand: 'zora', name: 'duzo Jhula Hanging Swing Chair for Adult Balcony Steel Hammock..', price: 6208, originalPrice: 21999, discountPercent: 71, category: 'Apparel',
     imageUrl: 'https://rukminim2.flixcart.com/image/612/612/xif0q/hammock-swing/f/s/e/37-20-blksw002-duzo-original-imahbg3npvgbgsdt.jpeg?q=70', sizes:['free'], tag: 'Hot Deal' },
  { id: 4, brand: 'Brutone', name: 'Slippers | Ortho | Slides | Flipflop | Clogs | Acupressure Men Slippers  (Black , 6)', price: 399, originalPrice: 999, discountPercent: 71, category: 'Apparel',
     imageUrl: 'https://rukminim2.flixcart.com/image/612/612/xif0q/slipper-flip-flop/7/m/e/6-slp-1122-tan-black-bruton-black-original-imahbhv2zgswsnzf.jpeg?q=70', sizes:['6','7','8','9'], tag: 'Hot Deal' },
];

// --- Main App Content ---
function AppContent() {
  const [allProducts, setAllProducts] = useState(initialProducts);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCategorySidebarOpen, setIsCategorySidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [orders, setOrders] = useState([]);

  // --- PRODUCT MANAGEMENT FUNCTIONS (WITH LOGIC) ---
  const handleAddProduct = (newProduct) => {
    setAllProducts(prevProducts => [
      ...prevProducts,
      { ...newProduct, id: Date.now() } // Add new product with a simple unique ID
    ]);
  };

  const handleEditProduct = (updatedProduct) => {
    setAllProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
  };

  const handleDeleteProduct = (productId) => {
    setAllProducts(prevProducts =>
      prevProducts.filter(product => product.id !== productId)
    );
  };

  // --- CART FUNCTIONS (WITH LOGIC) ---
  const handleAddToCart = (product) => {
    setCart(prevCart => {
      const itemInCart = prevCart.find(item => item.id === product.id);
      if (itemInCart) {
        // If item exists, increase quantity
        return prevCart.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // If new item, add with quantity 1
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const handleUpdateQuantity = (productId, amount) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === productId) {
          const newQuantity = item.quantity + amount;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
        }
        return item;
      }).filter(Boolean); // filter(Boolean) removes the null items
    });
  };

  const handleRemoveFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  // --- ORDER FUNCTION (WITH LOGIC) ---
  const handlePlaceOrder = () => {
    const newOrder = {
      id: Date.now(),
      items: cart,
      total: cartTotal,
      customer: 'Om Kadam', // Placeholder
      status: 'Pending',
      date: new Date().toLocaleString(),
    };
    setOrders(prevOrders => [newOrder, ...prevOrders]);
    setCart([]);
  };
  
  const categories = ['All', ...new Set(allProducts.map(p => p.category))];
  const location = useLocation();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const isSellerPage = location.pathname === '/seller-dashboard';

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      
      {!isAuthPage && !isSellerPage && (
        <>
          <Navbar 
            cartItemCount={cartItemCount} 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
            onMenuClick={() => setIsCategorySidebarOpen(true)}
          />
          <CategorySidebar
            isOpen={isCategorySidebarOpen}
            onClose={() => setIsCategorySidebarOpen(false)}
            categories={categories}
            selectedCategory={selectedCategory}
            onSetCategory={setSelectedCategory}
          />
        </>
      )}
      
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* --- CUSTOMER ROUTES --- */}
        <Route 
          path="/dashboard" 
          element={
            <CustomerDashboard 
              allProducts={allProducts}
              onAddToCart={handleAddToCart} 
              searchTerm={searchTerm} 
              selectedCategory={selectedCategory}
              onSetCategory={setSelectedCategory}
            />
          } 
        />
        <Route 
          path="/cart" 
          element={ 
            <CartPage 
              cart={cart}
              total={cartTotal}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveFromCart}
              onPlaceOrder={handlePlaceOrder}
            /> 
          } 
        />

        {/* --- SELLER ROUTE --- */}
        <Route 
          path="/seller-dashboard" 
          element={
            <SellerDashboard
              allProducts={allProducts}
              orders={orders}
              onAddProduct={handleAddProduct}
              onEditProduct={handleEditProduct}
              onDeleteProduct={handleDeleteProduct}
            />
          } 
        />
      </Routes>
    </div>
  );
}

// Main App component
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;