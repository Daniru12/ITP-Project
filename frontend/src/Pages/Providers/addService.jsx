import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

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
      image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
    },
    {
      id: "boarding",
      name: "Boarding Service",
      path: "/add-boarding", 
      description: "Add pet boarding and daycare services",
      image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80",
    },
    {
      id: "training",
      name: "Training Service",
      path: "/add-training",
      description: "Add pet training and behavior modification services", 
      image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
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
                <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
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
