import React, { memo } from 'react'
import { ProductCard } from './ProductCard'  //grid done

export const ProductGrid = ({ searchQuery, activeCategory }) => {
  // Mock product data
  const products = [
    {
      id: 1,
      name: 'Premium Dog Food',
      price: 29.99,
      image:
        'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description:
        'High-quality nutrition for your adult dog with real chicken as the first ingredient.',
      rating: 4.8,
      category: 'food',
    },
    {
      id: 2,
      name: 'Interactive Cat Toy',
      price: 14.99,
      image:
        'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description:
        "Engaging toy that stimulates your cat's hunting instincts and provides hours of entertainment.",
      rating: 4.5,
      category: 'toys',
    },
    {
      id: 3,
      name: 'Orthopedic Pet Bed',
      price: 49.99,
      image:
        'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description:
        'Comfortable memory foam bed that provides joint support for older pets.',
      rating: 4.9,
      category: 'beds',
    },
    {
      id: 4,
      name: 'Pet Grooming Kit',
      price: 34.99,
      image:
        'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description:
        'Complete grooming set including clippers, brushes, and nail trimmers.',
      rating: 4.3,
      category: 'grooming',
    },
    {
      id: 5,
      name: 'Dog Dental Chews',
      price: 12.99,
      image:
        'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description:
        "Tasty treats that help clean your dog's teeth and freshen breath.",
      rating: 4.6,
      category: 'health',
    },
    {
      id: 6,
      name: 'Cat Climbing Tree',
      price: 79.99,
      image:
        'https://images.unsplash.com/photo-1574158622682-e40e69881006?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description:
        'Multi-level cat tree with scratching posts, platforms and cozy hideaways.',
      rating: 4.7,
      category: 'beds',
    },
    {
      id: 7,
      name: 'Dog Training Treats',
      price: 8.99,
      image:
        'https://images.unsplash.com/photo-1600369671236-e74521d4b6ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description:
        'Small, soft treats perfect for training sessions with your pup.',
      rating: 4.5,
      category: 'food',
    },
    {
      id: 8,
      name: 'Pet Carrier Backpack',
      price: 45.99,
      image:
        'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description:
        'Comfortable and ventilated backpack for carrying small pets on adventures.',
      rating: 4.4,
      category: 'health',
    },
  ]

  // Filter products based on search query and active category
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      activeCategory === 'all' || product.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {filteredProducts.length > 0 ? (
        filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))
      ) : (
        <div className="col-span-full text-center py-12">
          <p className="text-gray-500">
            No products found. Try a different search or category.
          </p>
        </div>
      )}
    </div>
  )
}
