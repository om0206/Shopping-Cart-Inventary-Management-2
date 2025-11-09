import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { FaUser, FaLock, FaShoppingCart, FaStore } from 'react-icons/fa';

export default function LoginPage() {
  const [role, setRole] = useState('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Get the navigate function

  const handleLogin = (e) => {
    e.preventDefault();
    console.log(`Logging in as ${role} with:`, { email, password });
    
    // --- THIS IS THE REDIRECT LOGIC ---
    // In a real app, this happens after your backend confirms the login is valid
    if (role === 'customer') {
      navigate('/dashboard'); // Go to customer page
    } else {
      navigate('/seller-dashboard'); // Go to seller page
    }
    // ---------------------------------
  };

  const isCustomer = role === 'customer';
  const primaryColor = isCustomer ? 'cyan' : 'green';

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-900">
      {/* Background Gradient Animation */}
      <div 
        className={`absolute inset-0 z-0 w-full h-full bg-gradient-to-r from-${primaryColor}-800 via-gray-900 to-${primaryColor}-900 animate-gradient-xy`}
      ></div>

      {/* Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-md p-8 bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20">
        
        {/* Role Icon */}
        <div className="flex justify-center mb-6">
          <div className={`p-4 rounded-full bg-gradient-to-br from-${primaryColor}-500 to-${primaryColor}-700 shadow-lg`}>
            {isCustomer ? (
              <FaShoppingCart className="text-white" size={40} />
            ) : (
              <FaStore className="text-white" size={40} />
            )}
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-center text-white mb-2">
          Welcome Back
        </h2>
        <p className="text-center text-gray-300 mb-6">
          Login to your <span className={`font-bold text-${primaryColor}-400 capitalize`}>{role}</span> account
        </p>

        {/* Role Toggle */}
        <div className="flex justify-center mb-6 rounded-lg bg-black/30 p-1">
          <button
            onClick={() => setRole('customer')}
            className={`w-1/2 py-2 px-4 font-semibold rounded-lg focus:outline-none transition-all duration-300 ${
              isCustomer ? `bg-${primaryColor}-600 text-white shadow-md` : 'text-gray-400 hover:text-white'
            }`}
          >
            Customer
          </button>
          <button
            onClick={() => setRole('seller')}
            className={`w-1/2 py-2 px-4 font-semibold rounded-lg focus:outline-none transition-all duration-300 ${
              !isCustomer ? `bg-${primaryColor}-600 text-white shadow-md` : 'text-gray-400 hover:text-white'
            }`}
          >
            Seller
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-lg focus:outline-none focus:ring-2"
              required
              style={{'--tw-ring-color': `var(--color-${primaryColor}-500)`}}
            />
          </div>
          <div className="relative">
            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-lg focus:outline-none focus:ring-2"
              required
              style={{'--tw-ring-color': `var(--color-${primaryColor}-500)`}}
            />
          </div>
          <button
            type="submit"
            className={`w-full bg-${primaryColor}-600 hover:bg-${primaryColor}-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 shadow-lg`}
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-300 mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className={`text-${primaryColor}-400 hover:text-${primaryColor}-300 font-medium`}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}