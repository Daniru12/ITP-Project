import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function RegisterPage() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [full_name, setFull_name] = useState("");
    const [email, setEmail] = useState("");
    const [phone_number, setPhone_number] = useState("");
    const [user_type, setUser_type] = useState("pet_owner");
    const [profile_picture, setProfile_picture] = useState("");
    const navigate = useNavigate();


  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(username, password, full_name, email, phone_number, user_type, profile_picture);
    
    axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/`, {
        username,
        password,
        full_name,
        email,
        phone_number,
        user_type,
        profile_picture
    }).then(()=>{
        toast.success("Register successful");
        navigate("/login");
    }).catch((error)=>{
        toast.error("Register failed");
    })
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
        <input
          type="url"
          name="profile_picture"
          placeholder="Profile Picture URL (Optional)"
          value={profile_picture}
          onChange={(e) => setProfile_picture(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Register
        </button>
      </form>
    </div>
  );
};
