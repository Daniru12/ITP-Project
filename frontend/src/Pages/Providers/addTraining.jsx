import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import mediaUpload from "../../../utils/mediaUpload";

const AddTraining = () => {
  const navigate = useNavigate();
  
  // Add loading state and images state
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState([]);
  
  // Simplified initial state with clear naming
  const [serviceName, setServiceName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  
  // Create separate state for each package to make it easier to understand
  const [basicPackage, setBasicPackage] = useState({
    price: "",
    duration: "",
    includes: [""]
  });
  
  const [premiumPackage, setPremiumPackage] = useState({
    price: "",
    duration: "",
    includes: [""]
  });
  
  const [luxuryPackage, setLuxuryPackage] = useState({
    price: "",
    duration: "",
    includes: [""]
  });
  
  // Simplified handlers for each input type
  const handleServiceNameChange = (e) => {
    setServiceName(e.target.value);
  };
  
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  const handleImageUrlChange = (e) => {
    setImageUrl(e.target.value);
  };
  
  // Handle price change with more descriptive function name
  const handleBasicPriceChange = (e) => {
    setBasicPackage({...basicPackage, price: e.target.value});
  };
  
  const handlePremiumPriceChange = (e) => {
    setPremiumPackage({...premiumPackage, price: e.target.value});
  };
  
  const handleLuxuryPriceChange = (e) => {
    setLuxuryPackage({...luxuryPackage, price: e.target.value});
  };
  
  // Handle duration change
  const handleBasicDurationChange = (e) => {
    setBasicPackage({...basicPackage, duration: e.target.value});
  };
  
  const handlePremiumDurationChange = (e) => {
    setPremiumPackage({...premiumPackage, duration: e.target.value});
  };
  
  const handleLuxuryDurationChange = (e) => {
    setLuxuryPackage({...luxuryPackage, duration: e.target.value});
  };
  
  // Handle included services changes with more descriptive function names
  const handleBasicServiceChange = (index, value) => {
    const updatedServices = [...basicPackage.includes];
    updatedServices[index] = value;
    setBasicPackage({...basicPackage, includes: updatedServices});
  };
  
  const handlePremiumServiceChange = (index, value) => {
    const updatedServices = [...premiumPackage.includes];
    updatedServices[index] = value;
    setPremiumPackage({...premiumPackage, includes: updatedServices});
  };
  
  const handleLuxuryServiceChange = (index, value) => {
    const updatedServices = [...luxuryPackage.includes];
    updatedServices[index] = value;
    setLuxuryPackage({...luxuryPackage, includes: updatedServices});
  };
  
  // Add service field functions
  const addBasicServiceField = () => {
    setBasicPackage({
      ...basicPackage,
      includes: [...basicPackage.includes, ""]
    });
  };
  
  const addPremiumServiceField = () => {
    setPremiumPackage({
      ...premiumPackage,
      includes: [...premiumPackage.includes, ""]
    });
  };
  
  const addLuxuryServiceField = () => {
    setLuxuryPackage({
      ...luxuryPackage,
      includes: [...luxuryPackage.includes, ""]
    });
  };
  
  // Remove service field functions
  const removeBasicServiceField = (index) => {
    const updatedServices = basicPackage.includes.filter((_, i) => i !== index);
    setBasicPackage({...basicPackage, includes: updatedServices});
  };
  
  const removePremiumServiceField = (index) => {
    const updatedServices = premiumPackage.includes.filter((_, i) => i !== index);
    setPremiumPackage({...premiumPackage, includes: updatedServices});
  };
  
  const removeLuxuryServiceField = (index) => {
    const updatedServices = luxuryPackage.includes.filter((_, i) => i !== index);
    setLuxuryPackage({...luxuryPackage, includes: updatedServices});
  };
  
  // Add image change handler
  const handleImagesChange = (e) => {
    const files = e.target.files;
    if (files.length > 5) {
      toast.error("Maximum 5 images allowed");
      e.target.value = null;
      return;
    }
    setImages(files);
  };
  
  // Update form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Validate minimum duration
    const packages = {
      basic: basicPackage,
      premium: premiumPackage,
      luxury: luxuryPackage
    };

    // Check minimum duration for each package
    for (const [tier, package_] of Object.entries(packages)) {
      if (Number(package_.duration) < 15) {
        toast.error(`${tier} package duration must be at least 15 minutes`);
        setIsLoading(false);
        return;
      }
      if (Number(package_.price) < 0) {
        toast.error(`${tier} package price cannot be negative`);
        setIsLoading(false);
        return;
      }
    }

    // Check if location is provided
    if (!location.trim()) {
      toast.error("Location is required");
      setIsLoading(false);
      return;
    }

    try {
      // Upload images to Supabase
      const imageUrls = [];
      for (let i = 0; i < images.length; i++) {
        try {
          const url = await mediaUpload(images[i]);
          imageUrls.push(url);
        } catch (error) {
          console.error("Error uploading image:", error);
          toast.error("Error uploading image");
          setIsLoading(false);
          return;
        }
      }
    
      // Reconstruct the data in the format expected by the API
      const formData = {
        service_name: serviceName,
        service_category: "pet_training",
        description: description,
        location: location,
        image: imageUrls, // Send array of image URLs
        packages: {
          basic: basicPackage,
          premium: premiumPackage,
          luxury: luxuryPackage
        }
      };
      
      const token = localStorage.getItem("token");
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      
      await axios.post(`${backendUrl}/api/grooming/service`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success("Service added successfully!");
      navigate("/provider-profile");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add service");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Add New Training Service</h1>
        <Link
          to="/add-service"
          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
        >
          Cancel
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Service Information Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Service Information</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Service Name"
              value={serviceName}
              onChange={handleServiceNameChange}
              className="w-full p-2 border rounded-md"
              required
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={handleDescriptionChange}
              className="w-full p-2 border rounded-md"
              rows="3"
              required
            ></textarea>
            <input
              type="text"
              placeholder="Location (e.g., 123 Pet Street, City)"
              value={location}
              onChange={handleLocationChange}
              className="w-full p-2 border rounded-md"
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Images (Maximum 5)
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImagesChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Packages Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Basic Package */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Basic Package</h3>
            <input
              type="number"
              placeholder="Price (Rs.)"
              value={basicPackage.price}
              onChange={handleBasicPriceChange}
              className="w-full p-2 border rounded-md mb-4"
              required
            />
            <input
              type="number"
              placeholder="Duration (minutes)"
              value={basicPackage.duration}
              onChange={handleBasicDurationChange}
              className="w-full p-2 border rounded-md mb-4"
              required
            />
            
            {/* Basic Package Services */}
            {basicPackage.includes.map((service, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Service included"
                  value={service}
                  onChange={(e) => handleBasicServiceChange(index, e.target.value)}
                  className="flex-1 p-2 border rounded-md"
                  required
                />
                {basicPackage.includes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeBasicServiceField(index)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addBasicServiceField}
              className="text-blue-500"
            >
              + Add Service
            </button>
          </div>
          
          {/* Premium Package */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Premium Package</h3>
            <input
              type="number"
              placeholder="Price (Rs.)"
              value={premiumPackage.price}
              onChange={handlePremiumPriceChange}
              className="w-full p-2 border rounded-md mb-4"
              required
            />
            <input
              type="number"
              placeholder="Duration (minutes)"
              value={premiumPackage.duration}
              onChange={handlePremiumDurationChange}
              className="w-full p-2 border rounded-md mb-4"
              required
            />
            
            {/* Premium Package Services */}
            {premiumPackage.includes.map((service, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Service included"
                  value={service}
                  onChange={(e) => handlePremiumServiceChange(index, e.target.value)}
                  className="flex-1 p-2 border rounded-md"
                  required
                />
                {premiumPackage.includes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePremiumServiceField(index)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addPremiumServiceField}
              className="text-blue-500"
            >
              + Add Service
            </button>
          </div>
          
          {/* Luxury Package */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Luxury Package</h3>
            <input
              type="number"
              placeholder="Price (Rs.)"
              value={luxuryPackage.price}
              onChange={handleLuxuryPriceChange}
              className="w-full p-2 border rounded-md mb-4"
              required
            />
            <input
              type="number"
              placeholder="Duration (minutes)"
              value={luxuryPackage.duration}
              onChange={handleLuxuryDurationChange}
              className="w-full p-2 border rounded-md mb-4"
              required
            />
            
            {/* Luxury Package Services */}
            {luxuryPackage.includes.map((service, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Service included"
                  value={service}
                  onChange={(e) => handleLuxuryServiceChange(index, e.target.value)}
                  className="flex-1 p-2 border rounded-md"
                  required
                />
                {luxuryPackage.includes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLuxuryServiceField(index)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addLuxuryServiceField}
              className="text-blue-500"
            >
              + Add Service
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className={`bg-blue-500 text-white px-6 py-2 rounded-md ${
              isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
            }`}
          >
            {isLoading ? 'Creating Service...' : 'Create Service'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTraining;