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
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 fixed w-full top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-white tracking-tight">
              🐾 PawGo
            </span>
          </Link>
          
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-white hover:text-blue-200 transition-colors duration-200 text-sm font-medium">
              Home
            </Link>
            
            {isLoggedIn ? (
              <>
                <Link to="/profile" className="text-white hover:text-blue-200 transition-colors duration-200 text-sm font-medium">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 text-sm border border-white/20"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white hover:text-blue-200 transition-colors duration-200 text-sm font-medium">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-blue-600 px-6 py-2 rounded-lg hover:bg-opacity-90 transition-all duration-200 text-sm font-semibold shadow-lg hover:shadow-xl"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;