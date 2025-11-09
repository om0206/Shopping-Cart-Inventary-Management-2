import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const navigate = useNavigate();
  const customerId = localStorage.getItem("customerId");

  // Fetch Cart Items
  const fetchCart = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/cart/${customerId}`);
      const data = await res.json();
      setCart(data);
      setTotal(
        data.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        )
      );
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Quantity Controls
  const incrementQty = async (productId) => {
    await fetch(
      `http://localhost:8080/api/cart/increment/${customerId}/${productId}`,
      { method: "PUT" }
    );
    fetchCart();
  };

  const decrementQty = async (productId) => {
    await fetch(
      `http://localhost:8080/api/cart/decrement/${customerId}/${productId}`,
      { method: "PUT" }
    );
    fetchCart();
  };

  const removeItem = async (productId) => {
    await fetch(
      `http://localhost:8080/api/cart/remove/${customerId}/${productId}`,
      { method: "DELETE" }
    );
    fetchCart();
  };

  // ✅ Proceed to Checkout (Create Order for each product)
  const placeOrder = async () => {
    if (cart.length === 0) return;
    setIsPlacingOrder(true);

    try {
      for (const item of cart) {
        const productId = item.product.productId;
        await fetch(
          `http://localhost:8080/api/products/order/create/${productId}/${customerId}`,
          { method: "POST" }
        );
      }

      // Optional: clear cart after placing order
      for (const item of cart) {
        await fetch(
          `http://localhost:8080/api/cart/remove/${customerId}/${item.product.productId}`,
          { method: "DELETE" }
        );
      }

      // Redirect after successful checkout
      navigate("/dashboard");
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Try again later.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Your Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center text-gray-400 bg-gray-800 p-8 rounded-lg">
          <p className="text-xl mb-4">Your cart is empty.</p>
          <Link
            to="/dashboard"
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg shadow-lg">
            {cart.map((item) => (
              <div
                key={item.cartId}
                className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-4 p-4 bg-gray-700 rounded-lg"
              >
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-xl font-semibold text-white">
                    {item.product.name}
                  </h3>
                  <p className="text-lg text-cyan-400">
                    ₹{item.product.price.toFixed(0)}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => decrementQty(item.product.productId)}
                    className="p-2 bg-gray-600 rounded-full hover:bg-gray-500"
                  >
                    <FaMinus size={12} />
                  </button>
                  <span className="text-xl font-bold w-8 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => incrementQty(item.product.productId)}
                    className="p-2 bg-gray-600 rounded-full hover:bg-gray-500"
                  >
                    <FaPlus size={12} />
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.product.productId)}
                  className="text-gray-400 hover:text-red-500 p-2"
                >
                  <FaTrash size={20} />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 bg-gray-800 p-6 rounded-lg shadow-lg h-fit sticky top-24">
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-700 pb-2">
              Order Summary
            </h2>
            <div className="flex justify-between items-center mb-6 text-xl border-t border-gray-700 pt-2">
              <span className="text-white font-bold">Total:</span>
              <span className="text-cyan-400 font-bold">
                ₹{total.toFixed(0)}
              </span>
            </div>
            <button
              onClick={placeOrder}
              disabled={isPlacingOrder}
              className={`w-full font-bold py-3 px-4 rounded-lg transition-colors duration-300 ${
                isPlacingOrder
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-cyan-600 hover:bg-cyan-700 text-white"
              }`}
            >
              {isPlacingOrder ? "Placing Order..." : "Proceed to Checkout"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
