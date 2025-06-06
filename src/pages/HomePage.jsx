// src/pages/HomePage.jsx
import React, { useEffect, useState } from 'react';
import { getAllMovies } from '../api';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const data = await getAllMovies();
        setMovies(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch movies.');
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        <p className="ml-4 text-lg text-gray-600">Loading movies...</p>
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
        Now Showing
      </h1>
      {movies.length === 0 ? (
        <p className="text-center text-xl text-gray-600 p-8 bg-white rounded-lg shadow-md">
          No movies are currently available. Please check back later!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {movies.map((movie) => (
            <Link
              to={`/movies/${movie.id}`}
              key={movie.id}
              className="block bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200 transition-transform duration-300 hover:scale-[1.03] hover:shadow-2xl"
            >
              <img
                src={movie.posterUrl || `https://placehold.co/400x600/E0E7FF/4F46E5?text=${encodeURIComponent(movie.title)}`}
                alt={movie.title}
                className="w-full h-80 object-cover"
                onError={(e) => {
                  e.target.onerror = null; // prevents infinite loop
                  e.target.src = `https://placehold.co/400x600/E0E7FF/4F46E5?text=${encodeURIComponent(movie.title)}`;
                }}
              />
              <div className="p-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-1">
                  {movie.title}
                </h2>
                <p className="text-gray-600 text-sm">{movie.language} | {movie.duration} mins</p>
                <p className="text-gray-700 text-sm mt-2">
                  Released: {new Date(movie.releaseDate).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;