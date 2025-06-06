// src/pages/MovieDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieById, getAllShows } from '../api';
import SeatSelectionModal from '../components/SeatSelectionModal'; // Changed import name

const MovieDetail = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedShow, setSelectedShow] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!movieId) {
        setError('No movie ID provided.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const movieData = await getMovieById(Number(movieId));
        setMovie(movieData);

        const showsData = await getAllShows({ movieId: Number(movieId) });
        setShows(showsData);
      } catch (err) {
        setError(err.message || 'Failed to fetch movie details or shows.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [movieId]);

  const handleBookShow = (show) => {
    setSelectedShow(show);
    setIsModalOpen(true);
  };

  const handleBookingSuccess = () => {
    setIsModalOpen(false);
    navigate('/my-bookings'); // Redirect to user bookings after successful booking
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        <p className="ml-4 text-lg text-gray-600">Loading movie details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
        <p className="font-bold">Error:</p>
        <p>{error}</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full transition duration-300"
        >
          Back to Movies
        </button>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="text-center mt-8 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg">
        <p>Movie not found.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full transition duration-300"
        >
          Back to Movies
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-white rounded-xl shadow-2xl border border-gray-200">
      <button
        onClick={() => navigate('/')}
        className="mb-6 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-5 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
      >
        &larr; Back to All Movies
      </button>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="md:w-1/3 flex-shrink-0">
          <img
            src={movie.posterUrl || `https://placehold.co/400x600/E0E7FF/4F46E5?text=${encodeURIComponent(movie.title)}`}
            alt={movie.title}
            className="w-full h-auto rounded-lg shadow-lg object-cover border border-gray-300"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://placehold.co/400x600/E0E7FF/4F46E5?text=${encodeURIComponent(movie.title)}`;
            }}
          />
        </div>
        <div className="md:w-2/3">
          <h1 className="text-5xl font-extrabold text-gray-800 mb-4 leading-tight">
            {movie.title}
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            {movie.language} | {movie.duration} mins | Released: {new Date(movie.releaseDate).toLocaleDateString()}
          </p>
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            {movie.description || 'No description available for this movie.'}
          </p>

          <h2 className="text-3xl font-bold text-gray-800 mb-5 border-b-2 pb-2 border-purple-300">
            Available Shows
          </h2>
          {shows.length === 0 ? (
            <p className="text-gray-600 text-lg">No shows available for this movie yet.</p>
          ) : (
            <div className="space-y-4">
              {shows.map((show) => (
                <div key={show.id} className="bg-blue-50 p-5 rounded-lg shadow-md border border-blue-200 flex flex-col sm:flex-row justify-between items-center transition-all duration-300 hover:shadow-lg">
                  <div>
                    <p className="text-xl font-semibold text-gray-800">
                      {show.theatre?.name} - {show.screen?.name}
                    </p>
                    <p className="text-gray-600 text-base">
                      {new Date(show.showTime).toLocaleString()}
                    </p>
                    <p className="text-green-700 font-bold text-lg mt-1">
                      Price: ₹{show.price.toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleBookShow(show)}
                    className="mt-4 sm:mt-0 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
                  >
                    Book Tickets
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {isModalOpen && selectedShow && (
        <SeatSelectionModal // Changed component name
          show={selectedShow}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
};

export default MovieDetail;