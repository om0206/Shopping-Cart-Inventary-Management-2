import React, { useEffect, useState } from "react";

// --- ProductCard Component ---
const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-cyan-500/30">
      <div className="relative">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-auto aspect-[3/4] object-cover"
          onError={(e) =>
            (e.target.src =
              "https://placehold.co/600x800/1e293b/9ca3af?text=Image+Not+Found")
          }
        />
      </div>

      <div className="p-3">
        <h4 className="text-xs font-bold text-gray-400 mb-0.5">
          {product.brand || "Kmartz"}
        </h4>

        <h3
          className="text-sm text-white font-semibold truncate"
          title={product.name}
        >
          {product.name}
        </h3>

        <div className="flex items-baseline space-x-1.5 mt-1.5">
          <span className="text-base font-bold text-cyan-400">
            ₹{product.price?.toFixed(0)}
          </span>
        </div>

        <button
          onClick={() => onAddToCart(product)}
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-bold py-1.5 px-3 rounded-lg transition-colors duration-300 mt-2"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

// --- Toast Notification Component ---
const Toast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000); // Auto-hide in 3 sec
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-5 right-5 bg-cyan-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm animate-slideIn">
      {message}
    </div>
  );
};

// --- Main Customer Dashboard Component ---
export default function CustomerDashboard({
  searchTerm,
  selectedCategory,
  onSetCategory,
}) {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null); // ✅ Toast state

  // ✅ Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/products/all");
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setAllProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ✅ Add product to cart (with toast)
  const handleAddToCart = async (product) => {
    const customerId = localStorage.getItem("customerId");
    if (!customerId) {
      setToast("Please log in to add products to cart!");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/cart/add/${customerId}/${product.productId}`,
        { method: "POST" }
      );

      if (response.ok) {
        setToast(`🛒 ${product.name} added to cart`);
      } else {
        const errorText = await response.text();
        setToast("⚠️ " + errorText);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      setToast("❌ Failed to add product to cart");
    }
  };

  const filteredProducts = allProducts
    .filter(
      (product) =>
        selectedCategory === "All" || product.category === selectedCategory
    )
    .filter(
      (product) =>
        searchTerm === "" ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  if (loading)
    return (
      <p className="text-center text-gray-400 text-lg mt-10">Loading products...</p>
    );

  if (error)
    return (
      <p className="text-center text-red-400 text-lg mt-10">Error: {error}</p>
    );

  return (
    <main className="container mx-auto p-6">
      {searchTerm === "" && selectedCategory === "All" && (
        <div className="relative bg-gradient-to-r from-cyan-600 to-blue-800 p-8 rounded-lg mb-8 text-white shadow-lg overflow-hidden">
          <h2 className="text-4xl font-bold mb-2">Flash Sale!</h2>
          <p className="text-xl mb-4">
            Get up to{" "}
            <span className="font-extrabold text-yellow-300">50% off</span> on
            all electronics.
          </p>
          <button
            onClick={() => onSetCategory("Electronics")}
            className="bg-white text-blue-600 font-bold py-2 px-6 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Shop Now
          </button>
        </div>
      )}

      <h2 className="text-3xl font-bold text-white mb-6">
        {searchTerm
          ? `Searching for "${searchTerm}"`
          : `${selectedCategory} Products`}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.productId}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))
        ) : (
          <p className="text-gray-400 col-span-full text-center text-lg">
            No products found.
          </p>
        )}
      </div>

      {/* ✅ Toast Notification */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </main>
  );
}
