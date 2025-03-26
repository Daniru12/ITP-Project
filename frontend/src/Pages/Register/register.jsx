import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import mediaUpload from "../../../utils/mediaUpload";
import { FiUser, FiMail, FiLock, FiPhone, FiUpload, FiUserPlus } from 'react-icons/fi';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        full_name: "",
        email: "",
        phone_number: "",
        user_type: "pet_owner"
    });
    const [profileImageFile, setProfileImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "phone_number") {
            // Only allow numbers and limit to 10 digits
            const numericValue = value.replace(/[^\d]/g, '').slice(0, 10);
            setFormData(prev => ({ ...prev, [name]: numericValue }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // Handle image selection
    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (validateImage(file)) {
                setProfileImageFile(file);
                // Create preview URL
                const previewUrl = URL.createObjectURL(file);
                setImagePreview(previewUrl);
            }
            e.target.value = ''; // Clear input
        }
    };

    // Validation functions
    const validateEmail = (email) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            toast.error("Email is required!");
            return false;
        }
        if (!emailPattern.test(email)) {
            toast.error("Please enter a valid email address!");
            return false;
        }
        return true;
    };

    const validatePassword = (password) => {
        if (!password) {
            toast.error("Password is required!");
            return false;
        }
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters long!");
            return false;
        }
        if (!/\d/.test(password)) {
            toast.error("Password must contain at least one number!");
            return false;
        }
        return true;
    };

    const validatePhoneNumber = (phone) => {
        const cleanPhone = phone.replace(/[^\d]/g, '');
        if (!phone) {
            toast.error("Phone number is required!");
            return false;
        }
        if (cleanPhone.length !== 10) {
            toast.error("Phone number must be exactly 10 digits!");
            return false;
        }
        return true;
    };

    const validateImage = (file) => {
        if (!file) return true;
        
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            toast.error("Please upload only JPG, PNG, or GIF images!");
            return false;
        }
        
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            toast.error("Image size must be less than 5MB!");
            return false;
        }
        
        return true;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate all fields
        if (!validateEmail(formData.email) || 
            !validatePassword(formData.password) || 
            !validatePhoneNumber(formData.phone_number) || 
            !validateImage(profileImageFile)) {
            return;
        }

        setIsLoading(true);

        try {
            let profile_picture = "";
            
            if (profileImageFile) {
                try {
                    profile_picture = await mediaUpload(profileImageFile);
                } catch (error) {
                    console.error("Error uploading profile image:", error);
                    toast.error("Error uploading profile image");
                    setIsLoading(false);
                    return;
                }
            }
            
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            await axios.post(`${backendUrl}/api/users/`, {
                ...formData,
                profile_picture
            });

            toast.success("Registration successful! Please login.");
            navigate("/login");
        } catch (error) {
            console.error("Registration error:", error);
            toast.error(error.response?.data?.message || "Registration failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
                {/* Header */}
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                        Create Account
                    </h2>
                    <p className="text-sm text-gray-600">
                        Join our pet care community
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        {/* Username */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Username</label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiUser className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="username"
                                    required
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Choose a username"
                                />
                            </div>
                        </div>

                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiUser className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="full_name"
                                    required
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Enter your full name"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiMail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiLock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Create a password (min. 6 characters)"
                                />
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                Must be at least 6 characters and contain a number
                            </p>
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiPhone className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="tel"
                                    name="phone_number"
                                    required
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                    className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Enter your phone number"
                                />
                            </div>
                        </div>

                        {/* User Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Account Type</label>
                            <select
                                name="user_type"
                                value={formData.user_type}
                                onChange={handleChange}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                            >
                                <option value="pet_owner">Pet Owner</option>
                                <option value="service_provider">Service Provider</option>
                            </select>
                        </div>

                        {/* Profile Picture */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Profile Picture (Optional)
                            </label>
                            <div className="mt-1 flex items-center space-x-4">
                                {imagePreview && (
                                    <div className="flex-shrink-0 h-12 w-12">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="h-12 w-12 rounded-full object-cover"
                                        />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageSelect}
                                            className="sr-only"
                                            id="profile-image"
                                        />
                                        <label
                                            htmlFor="profile-image"
                                            className="cursor-pointer flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                                        >
                                            <FiUpload className="h-5 w-5 mr-2" />
                                            Upload Photo
                                        </label>
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500">
                                        JPG, PNG or GIF (max. 5MB)
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
                        >
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                <FiUserPlus className="h-5 w-5 text-blue-500 group-hover:text-blue-400" />
                            </span>
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </div>

                    {/* Login Link */}
                    <div className="text-center text-sm">
                        <span className="text-gray-600">Already have an account? </span>
                        <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                            Sign in here
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
