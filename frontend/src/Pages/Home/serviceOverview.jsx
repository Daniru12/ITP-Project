import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, Link } from 'react-router-dom'
import '../../App.css'

const ServiceOverview = () => {
    const { id } = useParams() // Get service ID from URL
    const [service, setService] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const token = localStorage.getItem('token')

    useEffect(() => {
        // Fetch service details using the ID
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/service/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            setService(res.data.service)
            setIsLoading(false)
        })
        .catch(err => {
            setError(err.message)
            setIsLoading(false)
        })
    }, [id])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div aria-label="Orange and tan hamster running in a metal wheel" role="img" className="wheel-and-hamster">
                    <div className="wheel"></div>
                    <div className="hamster">
                        <div className="hamster__body">
                            <div className="hamster__head">
                                <div className="hamster__ear"></div>
                                <div className="hamster__eye"></div>
                                <div className="hamster__nose"></div>
                            </div>
                            <div className="hamster__limb hamster__limb--fr"></div>
                            <div className="hamster__limb hamster__limb--fl"></div>
                            <div className="hamster__limb hamster__limb--br"></div>
                            <div className="hamster__limb hamster__limb--bl"></div>
                            <div className="hamster__tail"></div>
                        </div>
                    </div>
                    <div className="spoke"></div>
                </div>
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

    if (!service) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl text-gray-600">Service not found</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            {/* Back Button */}
            <div className="max-w-4xl mx-auto mb-6">
                <Link
                    to="/display-services"
                    className="text-blue-600 hover:text-blue-800 flex items-center"
                >
                    ← Back to Services
                </Link>
            </div>

            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                {/* Service Images Gallery */}
                <div className="relative">
                    {/* Main Image */}
                    <div className="h-64 overflow-hidden">
                        <img
                            src={service.image?.[0] || "https://via.placeholder.com/800x400?text=Pet+Service"}
                            alt={service.service_name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    
                    {/* Thumbnail Gallery */}
                    {service.image && service.image.length > 1 && (
                        <div className="flex gap-2 p-2 bg-gray-100 overflow-x-auto">
                            {service.image.map((img, index) => (
                                <img
                                    key={index}
                                    src={img}
                                    alt={`${service.service_name} ${index + 1}`}
                                    className="h-20 w-20 object-cover rounded cursor-pointer"
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Service Content */}
                <div className="p-8">
                    {/* Service Header */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {service.service_name}
                        </h1>
                        <p className="text-lg text-gray-600">
                            {service.description}
                        </p>
                    </div>

                    {/* Provider Information */}
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                        <h2 className="text-xl font-semibold mb-2">Service Provider</h2>
                        <p className="text-gray-700">Name: {service.provider_id?.full_name || 'Anonymous'}</p>
                        <p className="text-gray-700">Location: {service.location}</p>
                    </div>

                    {/* Package Details */}
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-4">Available Packages</h2>
                        <div className="grid gap-4 md:grid-cols-3">
                            {service.packages && Object.entries(service.packages).map(([tier, package_]) => (
                                <div 
                                    key={tier}
                                    className="border rounded-lg p-4 bg-white shadow-sm"
                                >
                                    <h3 className="text-lg font-semibold capitalize mb-2">{tier}</h3>
                                    <p className="text-2xl font-bold text-blue-600 mb-2">
                                        Rs. {package_?.price || 'N/A'}
                                    </p>
                                    <p className="text-gray-600 mb-2">
                                        Duration: {package_?.duration} minutes
                                    </p>
                                    <div className="mt-2">
                                        <p className="font-medium mb-1">Includes:</p>
                                        <ul className="list-disc list-inside text-gray-600">
                                            {package_?.includes?.map((item, index) => (
                                                <li key={index}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Book Now Button */}
                    <div className="text-center">
                        <Link
                             to={`/Appointmentadd/${service._id}`}
                            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition duration-300"
                        >
                            Book Now
                        </Link>
                    </div>
                    
                    {/* Review Button */}
                    <div className="text-center mt-4">
                        <Link
                            to={`/reviews/${service._id}`}
                            className="inline-block bg-green-600 text-white px-8 py-3 rounded-md hover:bg-green-700 transition duration-300"
                        >
                            Add Review
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ServiceOverview
