// frontend/src/pages/OwnerDashboard.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getOwnerTheatres, deleteTheatre, deleteScreen, deleteShow, getAllMovies } from '../api';

const OwnerDashboard = () => {
  const { user, token, isAuthenticated } = useAuth();
  const [ownerTheatres, setOwnerTheatres] = useState([]);
  const [movies, setMovies] = useState({}); // To map movie IDs to titles
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOwnerData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check authentication first
      if (!isAuthenticated) {
        console.log('User not authenticated');
        setError('Please log in to view this page.');
        setLoading(false);
        return;
      }

      if (!user) {
        console.log('User object is null/undefined');
        setError('User information not available. Please refresh the page.');
        setLoading(false);
        return;
      }

      if (user.role !== 'OWNER' && user.role !== 'ADMIN') { // Also allow ADMIN to view
        console.log('User role is not OWNER or ADMIN:', user.role);
        setError('You are not authorized to view this page. Owner or Admin access required.');
        setLoading(false);
        return;
      }

      if (!token) {
        console.log('Token is missing');
        setError('Authentication token is missing. Please log in again.');
        setLoading(false);
        return;
      }

      console.log('Making API call to getOwnerTheatres...');

      // Fetch theatres
      const response = await getOwnerTheatres(token);
      console.log('API Response received:', response);

      // Handle different response formats (backend should ideally return an array directly)
      let theatresData = [];
      if (Array.isArray(response)) {
        theatresData = response;
      } else if (response && response.data && Array.isArray(response.data)) {
        theatresData = response.data;
      } else if (response && response.theatres && Array.isArray(response.theatres)) { // Fallback if backend wraps it
        theatresData = response.theatres;
      } else {
        console.log('Unexpected response format for theatres:', response);
        theatresData = [];
      }
      setOwnerTheatres(theatresData);

      // Fetch all movies to map show movie IDs to titles
      const allMovies = await getAllMovies();
      const movieMap = allMovies.reduce((acc, movie) => {
        acc[movie.id] = movie.title;
        return acc;
      }, {});
      setMovies(movieMap);


    } catch (err) {
      console.error('Error in fetchOwnerData:', err);
      setError(err.message || 'Failed to load owner data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('useEffect triggered in OwnerDashboard');
    // Only fetch data if we have the basic auth info
    if (isAuthenticated !== undefined && user !== undefined) {
      fetchOwnerData();
    }
  }, [isAuthenticated, user, token]);

  const handleDeleteTheatre = async (theatreId) => {
    if (window.confirm('Are you sure you want to delete this theatre and all its associated screens and shows? This action cannot be undone.')) {
      try {
        await deleteTheatre(theatreId, token);
        alert('Theatre deleted successfully!');
        fetchOwnerData(); // Refresh data
      } catch (err) {
        console.error('Error deleting theatre:', err);
        alert(err.message || 'Failed to delete theatre.');
      }
    }
  };

  const handleDeleteScreen = async (screenId) => {
    if (window.confirm('Are you sure you want to delete this screen and all its associated shows? This action cannot be undone.')) {
      try {
        await deleteScreen(screenId, token);
        alert('Screen deleted successfully!');
        fetchOwnerData(); // Refresh data
      } catch (err) {
        console.error('Error deleting screen:', err);
        alert(err.message || 'Failed to delete screen.');
      }
    }
  };

  const handleDeleteShow = async (showId) => {
    if (window.confirm('Are you sure you want to delete this show? This action cannot be undone.')) {
      try {
        await deleteShow(showId, token);
        alert('Show deleted successfully!');
        fetchOwnerData(); // Refresh data
      } catch (err) {
        console.error('Error deleting show:', err);
        alert(err.message || 'Failed to delete show.');
      }
    }
  };

  // Debug: Log current state
  console.log('Current state:', { loading, error, theatresCount: ownerTheatres.length });

  // Early return for loading state
  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">
          <div className="text-lg">Loading Owner Dashboard...</div>
          <div className="text-sm text-gray-500 mt-2">
            Auth: {isAuthenticated ? 'Yes' : 'No'} |
            User: {user ? user.role : 'None'} |
            Token: {token ? 'Present' : 'Missing'}
          </div>
        </div>
      </div>
    );
  }

  // Early return for error state
  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">
          <div className="text-red-500 text-lg mb-4">{error}</div>
          <button
            onClick={fetchOwnerData}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
          <div className="text-sm text-gray-500 mt-4">
            Debug Info: Auth: {isAuthenticated ? 'Yes' : 'No'} |
            User: {user ? user.role : 'None'} |
            Token: {token ? 'Present' : 'Missing'}
          </div>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Owner Dashboard</h1>

      {/* Debug Info */}
      <div className="bg-gray-100 p-4 rounded mb-6 text-sm">
        <strong>Debug Info:</strong> Theatres loaded: {ownerTheatres.length} |
        User: {user?.email} ({user?.role}) |
        Token: {token ? 'Present' : 'Missing'}
      </div>

      {/* Quick Links / Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <Link to="/create-movie" className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg flex items-center justify-center text-center text-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Movie
        </Link>
        <Link to="/create-theatre" className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg flex items-center justify-center text-center text-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Theatre
        </Link>
        <Link to="/create-screen" className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg flex items-center justify-center text-center text-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Screen
        </Link>
        <Link to="/create-show" className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg flex items-center justify-center text-center text-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Show
        </Link>
      </div>

      {/* Owner's Theatres Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-700">My Theatres ({ownerTheatres.length})</h2>
          <button
            onClick={fetchOwnerData}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm"
          >
            Refresh
          </button>
        </div>

        {ownerTheatres.length > 0 ? (
          <div className="space-y-8">
            {ownerTheatres.map((theatre) => (
              <div key={theatre.id} className="border border-gray-200 p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800">{theatre.name}</h3>
                  <div className="flex space-x-2">
                    {/* Link uses theatre.id, matching App.jsx's :theatreId */}
                    <Link to={`/edit-theatre/${theatre.id}`} className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded">Edit</Link>
                    <button onClick={() => handleDeleteTheatre(theatre.id)} className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded">Delete</button>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-2">{theatre.location} | Total Seats: {theatre.totalSeats}</p>

                {/* Screens Section */}
                <div className="mt-6">
                  <h4 className="text-lg font-semibold mb-3">Screens ({theatre.screens?.length || 0})</h4>
                  {theatre.screens && theatre.screens.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                            <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {theatre.screens.map((screen) => (
                            <tr key={screen.id} className="hover:bg-gray-50">
                              <td className="py-2 px-4 border-b text-sm text-gray-800">{screen.name}</td>
                              <td className="py-2 px-4 border-b text-sm text-gray-800">{screen.capacity}</td>
                              <td className="py-2 px-4 border-b text-sm">
                                <Link to={`/edit-screen/${screen.id}`} className="text-blue-600 hover:underline mr-2">Edit</Link>
                                <button onClick={() => handleDeleteScreen(screen.id)} className="text-red-600 hover:underline">Delete</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-600 text-sm">No screens added to this theatre yet. <Link to="/create-screen" className="text-blue-600 hover:underline">Add one</Link>.</p>
                  )}
                </div>

                {/* Shows Section */}
                <div className="mt-6">
                  <h4 className="text-lg font-semibold mb-3">Shows ({theatre.shows?.length || 0})</h4>
                  {theatre.shows && theatre.shows.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Movie</th>
                            <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Screen</th>
                            <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                            <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {theatre.shows.map((show) => (
                            <tr key={show.id} className="hover:bg-gray-50">
                              <td className="py-2 px-4 border-b text-sm text-gray-800">{movies[show.movieId] || 'N/A'}</td>
                              <td className="py-2 px-4 border-b text-sm text-gray-800">{theatre.screens.find(s => s.id === show.screenId)?.name || 'N/A'}</td>
                              <td className="py-2 px-4 border-b text-sm text-gray-800">{new Date(show.showTime).toLocaleString()}</td>
                              <td className="py-2 px-4 border-b text-sm text-gray-800">₹{show.price?.toFixed(2) || '0.00'}</td>
                              <td className="py-2 px-4 border-b text-sm">
                                <Link to={`/edit-show/${show.id}`} className="text-blue-600 hover:underline mr-2">Edit</Link>
                                <button onClick={() => handleDeleteShow(show.id)} className="text-red-600 hover:underline">Delete</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-600 text-sm">No shows scheduled for this theatre yet. <Link to="/create-show" className="text-blue-600 hover:underline">Add one</Link>.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-lg">You don't own any theatres yet. <Link to="/create-theatre" className="text-blue-600 hover:underline font-bold">Create your first theatre!</Link></p>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;