import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const AddGrooming = () => {
  const navigate = useNavigate(); // Hook to navigate between pages

  // Initial state for the form
  const [formData, setFormData] = useState({
    service_name: "",
    description: "",
    packages: {
      basic: { price: "", duration: "", includes: [""] },
      premium: { price: "", duration: "", includes: [""] },
      luxury: { price: "", duration: "", includes: [""] },
    },
  });

  // Function to handle text input changes for service name and description
  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  // Function to handle price and duration updates for packages
  const handlePackageInputChange = (packageType, field, value) => {
    const updatedPackages = { ...formData.packages };
    updatedPackages[packageType][field] = value;
    setFormData({ ...formData, packages: updatedPackages });
  };

  // Function to handle included services input changes
  const handleServiceChange = (packageType, index, value) => {
    const updatedIncludes = [...formData.packages[packageType].includes];
    updatedIncludes[index] = value;
    setFormData({
      ...formData,
      packages: {
        ...formData.packages,
        [packageType]: {
          ...formData.packages[packageType],
          includes: updatedIncludes,
        },
      },
    });
  };

  // Function to add a new included service field
  const addServiceField = (packageType) => {
    const updatedIncludes = [...formData.packages[packageType].includes, ""];
    setFormData({
      ...formData,
      packages: {
        ...formData.packages,
        [packageType]: {
          ...formData.packages[packageType],
          includes: updatedIncludes,
        },
      },
    });
  };

  // Function to remove a service field
  const removeServiceField = (packageType, index) => {
    const updatedIncludes = formData.packages[packageType].includes.filter(
      (_, i) => i !== index
    );
    setFormData({
      ...formData,
      packages: {
        ...formData.packages,
        [packageType]: {
          ...formData.packages[packageType],
          includes: updatedIncludes,
        },
      },
    });
  };

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      await axios.post(`${backendUrl}/api/grooming/service`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Service added successfully!");
      navigate("/provider-profile"); // Redirect to provider profile
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add service");
    }
  };

  const packageTypes = ["basic", "premium", "luxury"];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Add New Grooming Service</h1>
        <Link
          to="/add-service"
          className="bg-gray-500 text-white px-4 py-2 rounded-md"
        >
          Cancel
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Service Information</h2>
          <input
            type="text"
            name="service_name"
            placeholder="Service Name"
            value={formData.service_name}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md mb-4"
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
            rows="3"
            required
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packageTypes.map((type) => (
            <div key={type} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 capitalize">
                {type} Package
              </h3>
              <input
                type="number"
                placeholder="Price (Rs.)"
                value={formData.packages[type].price}
                onChange={(e) =>
                  handlePackageInputChange(type, "price", e.target.value)
                }
                className="w-full p-2 border rounded-md mb-4"
                required
              />
              <input
                type="number"
                placeholder="Duration (minutes)"
                value={formData.packages[type].duration}
                onChange={(e) =>
                  handlePackageInputChange(type, "duration", e.target.value)
                }
                className="w-full p-2 border rounded-md mb-4"
                required
              />
              {formData.packages[type].includes.map((service, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Service included"
                    value={service}
                    onChange={(e) =>
                      handleServiceChange(type, index, e.target.value)
                    }
                    className="flex-1 p-2 border rounded-md"
                    required
                  />
                  {formData.packages[type].includes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeServiceField(type, index)}
                      className="text-red-500"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addServiceField(type)}
                className="text-blue-500"
              >
                + Add Service
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-md"
          >
            Create Service
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddGrooming;
