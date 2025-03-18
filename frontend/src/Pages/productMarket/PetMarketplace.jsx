import React, { useState } from 'react'
import { SearchAndCart } from '../../Components/SearchAndCart'
import { ProductGrid } from '../../Components/ProductGrid'
import { FilterBar } from '../../Components/FilterBar'
import { PawPrintIcon } from 'lucide-react'

const PetMarketplace = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  const handleCategoryChange = (category) => {
    setActiveCategory(category)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-6">
        <section className="mb-6 text-center relative">
          <div className="inline-flex items-center justify-center gap-2 mb-3">
            <PawPrintIcon className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Pet Products</h1>
          </div>
          <div className="max-w-2xl mx-auto">
            <p className="text-gray-600 text-lg">
              Find the best products for your furry friends
            </p>
            <div className="absolute left-1/2 -translate-x-1/2 h-1 w-24 bg-blue-600 rounded-full mt-4" />
          </div>
        </section>
        <SearchAndCart onSearch={handleSearch} />
        <FilterBar
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />
        <ProductGrid searchQuery={searchQuery} activeCategory={activeCategory} />
      </main> 
    </div>
  )
}
export default PetMarketplace
