// src/pages/EditMoviePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieById, updateMovie } from '../api';
import { useAuth } from '../context/AuthContext';

const EditMoviePage = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [language, setLanguage] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Loading for fetching movie details

  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      setError(null);
      try {
        const movieData = await getMovieById(Number(movieId));
        setTitle(movieData.title);
        setDescription(movieData.description);
        setDuration(movieData.duration);
        setLanguage(movieData.language);
        setReleaseDate(new Date(movieData.releaseDate).toISOString().split('T')[0]); // Format for date input
        setPosterUrl(movieData.posterUrl || '');
      } catch (err) {
        console.error('Error fetching movie:', err);
        setError(err.message || 'Failed to load movie details.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [movieId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true); // Loading for submitting update

    const movieData = {
      title,
      description,
      duration: Number(duration),
      language,
      releaseDate: new Date(releaseDate).toISOString(),
      posterUrl,
    };

    try {
      await updateMovie(Number(movieId), movieData, token);
      alert('Movie updated successfully!');
      navigate('/admin-dashboard'); // Or back to owner dashboard if applicable
    } catch (err) {
      console.error('Error updating movie:', err);
      setError(err.message || 'Failed to update movie. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 text-center">
        <div className="text-lg">Loading movie details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 text-center text-red-500">
        <p>{error}</p>
        <button onClick={() => navigate('/admin-dashboard')} className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md max-w-2xl">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Edit Movie</h1>
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
            {loading ? 'Updating Movie...' : 'Update Movie'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditMoviePage;