import React, { useState } from 'react'
import { ShoppingCartIcon, HeartIcon, StarIcon } from 'lucide-react'

export const ProductCard = ({ product }) => {
  const [isLiked, setIsLiked] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = () => {
    setIsAdding(true)
    // Simulate adding to cart
    setTimeout(() => setIsAdding(false), 1000)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="relative overflow-hidden group">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-3 right-3 p-1.5 bg-white rounded-full hover:bg-gray-100 transform transition-transform duration-300 hover:scale-110 active:scale-95"
        >
          <HeartIcon
            className={`w-5 h-5 transition-colors duration-300 ${isLiked ? 'text-red-500' : 'text-gray-400'}`}
            fill={isLiked ? 'currentColor' : 'none'}
          />
        </button>
      </div>
      <div className="p-4">
        <div className="flex items-center mb-1">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={`w-4 h-4 transition-colors duration-300 ${i < product.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                fill={i < product.rating ? 'currentColor' : 'none'}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-1">
            ({product.rating.toFixed(1)})
          </span>
        </div>
        <h3 className="font-medium text-gray-900 mb-1 group-hover:text-blue-600 transition-colors duration-300">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            className={`flex items-center justify-center p-2 rounded-full transition-all duration-300 transform
              ${isAdding ? 'bg-green-500 scale-110' : 'bg-blue-600 hover:bg-blue-700 hover:scale-110 active:scale-95'}`}
          >
            <ShoppingCartIcon
              className={`w-5 h-5 text-white transition-transform duration-300 ${isAdding ? 'scale-110' : ''}`}
            />
          </button>
        </div>
      </div>
    </div>
  )
}