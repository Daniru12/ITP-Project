import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const NavBar = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token');
  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">
          PawGo
        </Link>
        
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-white hover:text-blue-200">
            Home
          </Link>
          
          {isLoggedIn ? (
            <>
              <Link to="/profile" className="text-white hover:text-blue-200">
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="text-white hover:text-blue-200 font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white hover:text-blue-200">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
