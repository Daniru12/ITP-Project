import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const UpdateProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [stock, setStock] = useState('');
    const [images, setImages] = useState([]);
    const [currentImages, setCurrentImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const token = localStorage.getItem('token');
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                // Fetch product data from the backend
                const response = await axios.get(`${backendUrl}/api/products/getProduct/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // Log the response to check the data structure
                console.log("Fetched Product Data:", response.data);
                // Check if the product data exists
                const product = response.data; // Directly use response.data instead of response.data.product
                setName(product.name || '');
                setCategory(product.category || '');
                setPrice(product.price?.toString() || '');
                setDescription(product.description || '');
                setStock(product.quantity?.toString() || '');
                setCurrentImages(product.images || []);
            } catch (error) {
                console.error("Error fetching product data:", error);
                toast.error("Failed to load product data");
                navigate("/deleteProducts");
            }
        };
        fetchProductData();
    }, [id, navigate]);

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            const backendUrl = import.meta.env.VITE_BACKEND_URL;

            const updatedProductData = {
                name,
                category,
                price,
                description,
                stock,
                images
            };

            // Update product request to backend
            await axios.put(`${backendUrl}/api/products/update/${id}`, updatedProductData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success('Product updated successfully');
            navigate('/deleteProducts');
        } catch (error) {
            console.error("Error updating product:", error);
            toast.error('Failed to update product');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold mb-4">Update Product</h1>
            <form onSubmit={handleUpdateProduct} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Product Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 border rounded-lg"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full p-2 border rounded-lg"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Price</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full p-2 border rounded-lg"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-2 border rounded-lg"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Stock</label>
                    <input
                        type="number"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        className="w-full p-2 border rounded-lg"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Images</label>
                    <input
                        type="file"
                        onChange={(e) => setImages(e.target.files)}
                        className="w-full p-2 border rounded-lg"
                        multiple
                    />
                    {/* Display current images */}
                    <div className="mt-4">
                        <h3 className="text-sm font-medium text-gray-700">Current Images:</h3>
                        <div className="flex space-x-4">
                            {currentImages.map((img, index) => (
                                <img key={index} src={img.url} alt={`Product Image ${index + 1}`} className="w-16 h-16 object-cover rounded-lg" />
                            ))}
                        </div>
                    </div>
                </div>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                    disabled={isLoading}
                >
                    {isLoading ? 'Updating...' : 'Update Product'}
                </button>
            </form>
        </div>
    );
};

export default UpdateProduct;
