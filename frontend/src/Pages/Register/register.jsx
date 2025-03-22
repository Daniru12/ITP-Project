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

    const handleSubmit = async (e) => {
        e.preventDefault();
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
                    placeholder="Password"
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
                    type="text"
                    name="phone_number"
                    placeholder="Phone Number"
                    value={phone_number}
                    onChange={(e) => setPhone_number(e.target.value)}
                    required
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
                        Profile Picture
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setProfileImageFile(e.target.files[0])}
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
