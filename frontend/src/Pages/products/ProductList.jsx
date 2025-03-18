import React from 'react';
import ProductCard from './ProductCard'; 

const products = [
  { id: 1, name: 'Premium Dog Food', price: 29.99, image: 'https://images.unsplash.com/photo-1583336661501-52eb0b0257bf?auto=format&fit=crop&w=500&h=500&q=80' },
  { id: 2, name: 'Interactive Cat Toy', price: 14.99, image: 'https://images.unsplash.com/photo-1607938893891-e29da1903b37?auto=format&fit=crop&w=500&h=500&q=80' },
  { id: 3, name: 'Orthopedic Pet Bed', price: 49.99, image: 'https://images.unsplash.com/photo-1622235061659-8c6df2721d63?auto=format&fit=crop&w=500&h=500&q=80' },
  { id: 4, name: 'Pet Grooming Kit', price: 34.99, image: 'https://images.unsplash.com/photo-1605737636228-6b3f2e6c7695?auto=format&fit=crop&w=500&h=500&q=80' },
  { id: 5, name: 'Cat Climbing Tree', price: 79.99, image: 'https://images.unsplash.com/photo-1583267749644-d41d9f1454aa?auto=format&fit=crop&w=500&h=500&q=80' },
  { id: 6, name: 'Dog Training Treats', price: 8.99, image: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&fit=crop&w=500&h=500&q=80' },
];

const ProductList = () => {
  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Our Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList