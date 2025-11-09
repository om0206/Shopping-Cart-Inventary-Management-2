import React from 'react';
import { FaTimes } from 'react-icons/fa';

export default function CategorySidebar({ 
  isOpen, 
  onClose, 
  categories, 
  selectedCategory, 
  onSetCategory 
}) {
  
  const handleCategoryClick = (category) => {
    onSetCategory(category); // Set the new category in App.jsx
    onClose(); // Close the sidebar
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      ></div>

      {/* Sidebar */}
      <div 
        className={`fixed top-0 left-0 h-full w-full max-w-xs bg-gray-800 text-white shadow-xl z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-2xl font-bold">Categories</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <FaTimes size={24} />
          </button>
        </div>

        {/* Category List */}
        <nav className="p-4 space-y-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`w-full text-left p-3 rounded-lg transition-colors duration-200
                ${selectedCategory === category 
                  ? 'bg-cyan-600 text-white font-semibold' 
                  : 'text-gray-300 hover:bg-gray-700'
                }`}
            >
              {category}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}