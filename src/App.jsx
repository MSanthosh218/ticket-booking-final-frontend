// src/App.jsx
import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import MovieDetail from './pages/MovieDetail';
import UserBookings from './pages/UserBookings';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OwnerDashboard from './pages/OwnerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import TheatrePage from './pages/TheatrePage';
import CreateMoviePage from './pages/CreateMoviePage';
import CreateTheatrePage from './pages/CreateTheatrePage';
import CreateScreenPage from './pages/CreateScreenPage';
import CreateShowPage from './pages/CreateShowPage';
import EditTheatrePage from './pages/EditTheatrePage';
import EditScreenPage from './pages/EditScreenPage';
import EditShowPage from './pages/EditShowPage';
import EditMoviePage from './pages/EditMoviePage';

import { useAuth } from './context/AuthContext';

// ProtectedRoute component for role-based access control
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-gray-700">
        Loading authentication...
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirect to home or show access denied if role not allowed
    return (
      <div className="text-center mt-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
        <p>Access Denied. Your role ({user?.role}) does not have permission to view this page.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full transition duration-300"
        >
          Go to Home
        </button>
      </div>
    );
  }

  return children;
};

function App() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated on initial load, unless on register page
  useEffect(() => {
    if (!loading && !isAuthenticated && window.location.pathname !== '/register') {
      navigate('/login', { replace: true });
    }
  }, [loading, isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto p-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movies/:movieId" element={<MovieDetail />} />
          <Route path="/theatres" element={<TheatrePage />} />

          {/* Public Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes - Customer, Owner, Admin */}
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute allowedRoles={['CUSTOMER', 'OWNER', 'ADMIN']}>
                <UserBookings />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Owner, Admin */}
          <Route
            path="/owner-dashboard"
            element={
              <ProtectedRoute allowedRoles={['OWNER', 'ADMIN']}>
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-movie"
            element={
              <ProtectedRoute allowedRoles={['OWNER', 'ADMIN']}>
                <CreateMoviePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-movie/:movieId"
            element={
              <ProtectedRoute allowedRoles={['OWNER', 'ADMIN']}>
                <EditMoviePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-theatre"
            element={
              <ProtectedRoute allowedRoles={['OWNER', 'ADMIN']}>
                <CreateTheatrePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-theatre/:theatreId"
            element={
              <ProtectedRoute allowedRoles={['OWNER', 'ADMIN']}>
                <EditTheatrePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-screen"
            element={
              <ProtectedRoute allowedRoles={['OWNER', 'ADMIN']}>
                <CreateScreenPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-screen/:screenId"
            element={
              <ProtectedRoute allowedRoles={['OWNER', 'ADMIN']}>
                <EditScreenPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-show"
            element={
              <ProtectedRoute allowedRoles={['OWNER', 'ADMIN']}>
                <CreateShowPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-show/:showId"
            element={
              <ProtectedRoute allowedRoles={['OWNER', 'ADMIN']}>
                <EditShowPage />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Admin Only */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch-all for undefined routes */}
          <Route path="*" element={
            <div className="text-center mt-8 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg">
              <p className="font-bold">404 - Page Not Found</p>
              <button
                onClick={() => navigate('/')}
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full transition duration-300"
              >
                Go to Home
              </button>
            </div>
          } />
        </Routes>
      </main>
      <footer className="bg-gray-800 text-white p-4 text-center mt-8 rounded-t-lg shadow-inner">
        <p>&copy; {new Date().getFullYear()} FilmFinder. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;