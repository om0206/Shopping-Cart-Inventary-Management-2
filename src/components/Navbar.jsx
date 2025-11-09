import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaSignOutAlt, FaSearch, FaBars } from 'react-icons/fa'; // --- NEW: FaBars

// --- NEW PROP: onMenuClick
export default function Navbar({ cartItemCount, searchTerm, setSearchTerm, onMenuClick }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('Logging out...');
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <div className="flex items-center space-x-4">
            {/* --- NEW: Menu Button --- */}
            <button 
              onClick={onMenuClick} 
              className="text-gray-300 hover:text-white"
              aria-label="Expand menu"
            >
              <FaBars size={22} />
            </button>
            
            {/* Logo/Title */}
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-bold text-cyan-400">
                ChronoCart
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 flex justify-center px-4">
            <div className="relative w-full max-w-lg">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" size={16} />
              </div>
              <input
                type="search"
                name="search"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-lg leading-5 bg-gray-700 text-gray-300 placeholder-gray-400 focus:outline-none focus:bg-white focus:text-gray-900"
                placeholder="Search for products"
              />
            </div>
          </div>
          
          {/* Right side icons */}
          <div className="flex items-center space-x-6">
            {/* Cart Icon */}
            <Link 
              to="/cart" 
              className="relative text-gray-300 hover:text-white transition-colors"
            >
              <FaShoppingCart size={24} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <FaSignOutAlt size={20} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}