import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  StarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowLeftIcon,
  ShoppingCartIcon,
  HeartIcon,
} from 'lucide-react'

export const ProductDetail = () => {
  const { id } = useParams()
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedTab, setSelectedTab] = useState('description')

  // Mock product data - in a real app, fetch this based on the ID
  const product = {
    id: 1,
    name: 'Premium Dog Food',
    price: 29.99,
    images: [
      'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1602584386319-fa8eb4361c2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ],
    description: `High-quality nutrition for your adult dog with real chicken as the first ingredient.
    Key Benefits:
    • Made with real chicken as the first ingredient
    • Contains essential vitamins and minerals
    • Supports healthy digestion
    • Promotes strong muscles
    • Suitable for all adult dog breeds
    Ingredients:
    Chicken, Chicken Meal, Brown Rice, Barley, Oatmeal, Chicken Fat, Natural Flavor, Dried Beet Pulp...`,
    rating: 4.8,
    category: 'food',
    specifications: [
      {
        name: 'Weight',
        value: '15 kg',
      },
      {
        name: 'Age Range',
        value: 'Adult',
      },
      {
        name: 'Type',
        value: 'Dry Food',
      },
      {
        name: 'Main Ingredient',
        value: 'Chicken',
      },
      {
        name: 'Special Diet',
        value: 'All Natural',
      },
    ],
    reviews: [
      {
        id: 1,
        user: 'John D.',
        rating: 5,
        date: '2023-10-15',
        comment: 'My dog loves this food! His coat has never looked better.',
        avatar:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32&q=80',
      },
      {
        id: 2,
        user: 'Sarah M.',
        rating: 4,
        date: '2023-10-10',
        comment:
          'Good quality food, but a bit pricey. Still worth it for the quality.',
        avatar:
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32&q=80',
      },
      {
        id: 3,
        user: 'Mike R.',
        rating: 5,
        date: '2023-10-05',
        comment: 'Excellent product! My picky eater actually enjoys this food.',
        avatar:
          'https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32&q=80',
      },
    ],
  }

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length)
  }

  const prevImage = () => {
    setSelectedImage(
      (prev) => (prev - 1 + product.images.length) % product.images.length,
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-6">
        <Link
          to="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to Products
        </Link>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-xl shadow-sm">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-md"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-md"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="flex space-x-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative aspect-square w-20 rounded-lg overflow-hidden ${
                    selectedImage === idx
                      ? 'ring-2 ring-blue-500'
                      : 'hover:opacity-75'
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`w-5 h-5 ${
                        i < product.rating
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                      fill={i < product.rating ? 'currentColor' : 'none'}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  ({product.rating} rating)
                </span>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              ${product.price}
            </div>
            <div className="space-y-4">
              <button className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2">
                <ShoppingCartIcon className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>
              <button className="w-full py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center space-x-2">
                <HeartIcon className="w-5 h-5" />
                <span>Add to Wishlist</span>
              </button>
            </div>
          </div>
        </div>
        {/* Tabs */}
        <div className="mt-8 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8">
              <button
                onClick={() => setSelectedTab('description')}
                className={`px-4 py-3 text-sm font-medium border-b-2 ${
                  selectedTab === 'description'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setSelectedTab('specifications')}
                className={`px-4 py-3 text-sm font-medium border-b-2 ${
                  selectedTab === 'specifications'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Specifications
              </button>
              <button
                onClick={() => setSelectedTab('reviews')}
                className={`px-4 py-3 text-sm font-medium border-b-2 ${
                  selectedTab === 'reviews'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Reviews
              </button>
            </div>
          </div>
          <div className="p-6">
            {selectedTab === 'description' && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Product Description
                </h2>
                <p className="text-gray-700 whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}
            {selectedTab === 'specifications' && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Specifications
                </h2>
                <ul className="divide-y divide-gray-200">
                  {product.specifications.map((spec, idx) => (
                    <li
                      key={idx}
                      className="py-3 flex justify-between text-gray-700"
                    >
                      <span>{spec.name}</span>
                      <span>{spec.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {selectedTab === 'reviews' && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Customer Reviews
                </h2>
                <ul className="space-y-6">
                  {product.reviews.map((review) => (
                    <li key={review.id} className="flex space-x-4">
                      <img
                        src={review.avatar}
                        alt={review.user}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <div className="text-sm font-bold text-gray-900">
                            {review.user}
                          </div>
                          <div className="text-sm text-gray-600">
                            {review.date}
                          </div>
                        </div>
                        <div className="flex items-center mt-1">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? 'text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                              fill={i < review.rating ? 'currentColor' : 'none'}
                            />
                          ))}
                        </div>
                        <p className="mt-2 text-sm text-gray-700">
                          {review.comment}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
export default ProductDetail
