// // src/components/Navbar.jsx
// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// const Navbar = () => {
//   const { isAuthenticated, user, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   return (
//     <nav className="bg-gray-900 text-white p-4 shadow-lg">
//       <div className="container mx-auto flex justify-between items-center">
//         <Link to="/" className="text-3xl font-extrabold tracking-wider">
//           FilmFinder
//         </Link>
//         <div className="flex space-x-6 items-center">
//           <Link to="/" className="hover:text-blue-400 transition duration-300 text-lg">Movies</Link>
//           <Link to="/theatres" className="hover:text-blue-400 transition duration-300 text-lg">Theatres</Link>

//           {isAuthenticated ? (
//             <>
//               <Link to="/my-bookings" className="hover:text-blue-400 transition duration-300 text-lg">My Bookings</Link>
//               {user?.role === 'OWNER' && (
//                 <Link to="/owner-dashboard" className="hover:text-blue-400 transition duration-300 text-lg">Owner Dashboard</Link>
//               )}
//               {user?.role === 'ADMIN' && (
//                 <Link to="/admin-dashboard" className="hover:text-blue-400 transition duration-300 text-lg">Admin Dashboard</Link>
//               )}
//               <span className="text-gray-400 text-lg">Hello, {user?.name || user?.email}!</span>
//               <button
//                 onClick={handleLogout}
//                 className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-5 rounded-full shadow-md transition duration-300"
//               >
//                 Logout
//               </button>
//             </>
//           ) : (
//             <>
//               <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-full shadow-md transition duration-300">Login</Link>
//               <Link to="/register" className="border border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white font-semibold py-2 px-5 rounded-full transition duration-300">Register</Link>
//             </>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


// src/components/Navbar.jsx
import React, { useState } from 'react'; // Import useState
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  // State to control the visibility of the mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false); // Close mobile menu after logout
  };

  // Helper function to close the mobile menu on navigation
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-gray-900 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo/Brand Name - Responsive font size */}
        <Link to="/" className="text-2xl md:text-3xl font-extrabold tracking-wider" onClick={closeMobileMenu}>
          FilmFinder
        </Link>

        {/* Hamburger menu button for small screens */}
        <div className="md:hidden"> {/* This button is hidden on medium and larger screens */}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white focus:outline-none">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                // 'X' icon when menu is open
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                // Hamburger icon when menu is closed
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Desktop menu items */}
        {/* These links are hidden on small screens and displayed as a flex row on medium and larger screens */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/" className="hover:text-blue-400 transition duration-300 text-lg" onClick={closeMobileMenu}>Movies</Link>
          <Link to="/theatres" className="hover:text-blue-400 transition duration-300 text-lg" onClick={closeMobileMenu}>Theatres</Link>

          {isAuthenticated ? (
            <>
              <Link to="/my-bookings" className="hover:text-blue-400 transition duration-300 text-lg" onClick={closeMobileMenu}>My Bookings</Link>
              {user?.role === 'OWNER' && (
                <Link to="/owner-dashboard" className="hover:text-blue-400 transition duration-300 text-lg" onClick={closeMobileMenu}>Owner Dashboard</Link>
              )}
              {user?.role === 'ADMIN' && (
                <Link to="/admin-dashboard" className="hover:text-blue-400 transition duration-300 text-lg" onClick={closeMobileMenu}>Admin Dashboard</Link>
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
              <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-full shadow-md transition duration-300" onClick={closeMobileMenu}>Login</Link>
              <Link to="/register" className="border border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white font-semibold py-2 px-5 rounded-full transition duration-300" onClick={closeMobileMenu}>Register</Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile menu (conditionally rendered based on isMobileMenuOpen state) */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-800 px-4 pt-2 pb-4 space-y-2 flex flex-col items-start mt-2 rounded-b-lg">
          {/* Individual links */}
          <Link to="/" className="block hover:text-blue-400 transition duration-300 text-lg py-2 w-full" onClick={closeMobileMenu}>Movies</Link>
          <Link to="/theatres" className="block hover:text-blue-400 transition duration-300 text-lg py-2 w-full" onClick={closeMobileMenu}>Theatres</Link>

          {isAuthenticated ? (
            <>
              <Link to="/my-bookings" className="block hover:text-blue-400 transition duration-300 text-lg py-2 w-full" onClick={closeMobileMenu}>My Bookings</Link>
              {user?.role === 'OWNER' && (
                <Link to="/owner-dashboard" className="block hover:text-blue-400 transition duration-300 text-lg py-2 w-full" onClick={closeMobileMenu}>Owner Dashboard</Link>
              )}
              {user?.role === 'ADMIN' && (
                <Link to="/admin-dashboard" className="block hover:text-blue-400 transition duration-300 text-lg py-2 w-full" onClick={closeMobileMenu}>Admin Dashboard</Link>
              )}
              <span className="text-gray-400 text-lg py-2 w-full">Hello, {user?.name || user?.email}!</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-5 rounded-full shadow-md transition duration-300 w-full text-center"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-full shadow-md transition duration-300 w-full text-center" onClick={closeMobileMenu}>Login</Link>
              <Link to="/register" className="border border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white font-semibold py-2 px-5 rounded-full transition duration-300 w-full text-center" onClick={closeMobileMenu}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;