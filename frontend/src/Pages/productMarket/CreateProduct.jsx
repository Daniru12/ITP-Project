import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateProduct = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState('all');
  const [promoCodeApplied, setPromoCodeApplied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields
    if (!name || !description || !price || !quantity) {
      toast.error('Please fill in all fields');
      setIsSubmitting(false);
      return;
    }

    // Get the token from localStorage
    const token = localStorage.getItem('token');

    // Create request body
    const data = {
      name,
      description,
      price,
      quantity,
      category,
      promo_code_applied: promoCodeApplied ? 'true' : 'false', // Convert boolean to string
    };

    // Get the backend URL
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

    try {
      // Send POST request to the backend
      await axios.post(`${backendUrl}/api/products/create`, data, {
        headers: {
          Authorization: `Bearer ${token}`, // Correctly formatted Authorization header
        },
      });

      // Show success message and redirect
      toast.success('Product created successfully!');
      navigate('/petMarketplace'); // Redirect to products page
    } catch (err) {
      console.error('Error creating product:', err);
      toast.error('Failed to create product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-900 mb-6">
          Create New Product
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Product Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
              rows="4"
              required
            />
          </div>

          {/* Price */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (USD)
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Quantity */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Category */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
              required
            >
              <option value="all">All</option>
              <option value="toys">Toys</option>
              <option value="food">Food</option>
              <option value="accessories">Accessories</option>
            </select>
          </div>

          {/* Promo Code */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Promo Code Applied
            </label>
            <input
              type="checkbox"
              checked={promoCodeApplied}
              onChange={(e) => setPromoCodeApplied(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full px-4 py-2 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 
              ${isSubmitting ? 'bg-green-500' : 'bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95'}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
