import React from 'react' // fillter to do
import { SlidersIcon } from 'lucide-react'

export const FilterBar = ({ activeCategory, onCategoryChange }) => {
  const categories = [
    {
      id: 'all',
      name: 'All Products',
    },
    {
      id: 'food',
      name: 'Food & Treats',
    },
    {
      id: 'toys',
      name: 'Toys',
    },
    {
      id: 'beds',
      name: 'Beds & Furniture',
    },
    {
      id: 'grooming',
      name: 'Grooming',
    },
    {
      id: 'health',
      name: 'Health & Wellness',
    },
  ]

  return (
    <div className="mb-8">
      <div className="flex flex-wrap items-center justify-between mb-4">
        <div className="flex overflow-x-auto pb-2 space-x-2 md:space-x-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${activeCategory === category.id ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            >
              {category.name}
            </button>
          ))}
        </div>
        <button className="flex items-center px-3 py-2 bg-white rounded-lg border border-gray-300 text-sm font-medium text-gray-700 mt-2 md:mt-0">
          <SlidersIcon className="w-4 h-4 mr-2" />
          Filter
        </button>
      </div>
    </div>
  )
}