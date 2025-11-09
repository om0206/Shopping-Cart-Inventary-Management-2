import React from 'react';

// --- !!! NEW ProductCard Component !!! ---
// This is rebuilt to match your image, with tags, sizes, and discounts
// --- !!! UPDATED ProductCard Component !!! ---
// This now uses ₹ and formats the price like your image
// --- !!! UPDATED ProductCard Component (Slightly Smaller) !!! ---
// Padding and font sizes have been reduced for a more compact card
const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-cyan-500/30">
      {/* Image Container with Tag */}
      <div className="relative">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-auto aspect-[3/4] object-cover"
          onError={(e) => e.target.src = 'https.placehold.co/600x800/1e293b/9ca3af?text=Image+Not+Found'}
        />
        {/* Tag */}
        {product.tag && (
          <div className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-br-lg">
            {product.tag}
          </div>
        )}
      </div>

      {/* Content Container (Reduced Padding) */}
      <div className="p-3">
        {/* Brand (Smaller) */}
        <h4 className="text-xs font-bold text-gray-400 mb-0.5">{product.brand}</h4>
        
        {/* Name (Smaller) */}
        <h3 className="text-sm text-white font-semibold truncate" title={product.name}>
          {product.name}
        </h3>

        {/* PRICE (Smaller) */}
        <div className="flex items-baseline space-x-1.5 mt-1.5">
          <span className="text-base font-bold text-cyan-400">
            ₹{product.price.toFixed(0)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-gray-500 line-through">
              ₹{product.originalPrice.toFixed(0)}
            </span>
          )}
          {product.discountPercent && (
            <span className="text-xs font-bold text-green-500">
              {product.discountPercent}% off
            </span>
          )}
        </div>
        {/* ------------------------- */}

        {/* Sizes (Smaller) */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="mt-2 mb-2">
            <span className="text-xs font-medium text-gray-400">
              Size: {product.sizes.join(', ')}
            </span>
          </div>
        )}

        {/* Add to Cart Button (Smaller) */}
        <button
          onClick={() => onAddToCart(product)}
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-bold py-1.5 px-3 rounded-lg transition-colors duration-300 mt-1"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};


// --- Main Customer Dashboard Component (No other changes needed) ---
export default function CustomerDashboard({ 
  allProducts,
  onAddToCart, 
  searchTerm, 
  selectedCategory,
  onSetCategory // --- NEW PROP (passed from App.jsx) ---
}) {

  const filteredProducts = allProducts
    .filter(product => selectedCategory === 'All' || product.category === selectedCategory)
    .filter(product => searchTerm === '' || product.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div>
      <main className="container mx-auto p-6">
        
        {/* Hero Banner */}
        {searchTerm === '' && selectedCategory === 'All' && (
          <div className="relative bg-gradient-to-r from-cyan-600 to-blue-800 p-8 rounded-lg mb-8 text-white shadow-lg overflow-hidden">
            <h2 className="text-4xl font-bold mb-2">Flash Sale!</h2>
            <p className="text-xl mb-4">Get up to <span className="font-extrabold text-yellow-300">50% off</span> on all electronics.</p>
            <button 
              // --- THIS BUTTON NOW WORKS! ---
              onClick={() => onSetCategory('Electronics')}
              className="bg-white text-blue-600 font-bold py-2 px-6 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Shop Now
            </button>
            <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-white/20 rounded-full opacity-50"></div>
            <div className="absolute -bottom-4 -right-12 w-32 h-32 bg-white/20 rounded-full opacity-70"></div>
          </div>
        )}

        {/* Product List Title */}
        <h2 className="text-3xl font-bold text-white mb-6">
          {searchTerm ? `Searching for "${searchTerm}"` : `${selectedCategory} Products`}
        </h2>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={onAddToCart}
              />
            ))
          ) : (
            <p className="text-gray-400 col-span-full text-center text-lg">
              No products found.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}