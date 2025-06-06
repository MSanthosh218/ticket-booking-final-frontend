// src/pages/CreateMoviePage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createMovie } from '../api';
import { useAuth } from '../context/AuthContext';

const CreateMoviePage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [language, setLanguage] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const movieData = {
      title,
      description,
      duration: Number(duration),
      language,
      releaseDate: new Date(releaseDate).toISOString(), // Ensure ISO format
      posterUrl,
    };

    try {
      await createMovie(movieData, token);
      alert('Movie created successfully!');
      navigate('/owner-dashboard'); // Or '/admin-dashboard' depending on flow
    } catch (err) {
      console.error('Error creating movie:', err);
      setError(err.message || 'Failed to create movie. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md max-w-2xl">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Add New Movie</h1>
      {error && <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Title</label>
          <input
            type="text"
            id="title"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description</label>
          <textarea
            id="description"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            required
          ></textarea>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="duration" className="block text-gray-700 text-sm font-bold mb-2">Duration (minutes)</label>
            <input
              type="number"
              id="duration"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
              min="1"
            />
          </div>
          <div>
            <label htmlFor="language" className="block text-gray-700 text-sm font-bold mb-2">Language</label>
            <input
              type="text"
              id="language"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="releaseDate" className="block text-gray-700 text-sm font-bold mb-2">Release Date</label>
          <input
            type="date"
            id="releaseDate"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="posterUrl" className="block text-gray-700 text-sm font-bold mb-2">Poster URL (Optional)</label>
          <input
            type="url"
            id="posterUrl"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={posterUrl}
            onChange={(e) => setPosterUrl(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            disabled={loading}
          >
            {loading ? 'Adding Movie...' : 'Add Movie'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateMoviePage;