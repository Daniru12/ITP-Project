import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import mediaUpload from "../../../utils/mediaUpload";

export default function RegisterPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [full_name, setFull_name] = useState("");
    const [email, setEmail] = useState("");
    const [phone_number, setPhone_number] = useState("");
    const [user_type, setUser_type] = useState("pet_owner");
    const [profileImageFile, setProfileImageFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Beginner-friendly validation functions
    const validateEmail = (email) => {
        // Basic email pattern: something@something.something
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
        // Check if password has at least one number
        if (!/\d/.test(password)) {
            toast.error("Password must contain at least one number!");
            return false;
        }
        return true;
    };

    const validatePhoneNumber = (phone) => {
        // Remove any spaces or special characters
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
        if (!file) {
            // Image is optional, so return true if no file
            return true;
        }
        
        // Check file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            toast.error("Please upload only JPG, PNG, or GIF images!");
            return false;
        }
        
        // Check file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
            toast.error("Image size must be less than 5MB!");
            return false;
        }
        
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate all fields before proceeding
        if (!validateEmail(email) || 
            !validatePassword(password) || 
            !validatePhoneNumber(phone_number) || 
            !validateImage(profileImageFile)) {
            return;
        }

        setIsLoading(true);

        try {
            let profile_picture = "";
            
            // Upload profile image if selected
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
            
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/`, {
                username,
                password,
                full_name,
                email,
                phone_number,
                user_type,
                profile_picture
            });

            toast.success("Register successful");
            navigate("/login");
        } catch (error) {
            console.error("Registration error:", error);
            toast.error(error.response?.data?.message || "Registration failed");
        } finally {
            setIsLoading(false);
        }
    };

    // Function to handle phone number input formatting
    const handlePhoneInput = (e) => {
        // Only allow numbers
        const value = e.target.value.replace(/[^\d]/g, '');
        // Limit to 10 digits
        const limitedValue = value.slice(0, 10);
        setPhone_number(limitedValue);
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Register</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full p-2 border rounded"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password (min 6 characters, include numbers)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full p-2 border rounded"
                />
                <input
                    type="text"
                    name="full_name"
                    placeholder="Full Name"
                    value={full_name}
                    onChange={(e) => setFull_name(e.target.value)}
                    required
                    className="w-full p-2 border rounded"
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full p-2 border rounded"
                />
                <input
                    type="tel"
                    name="phone_number"
                    placeholder="Phone Number (10 digits)"
                    value={phone_number}
                    onChange={handlePhoneInput}
                    required
                    maxLength="10"
                    className="w-full p-2 border rounded"
                />
                <select
                    name="user_type"
                    value={user_type}
                    onChange={(e) => setUser_type(e.target.value)}
                    required
                    className="w-full p-2 border rounded"
                >
                    <option value="pet_owner">Pet Owner</option>
                    <option value="service_provider">Service Provider</option>
                </select>
                <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Profile Picture (Optional, JPG/PNG/GIF, max 5MB)
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (validateImage(file)) {
                                setProfileImageFile(file);
                            } else {
                                e.target.value = ''; // Clear the input
                            }
                        }}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 ${
                        isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    {isLoading ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>
    );
}
