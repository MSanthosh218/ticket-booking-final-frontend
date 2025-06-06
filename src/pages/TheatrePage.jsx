// src/pages/TheatrePage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllTheatres, getScreensByTheatre } from '../api';

const TheatrePage = () => {
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedTheatreId, setExpandedTheatreId] = useState(null);
  const [theatreScreens, setTheatreScreens] = useState({}); // Cache for screens

  useEffect(() => {
    const fetchTheatres = async () => {
      try {
        setLoading(true);
        const data = await getAllTheatres();
        setTheatres(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch theatres.');
      } finally {
        setLoading(false);
      }
    };
    fetchTheatres();
  }, []);

  const toggleScreens = async (theatreId) => {
    if (expandedTheatreId === theatreId) {
      setExpandedTheatreId(null); // Collapse if already expanded
    } else {
      setExpandedTheatreId(theatreId);
      if (!theatreScreens[theatreId]) { // Fetch screens only if not already cached
        try {
          const screens = await getScreensByTheatre(theatreId);
          setTheatreScreens(prev => ({ ...prev, [theatreId]: screens }));
        } catch (err) {
          console.error(`Failed to fetch screens for theatre ${theatreId}:`, err);
          // Handle error, maybe display a message for this specific theatre
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        <p className="ml-4 text-lg text-gray-600">Loading theatres...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
        <p className="font-bold">Error:</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-5xl font-extrabold text-center text-gray-800 mb-10 tracking-tight">
        Our Theatres
      </h1>
      {theatres.length === 0 ? (
        <p className="text-center text-xl text-gray-600 p-8 bg-white rounded-lg shadow-md">
          No theatres registered yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {theatres.map((theatre) => (
            <div key={theatre.id} className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200 transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl">
              <div className="p-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  {theatre.name}
                </h2>
                <p className="text-gray-600 text-lg mb-4">
                  Location: {theatre.location}
                </p>
                <p className="text-gray-700 text-base mb-4">
                  Total Seats: {theatre.totalSeats}
                </p>
                {theatre.owner && (
                  <p className="text-gray-500 text-sm">
                    Owner: {theatre.owner.name || theatre.owner.email}
                  </p>
                )}

                <button
                  onClick={() => toggleScreens(theatre.id)}
                  className="mt-4 w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                >
                  {expandedTheatreId === theatre.id ? 'Hide Screens' : 'View Screens'}
                </button>

                {expandedTheatreId === theatre.id && (
                  <div className="mt-6 border-t border-gray-200 pt-4">
                    <h3 className="text-xl font-bold text-gray-700 mb-3">Screens:</h3>
                    {theatreScreens[theatre.id] && theatreScreens[theatre.id].length > 0 ? (
                      <ul className="space-y-2">
                        {theatreScreens[theatre.id].map(screen => (
                          <li key={screen.id} className="bg-gray-50 p-3 rounded-lg shadow-sm border border-gray-100">
                            <p className="font-semibold text-gray-800">{screen.name}</p>
                            <p className="text-gray-600 text-sm">Capacity: {screen.capacity}</p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-600 text-sm">No screens found for this theatre.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TheatrePage;