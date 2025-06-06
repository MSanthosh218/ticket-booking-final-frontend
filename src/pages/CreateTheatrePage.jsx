// src/pages/CreateTheatrePage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTheatre } from '../api';
import { useAuth } from '../context/AuthContext';

const CreateTheatrePage = () => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [totalSeats, setTotalSeats] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token, user } = useAuth(); // Assuming user object has id

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!user || !user.id) {
      setError("User information not available. Cannot create theatre.");
      setLoading(false);
      return;
    }

    const theatreData = {
      name,
      location,
      totalSeats: Number(totalSeats),
      ownerId: user.id // Assign the current user's ID as the owner
    };

    try {
      await createTheatre(theatreData, token);
      alert('Theatre created successfully!');
      navigate('/owner-dashboard');
    } catch (err) {
      console.error('Error creating theatre:', err);
      setError(err.message || 'Failed to create theatre. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md max-w-xl">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Add New Theatre</h1>
      {error && <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Theatre Name</label>
          <input
            type="text"
            id="name"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="location" className="block text-gray-700 text-sm font-bold mb-2">Location</label>
          <input
            type="text"
            id="location"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="totalSeats" className="block text-gray-700 text-sm font-bold mb-2">Total Seats</label>
          <input
            type="number"
            id="totalSeats"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={totalSeats}
            onChange={(e) => setTotalSeats(e.target.value)}
            required
            min="1"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            disabled={loading}
          >
            {loading ? 'Adding Theatre...' : 'Add Theatre'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTheatrePage;