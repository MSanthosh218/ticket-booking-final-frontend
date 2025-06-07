// // src/pages/EditShowPage.jsx
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { getShowById, updateShow, getAllMovies, getOwnerTheatres, getScreensByTheatre } from '../api';
// import { useAuth } from '../context/AuthContext';

// const EditShowPage = () => {
//   const { showId } = useParams();
//   const navigate = useNavigate();
//   const { token, user } = useAuth();

//   const [movieId, setMovieId] = useState('');
//   const [theatreId, setTheatreId] = useState('');
//   const [screenId, setScreenId] = useState('');
//   const [showTime, setShowTime] = useState('');
//   const [price, setPrice] = useState('');
//   const [movies, setMovies] = useState([]);
//   const [ownerTheatres, setOwnerTheatres] = useState([]);
//   const [screensForSelectedTheatre, setScreensForSelectedTheatre] = useState([]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true); // Loading for fetching initial data

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const [showData, moviesData, theatresData] = await Promise.all([
//           getShowById(Number(showId)),
//           getAllMovies(),
//           getOwnerTheatres(token),
//         ]);

//         const theatres = Array.isArray(theatresData) ? theatresData : theatresData.theatres || theatresData.data || [];

//         // Check if the current user is authorized to edit this show
//         const associatedTheatre = theatres.find(t => t.id === showData.theatreId);
//         if (user?.role !== 'ADMIN' && (!associatedTheatre || associatedTheatre.ownerId !== user?.id)) {
//           setError('You are not authorized to edit this show.');
//           setLoading(false);
//           return;
//         }

//         setMovieId(showData.movieId);
//         setTheatreId(showData.theatreId);
//         setScreenId(showData.screenId);
//         // Format date-time for input field
//         const formattedShowTime = new Date(showData.showTime).toISOString().slice(0, 16);
//         setShowTime(formattedShowTime);
//         setPrice(showData.price);

//         setMovies(moviesData);
//         setOwnerTheatres(theatres);

//         // Fetch screens for the pre-selected theatre
//         if (showData.theatreId) {
//           const screensData = await getScreensByTheatre(showData.theatreId);
//           setScreensForSelectedTheatre(screensData);
//         }

//       } catch (err) {
//         console.error('Error fetching show details or dependencies:', err);
//         setError(err.message || 'Failed to load show details for editing.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [showId, token, user]);

//   // Effect to re-fetch screens when theatre selection changes manually
//   useEffect(() => {
//     const fetchScreensOnTheatreChange = async () => {
//       if (theatreId) {
//         try {
//           const screensData = await getScreensByTheatre(Number(theatreId));
//           setScreensForSelectedTheatre(screensData);
//           // Only reset screenId if the current screenId is not found in the new list
//           if (!screensData.some(screen => screen.id === Number(screenId))) {
//             setScreenId('');
//           }
//         } catch (err) {
//           console.error('Error fetching screens for theatre:', err);
//           setError('Failed to load screens for the selected theatre.');
//         }
//       } else {
//         setScreensForSelectedTheatre([]);
//         setScreenId('');
//       }
//     };
//     // Only run if theatreId is manually changed after initial load
//     if (!loading) { // Prevent running on initial load where theatreId is set by showData
//       fetchScreensOnTheatreChange();
//     }
//   }, [theatreId, loading, screenId]); // Add screenId to re-evaluate when it changes

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     setLoading(true); // Loading for submitting update

//     if (!movieId || !theatreId || !screenId || !showTime || !price) {
//       setError('All fields are required.');
//       setLoading(false);
//       return;
//     }

//     const showData = {
//       movieId: Number(movieId),
//       theatreId: Number(theatreId),
//       screenId: Number(screenId),
//       showTime: new Date(showTime).toISOString(),
//       price: Number(price),
//     };

//     try {
//       await updateShow(Number(showId), showData, token);
//       alert('Show updated successfully!');
//       navigate('/owner-dashboard');
//     } catch (err) {
//       console.error('Error updating show:', err);
//       setError(err.message || 'Failed to update show. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="container mx-auto p-6 text-center">
//         <div className="text-lg">Loading show details...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="container mx-auto p-6 text-center text-red-500">
//         <p>{error}</p>
//         <button onClick={() => navigate('/owner-dashboard')} className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
//           Back to Dashboard
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto p-6 bg-white rounded-lg shadow-md max-w-2xl">
//       <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Edit Show</h1>
//       {error && <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</p>}
//       <form onSubmit={handleSubmit}>
//         <div className="mb-4">
//           <label htmlFor="movie" className="block text-gray-700 text-sm font-bold mb-2">Select Movie</label>
//           <select
//             id="movie"
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             value={movieId}
//             onChange={(e) => setMovieId(e.target.value)}
//             required
//           >
//             <option value="">-- Select a Movie --</option>
//             {movies.map((movie) => (
//               <option key={movie.id} value={movie.id}>
//                 {movie.title}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div className="mb-4">
//           <label htmlFor="theatre" className="block text-gray-700 text-sm font-bold mb-2">Select Theatre</label>
//           <select
//             id="theatre"
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             value={theatreId}
//             onChange={(e) => setTheatreId(e.target.value)}
//             required
//           >
//             <option value="">-- Select a Theatre --</option>
//             {ownerTheatres.map((theatre) => (
//               <option key={theatre.id} value={theatre.id}>
//                 {theatre.name} ({theatre.location})
//               </option>
//             ))}
//           </select>
//         </div>
//         <div className="mb-4">
//           <label htmlFor="screen" className="block text-gray-700 text-sm font-bold mb-2">Select Screen</label>
//           <select
//             id="screen"
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             value={screenId}
//             onChange={(e) => setScreenId(e.target.value)}
//             required
//             disabled={!theatreId || screensForSelectedTheatre.length === 0}
//           >
//             <option value="">-- Select a Screen --</option>
//             {screensForSelectedTheatre.map((screen) => (
//               <option key={screen.id} value={screen.id}>
//                 {screen.name} (Capacity: {screen.capacity})
//               </option>
//             ))}
//           </select>
//           {!theatreId && <p className="text-sm text-gray-500 mt-1">Please select a theatre first.</p>}
//           {theatreId && screensForSelectedTheatre.length === 0 && <p className="text-sm text-gray-500 mt-1">No screens found for this theatre.</p>}
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//           <div>
//             <label htmlFor="showTime" className="block text-gray-700 text-sm font-bold mb-2">Show Time</label>
//             <input
//               type="datetime-local"
//               id="showTime"
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               value={showTime}
//               onChange={(e) => setShowTime(e.target.value)}
//               required
//             />
//           </div>
//           <div>
//             <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">Ticket Price (₹)</label>
//             <input
//               type="number"
//               id="price"
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               value={price}
//               onChange={(e) => setPrice(e.target.value)}
//               required
//               min="0"
//               step="0.01"
//             />
//           </div>
//         </div>
//         <div className="flex items-center justify-between mt-6">
//           <button
//             type="submit"
//             className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
//             disabled={loading}
//           >
//             {loading ? 'Updating Show...' : 'Update Show'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default EditShowPage;
// src/pages/EditShowPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getShowById, updateShow, getAllMovies, getOwnerTheatres, getScreensByTheatre } from '../api';
import { useAuth } from '../context/AuthContext';

const EditShowPage = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const [movieId, setMovieId] = useState('');
  const [theatreId, setTheatreId] = useState('');
  const [screenId, setScreenId] = useState('');
  const [showTime, setShowTime] = useState('');
  const [price, setPrice] = useState('');
  const [movies, setMovies] = useState([]);
  const [ownerTheatres, setOwnerTheatres] = useState([]);
  const [screensForSelectedTheatre, setScreensForSelectedTheatre] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Loading for fetching initial data

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [showData, moviesData, theatresData] = await Promise.all([
          getShowById(Number(showId)),
          getAllMovies(),
          getOwnerTheatres(token),
        ]);

        const theatres = Array.isArray(theatresData) ? theatresData : theatresData.theatres || theatresData.data || [];

        // Check if the current user is authorized to edit this show
        const associatedTheatre = theatres.find(t => t.id === showData.theatreId);
        if (user?.role !== 'ADMIN' && (!associatedTheatre || associatedTheatre.ownerId !== user?.id)) {
          setError('You are not authorized to edit this show.');
          setLoading(false);
          return;
        }

        setMovieId(showData.movieId);
        setTheatreId(showData.theatreId);
        setScreenId(showData.screenId);
        // Format date-time for input field
        const formattedShowTime = new Date(showData.showTime).toISOString().slice(0, 16);
        setShowTime(formattedShowTime);
        setPrice(showData.price);

        setMovies(moviesData);
        setOwnerTheatres(theatres);

        // Fetch screens for the pre-selected theatre
        if (showData.theatreId) {
          const screensData = await getScreensByTheatre(showData.theatreId);
          setScreensForSelectedTheatre(screensData);
        }

      } catch (err) {
        console.error('Error fetching show details or dependencies:', err);
        setError(err.message || 'Failed to load show details for editing.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [showId, token, user]);

  // Effect to re-fetch screens when theatre selection changes manually
  useEffect(() => {
    const fetchScreensOnTheatreChange = async () => {
      if (theatreId) {
        try {
          const screensData = await getScreensByTheatre(Number(theatreId));
          setScreensForSelectedTheatre(screensData);
          // Only reset screenId if the current screenId is not found in the new list
          if (!screensData.some(screen => screen.id === Number(screenId))) {
            setScreenId('');
          }
        } catch (err) {
          console.error('Error fetching screens for theatre:', err);
          setError('Failed to load screens for the selected theatre.');
        }
      } else {
        setScreensForSelectedTheatre([]);
        setScreenId('');
      }
    };
    // Only run if theatreId is manually changed after initial load
    // Use a ref to track if it's the initial mount or actual change
    // For simplicity, here we'll let it run and handle the screenId reset
    fetchScreensOnTheatreChange();
  }, [theatreId, screenId]); // Add screenId to re-evaluate when it changes, removed 'loading'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true); // Loading for submitting update

    if (!movieId || !theatreId || !screenId || !showTime || !price) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }

    const showData = {
      movieId: Number(movieId),
      theatreId: Number(theatreId),
      screenId: Number(screenId),
      showTime: new Date(showTime).toISOString(),
      price: Number(price),
    };

    try {
      await updateShow(Number(showId), showData, token);
      alert('Show updated successfully!');
      navigate('/owner-dashboard');
    } catch (err) {
      console.error('Error updating show:', err);
      setError(err.message || 'Failed to update show. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 sm:p-6 text-center"> {/* Responsive padding */}
        <div className="text-lg sm:text-xl">Loading show details...</div> {/* Responsive text size */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 sm:p-6 text-center text-red-500"> {/* Responsive padding */}
        <p className="text-base sm:text-lg">{error}</p> {/* Responsive text size */}
        <button onClick={() => navigate('/owner-dashboard')} className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm sm:text-base"> {/* Responsive padding and text size */}
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-md max-w-xl sm:max-w-2xl"> {/* Responsive padding and max-width */}
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6 sm:mb-8">Edit Show</h1> {/* Responsive text size and margin */}
      {error && <p className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded relative mb-4 text-sm sm:text-base">{error}</p>} {/* Responsive padding and text size */}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="movie" className="block text-gray-700 text-sm sm:text-base font-bold mb-2">Select Movie</label> {/* Responsive text size */}
          <select
            id="movie"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm sm:text-base" /* Responsive text size */
            value={movieId}
            onChange={(e) => setMovieId(e.target.value)}
            required
          >
            <option value="">-- Select a Movie --</option>
            {movies.map((movie) => (
              <option key={movie.id} value={movie.id}>
                {movie.title}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="theatre" className="block text-gray-700 text-sm sm:text-base font-bold mb-2">Select Theatre</label> {/* Responsive text size */}
          <select
            id="theatre"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm sm:text-base" /* Responsive text size */
            value={theatreId}
            onChange={(e) => setTheatreId(e.target.value)}
            required
          >
            <option value="">-- Select a Theatre --</option>
            {ownerTheatres.map((theatre) => (
              <option key={theatre.id} value={theatre.id}>
                {theatre.name} ({theatre.location})
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="screen" className="block text-gray-700 text-sm sm:text-base font-bold mb-2">Select Screen</label> {/* Responsive text size */}
          <select
            id="screen"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm sm:text-base" /* Responsive text size */
            value={screenId}
            onChange={(e) => setScreenId(e.target.value)}
            required
            disabled={!theatreId || screensForSelectedTheatre.length === 0}
          >
            <option value="">-- Select a Screen --</option>
            {screensForSelectedTheatre.map((screen) => (
              <option key={screen.id} value={screen.id}>
                {screen.name} (Capacity: {screen.capacity})
              </option>
            ))}
          </select>
          {!theatreId && <p className="text-xs sm:text-sm text-gray-500 mt-1">Please select a theatre first.</p>} {/* Responsive text size */}
          {theatreId && screensForSelectedTheatre.length === 0 && <p className="text-xs sm:text-sm text-gray-500 mt-1">No screens found for this theatre.</p>} {/* Responsive text size */}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4"> {/* Changed to sm:grid-cols-2 for better tablet layout */}
          <div>
            <label htmlFor="showTime" className="block text-gray-700 text-sm sm:text-base font-bold mb-2">Show Time</label> {/* Responsive text size */}
            <input
              type="datetime-local"
              id="showTime"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm sm:text-base" /* Responsive text size */
              value={showTime}
              onChange={(e) => setShowTime(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="price" className="block text-gray-700 text-sm sm:text-base font-bold mb-2">Ticket Price (₹)</label> {/* Responsive text size */}
            <input
              type="number"
              id="price"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm sm:text-base" /* Responsive text size */
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              min="0"
              step="0.01"
            />
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 sm:mt-6"> {/* Responsive margin-top */}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full text-base sm:text-lg" /* Responsive text size and padding */
            disabled={loading}
          >
            {loading ? 'Updating Show...' : 'Update Show'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditShowPage;