// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-3xl font-extrabold tracking-wider">
          FilmFinder
        </Link>
        <div className="flex space-x-6 items-center">
          <Link to="/" className="hover:text-blue-400 transition duration-300 text-lg">Movies</Link>
          <Link to="/theatres" className="hover:text-blue-400 transition duration-300 text-lg">Theatres</Link>

          {isAuthenticated ? (
            <>
              <Link to="/my-bookings" className="hover:text-blue-400 transition duration-300 text-lg">My Bookings</Link>
              {user?.role === 'OWNER' && (
                <Link to="/owner-dashboard" className="hover:text-blue-400 transition duration-300 text-lg">Owner Dashboard</Link>
              )}
              {user?.role === 'ADMIN' && (
                <Link to="/admin-dashboard" className="hover:text-blue-400 transition duration-300 text-lg">Admin Dashboard</Link>
              )}
              <span className="text-gray-400 text-lg">Hello, {user?.name || user?.email}!</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-5 rounded-full shadow-md transition duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-full shadow-md transition duration-300">Login</Link>
              <Link to="/register" className="border border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white font-semibold py-2 px-5 rounded-full transition duration-300">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;