import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from "react-hot-toast";
import axios from 'axios';
import SplashCursor from '../../UI/SplashCursor'

export default function LoginPage() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate()

    function handleSubmit(e) {
        e.preventDefault()
        console.log(email , password)

        const backendUrl = import.meta.env.VITE_BACKEND_URL

        axios.post(`${backendUrl}/api/users/login`, {
            email,
            password
        })
        .then(response => {
            console.log(response)
            toast.success("Login successful")
            const user = response.data.user
            localStorage.setItem("token", response.data.token)

            if(user.user_type === "admin"){
                navigate("/admin")
            }else{
                navigate("/")
            }
        })
        .catch(error => {
            console.log(error)
            toast.error("Login failed")
        })
    }



  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* <SplashCursor /> */}
      <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Login
        </button>
      </form>
    </div>
  )
}

