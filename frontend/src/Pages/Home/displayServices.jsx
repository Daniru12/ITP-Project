import React from 'react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const DisplayServices = () => {
    const [services, setServices] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const token = localStorage.getItem('token')

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/services-for-display`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            setServices(res.data.services)
            setIsLoading(false)
        })
        .catch(err => {
            setError(err.message)
            setIsLoading(false)
        })
    }, [])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl text-gray-600">Loading services...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl text-red-600">Error: {error}</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            {/* Header Section */}
            <div className="max-w-7xl mx-auto text-center mb-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Available Services</h1>
                <p className="text-lg text-gray-600">Choose from our wide range of pet care services</p>
            </div>

            {/* Services Grid */}
            <div className="max-w-7xl mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {services.map((service) => (
                    <div key={service._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        {/* Service Image */}
                        <div className="h-48 overflow-hidden">
                            <img
                                src={service.image || "https://via.placeholder.com/400x300?text=Pet+Service"}
                                alt={service.service_name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Service Details */}
                        <div className="p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-2">
                                {service.service_name}
                            </h2>
                            <p className="text-gray-600 mb-4">{service.description}</p>
                            
                            {/* Provider Info */}
                            <div className="mb-4 text-sm text-gray-500">
                                <p>Provider: {service.provider_id?.full_name || 'Anonymous'}</p>
                                <p>Location: {service.location}</p>
                            </div>

                            {/* Packages */}
                            <div className="space-y-3">
                                <h3 className="font-semibold text-gray-900">Available Packages:</h3>
                                {service.packages && Object.entries(service.packages || {}).map(([tier, package_]) => (
                                    <div key={tier} className="flex justify-between items-center text-sm">
                                        <span className="capitalize">{tier}</span>
                                        <span className="font-semibold">Rs. {package_?.price || 'N/A'}</span>
                                    </div>
                                ))}
                            </div>

                            {/* View Details Button */}
                            <Link
                                to={`/service-overview/${service._id}`}
                                className="mt-6 block text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
                            >
                                View Details
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {/* No Services Message */}
            {services.length === 0 && (
                <div className="text-center text-gray-600 mt-8">
                    No services available at the moment.
                </div>
            )}
        </div>
    )
}

export default DisplayServices
