import React from 'react';

const ProductCard = ({ product }) => {
  return (
    <div className="card p-4 rounded-xl shadow-md">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover rounded-t-xl"
      />
      <div className="card-body p-2">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-gray-600">${product.price}</p>
        <button className="bg-blue-500 text-white px-4 py-2 mt-2 rounded-lg hover:bg-blue-700">
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductCard;