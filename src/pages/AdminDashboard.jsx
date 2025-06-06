// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // <--- ADDED THIS LINE
import { useAuth } from '../context/AuthContext';
import { getAllUsers, getAllMovies, deleteMovie, deleteUser } from '../api'; // Assuming deleteUser exists

const AdminDashboard = () => {
  const { token, user, isAuthenticated } = useAuth();
  const [users, setUsers] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      setError('You are not authorized to view this page.');
      setLoading(false);
      return;
    }

    try {
      const [usersData, moviesData] = await Promise.all([
        getAllUsers(token),
        getAllMovies() // Movies are public, but admin needs all
      ]);
      setUsers(usersData);
      setMovies(moviesData);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      // More robust error message for the user
      setError(err.response?.data?.error || err.message || 'Failed to load admin data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token, isAuthenticated, user]); // Dependency array to refetch when auth state or user changes

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await deleteUser(userId, token);
        alert('User deleted successfully!');
        fetchData(); // Refresh data after deletion
      } catch (err) {
        console.error('Error deleting user:', err);
        alert(err.response?.data?.error || err.message || 'Failed to delete user.');
      }
    }
  };

  const handleDeleteMovie = async (movieId) => {
    if (window.confirm('Are you sure you want to delete this movie? This action cannot be undone.')) {
      try {
        await deleteMovie(movieId, token);
        alert('Movie deleted successfully!');
        fetchData(); // Refresh data after deletion
      } catch (err) {
        console.error('Error deleting movie:', err);
        alert(err.response?.data?.error || err.message || 'Failed to delete movie.');
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">
          <div className="text-lg">Loading Admin Dashboard...</div>
        </div>
      </div>
    );
  }

  // Display error if not authorized or other fetch issues
  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">
          <div className="text-red-500 text-lg mb-4">{error}</div>
          {/* Only show retry if it's not an authorization error */}
          {error.includes('authorized') ? (
            <p className="text-gray-600">Please ensure you are logged in as an ADMIN.</p>
          ) : (
            <button
              onClick={fetchData}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  // Main dashboard content
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Admin Dashboard</h1>

      <div className="bg-gray-100 p-4 rounded mb-6 text-sm">
        <strong>Debug Info:</strong> Users loaded: {users.length} | Movies loaded: {movies.length} |
        User: {user?.email} ({user?.role}) |
        Token: {token ? 'Present' : 'Missing'}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* User Management Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">User Management ({users.length})</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b text-sm text-gray-800">{u.name}</td>
                    <td className="py-2 px-4 border-b text-sm text-gray-800">{u.email}</td>
                    <td className="py-2 px-4 border-b text-sm text-gray-800">{u.role}</td>
                    <td className="py-2 px-4 border-b text-sm">
                      {/* You can add edit user functionality if needed */}
                      <button onClick={() => handleDeleteUser(u.id)} className="text-red-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Movie Management Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Movie Management ({movies.length})</h2>
          <div className="flex justify-end mb-4">
            {/* Link to create new movie */}
            <Link to="/create-movie" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm">
              Add New Movie
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Language</th>
                  <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {movies.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b text-sm text-gray-800">{m.title}</td>
                    <td className="py-2 px-4 border-b text-sm text-gray-800">{m.language}</td>
                    <td className="py-2 px-4 border-b text-sm text-gray-800">{m.duration} mins</td>
                    <td className="py-2 px-4 border-b text-sm">
                      {/* Link to edit movie */}
                      <Link to={`/edit-movie/${m.id}`} className="text-blue-600 hover:underline mr-2">Edit</Link>
                      {/* Button to delete movie */}
                      <button onClick={() => handleDeleteMovie(m.id)} className="text-red-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;