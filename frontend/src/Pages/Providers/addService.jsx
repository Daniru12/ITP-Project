import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

/**
 * AddService Component
 * This component creates a form to add different types of services:
 * - Grooming Services
 * - Boarding Services
 * - Training Services
 */
const AddService = () => {
  // Hook for navigation
  const navigate = useNavigate();

  // List of service types
  const serviceTypes = [
    {
      id: "grooming",
      name: "Grooming Service",
      path: "/add-grooming",
      description:
        "Add pet grooming services like bathing, haircuts, and nail trimming",
      image: "/images/grooming.jpg", // You'll need to add these images to your public folder
    },
    {
      id: "boarding",
      name: "Boarding Service",
      path: "/add-boarding",
      description: "Add pet boarding and daycare services",
      image: "/images/boarding.jpg",
    },
    {
      id: "training",
      name: "Training Service",
      path: "/add-training",
      description: "Add pet training and behavior modification services",
      image: "/images/training.jpg",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Add New Service</h1>
          <p className="text-gray-600 mt-2">
            Choose the type of service you want to add
          </p>
        </div>
        <Link
          to="/provider-profile"
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          Back to Profile
        </Link>
      </div>

      {/* Service Type Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {serviceTypes.map((service) => (
          <Link key={service.id} to={service.path} className="block group">
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1">
              {/* Image Container */}
              <div className="relative h-48 bg-gray-200">
                {/* You can replace this div with an actual image once you have them */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full border-2 border-gray-300 flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {service.name}
                </h3>
                <p className="text-gray-600">{service.description}</p>

                {/* Add Service Button */}
                <div className="mt-4">
                  <span className="inline-flex items-center text-blue-500 group-hover:text-blue-600">
                    Add {service.name}
                    <svg
                      className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Help Text */}
      <div className="mt-8 bg-blue-50 rounded-lg p-4">
        <h4 className="text-blue-800 font-medium mb-2">Need Help?</h4>
        <p className="text-blue-600">
          Click on any service type above to start adding your services. Each
          service type has its own specific form with relevant fields and
          options.
        </p>
      </div>
    </div>
  );
};

export default AddService;
