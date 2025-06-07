// // // // src/pages/EditTheatrePage.jsx
// // // import React, { useState, useEffect } from 'react';
// // // import { useParams, useNavigate } from 'react-router-dom';
// // // import { getTheatreById, updateTheatre } from '../api';
// // // import { useAuth } from '../context/AuthContext';

// // // const EditTheatrePage = () => {
// // //   const { theatreId } = useParams();
// // //   const navigate = useNavigate();
// // //   const { token, user } = useAuth();

// // //   const [name, setName] = useState('');
// // //   const [location, setLocation] = useState('');
// // //   const [totalSeats, setTotalSeats] = useState('');
// // //   const [error, setError] = useState(null);
// // //   const [loading, setLoading] = useState(true); // Loading for fetching theatre details

// // //   useEffect(() => {
// // //     const fetchTheatre = async () => {
// // //       setLoading(true);
// // //       setError(null);
// // //       try {
// // //         const theatreData = await getTheatreById(Number(theatreId));
// // //         // Check if the current user is the owner of this theatre (or an admin)
// // //         if (user?.role !== 'ADMIN' && theatreData.ownerId !== user?.id) {
// // //           setError('You are not authorized to edit this theatre.');
// // //           setLoading(false);
// // //           return;
// // //         }

// // //         setName(theatreData.name);
// // //         setLocation(theatreData.location);
// // //         setTotalSeats(theatreData.totalSeats);
// // //       } catch (err) {
// // //         console.error('Error fetching theatre:', err);
// // //         setError(err.message || 'Failed to load theatre details.');
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     };

// // //     fetchTheatre();
// // //   }, [theatreId, user]); // Include user in dependency array

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();
// // //     setError(null);
// // //     setLoading(true); // Loading for submitting update

// // //     const theatreData = {
// // //       name,
// // //       location,
// // //       totalSeats: Number(totalSeats),
// // //       // ownerId should not change during update, it's set on creation
// // //     };

// // //     try {
// // //       await updateTheatre(Number(theatreId), theatreData, token);
// // //       alert('Theatre updated successfully!');
// // //       navigate('/owner-dashboard');
// // //     } catch (err) {
// // //       console.error('Error updating theatre:', err);
// // //       setError(err.message || 'Failed to update theatre. Please try again.');
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   if (loading) {
// // //     return (
// // //       <div className="container mx-auto p-6 text-center">
// // //         <div className="text-lg">Loading theatre details...</div>
// // //       </div>
// // //     );
// // //   }

// // //   if (error) {
// // //     return (
// // //       <div className="container mx-auto p-6 text-center text-red-500">
// // //         <p>{error}</p>
// // //         <button onClick={() => navigate('/owner-dashboard')} className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
// // //           Back to Dashboard
// // //         </button>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="container mx-auto p-6 bg-white rounded-lg shadow-md max-w-xl">
// // //       <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Edit Theatre</h1>
// // //       {error && <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</p>}
// // //       <form onSubmit={handleSubmit}>
// // //         <div className="mb-4">
// // //           <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Theatre Name</label>
// // //           <input
// // //             type="text"
// // //             id="name"
// // //             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
// // //             value={name}
// // //             onChange={(e) => setName(e.target.value)}
// // //             required
// // //           />
// // //         </div>
// // //         <div className="mb-4">
// // //           <label htmlFor="location" className="block text-gray-700 text-sm font-bold mb-2">Location</label>
// // //           <input
// // //             type="text"
// // //             id="location"
// // //             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
// // //             value={location}
// // //             onChange={(e) => setLocation(e.target.value)}
// // //             required
// // //           />
// // //         </div>
// // //         <div className="mb-6">
// // //           <label htmlFor="totalSeats" className="block text-gray-700 text-sm font-bold mb-2">Total Seats</label>
// // //           <input
// // //             type="number"
// // //             id="totalSeats"
// // //             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
// // //             value={totalSeats}
// // //             onChange={(e) => setTotalSeats(e.target.value)}
// // //             required
// // //             min="1"
// // //           />
// // //         </div>
// // //         <div className="flex items-center justify-between">
// // //           <button
// // //             type="submit"
// // //             className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
// // //             disabled={loading}
// // //           >
// // //             {loading ? 'Updating Theatre...' : 'Update Theatre'}
// // //           </button>
// // //         </div>
// // //       </form>
// // //     </div>
// // //   );
// // // };

// // // export default EditTheatrePage;


// // // src/pages/EditTheatrePage.jsx
// // import React, { useState, useEffect } from 'react';
// // import { useParams, useNavigate } from 'react-router-dom';
// // import { getTheatreById, updateTheatre } from '../api'; // Assuming these functions handle axios calls
// // import { useAuth } from '../context/AuthContext';

// // const EditTheatrePage = () => {
// //   // --- CRITICAL CHANGE HERE: Use 'id' to match the route parameter ':id' ---
// //   const { id } = useParams(); // Changed from { theatreId } to { id }
// //   const navigate = useNavigate();
// //   const { token, user } = useAuth();

// //   const [name, setName] = useState('');
// //   const [location, setLocation] = useState('');
// //   const [totalSeats, setTotalSeats] = useState('');
// //   const [error, setError] = useState(null);
// //   const [loading, setLoading] = useState(true); // Loading for fetching theatre details

// //   useEffect(() => {
// //     const fetchTheatre = async () => {
// //       setLoading(true);
// //       setError(null);
// //       try {
// //         // Ensure you pass the correct ID to the API call
// //         const theatreData = await getTheatreById(Number(id)); // Use 'id' here
// //         // Check if the current user is the owner of this theatre (or an admin)
// //         if (user?.role !== 'ADMIN' && theatreData.ownerId !== user?.id) {
// //           setError('You are not authorized to edit this theatre.');
// //           setLoading(false);
// //           return;
// //         }

// //         setName(theatreData.name);
// //         setLocation(theatreData.location);
// //         setTotalSeats(theatreData.totalSeats);
// //       } catch (err) {
// //         console.error('Error fetching theatre:', err);
// //         setError(err.message || 'Failed to load theatre details.');
// //         // If there's an error, typically you'd want to navigate back or show a retry option
// //         // navigate('/owner-dashboard'); // Uncomment if you want to redirect on error
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     if (id) { // Only fetch if ID is available
// //       fetchTheatre();
// //     } else {
// //       setError("No theatre ID provided in URL.");
// //       setLoading(false);
// //     }
// //   }, [id, user, navigate]); // Include navigate in dependency array as it's used in useEffect

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setError(null);
// //     setLoading(true); // Loading for submitting update

// //     const theatreData = {
// //       name,
// //       location,
// //       totalSeats: Number(totalSeats),
// //     };

// //     try {
// //       await updateTheatre(Number(id), theatreData, token); // Use 'id' here
// //       alert('Theatre updated successfully!');
// //       navigate('/owner-dashboard');
// //     } catch (err) {
// //       console.error('Error updating theatre:', err);
// //       setError(err.message || 'Failed to update theatre. Please try again.');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   if (loading) {
// //     return (
// //       <div className="container mx-auto p-6 text-center">
// //         <div className="text-lg">Loading theatre details...</div>
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div className="container mx-auto p-6 text-center text-red-500">
// //         <p>{error}</p>
// //         <button onClick={() => navigate('/owner-dashboard')} className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
// //           Back to Dashboard
// //         </button>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="container mx-auto p-6 bg-white rounded-lg shadow-md max-w-xl">
// //       <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Edit Theatre</h1>
// //       {error && <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</p>}
// //       <form onSubmit={handleSubmit}>
// //         <div className="mb-4">
// //           <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Theatre Name</label>
// //           <input
// //             type="text"
// //             id="name"
// //             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
// //             value={name}
// //             onChange={(e) => setName(e.target.value)}
// //             required
// //           />
// //         </div>
// //         <div className="mb-4">
// //           <label htmlFor="location" className="block text-gray-700 text-sm font-bold mb-2">Location</label>
// //           <input
// //             type="text"
// //             id="location"
// //             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
// //             value={location}
// //             onChange={(e) => setLocation(e.target.value)}
// //             required
// //           />
// //         </div>
// //         <div className="mb-6">
// //           <label htmlFor="totalSeats" className="block text-gray-700 text-sm font-bold mb-2">Total Seats</label>
// //           <input
// //             type="number"
// //             id="totalSeats"
// //             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
// //             value={totalSeats}
// //             onChange={(e) => setTotalSeats(e.target.value)}
// //             required
// //             min="1"
// //           />
// //         </div>
// //         <div className="flex items-center justify-between">
// //           <button
// //             type="submit"
// //             className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
// //             disabled={loading}
// //           >
// //             {loading ? 'Updating Theatre...' : 'Update Theatre'}
// //           </button>
// //         </div>
// //       </form>
// //     </div>
// //   );
// // };

// // export default EditTheatrePage;
// // frontend/src/pages/EditTheatrePage.jsx
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { getTheatreById, updateTheatre } from '../api';
// import { useAuth } from '../context/AuthContext';

// const EditTheatrePage = () => {
//   // CORRECT: Destructure 'theatreId' to match the route parameter ':theatreId' from App.jsx
//   const { theatreId } = useParams();
//   const navigate = useNavigate();
//   const { token, user } = useAuth();

//   const [name, setName] = useState('');
//   const [location, setLocation] = useState('');
//   const [totalSeats, setTotalSeats] = useState('');
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true); // Loading for fetching theatre details

//   useEffect(() => {
//     const fetchTheatre = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         // Ensure theatreId is available before making the API call
//         if (!theatreId) {
//           setError("No theatre ID provided in URL.");
//           setLoading(false);
//           return;
//         }

//         const theatreData = await getTheatreById(Number(theatreId)); // Use theatreId here
        
//         // Basic authorization check: Only owner or admin can edit
//         // (More robust checks might happen on the backend as well)
//         if (user?.role !== 'ADMIN' && theatreData.ownerId !== user?.id) {
//           setError('You are not authorized to edit this theatre.');
//           setLoading(false);
//           return;
//         }

//         setName(theatreData.name);
//         setLocation(theatreData.location);
//         setTotalSeats(theatreData.totalSeats);
//       } catch (err) {
//         console.error('Error fetching theatre:', err);
//         setError(err.message || 'Failed to load theatre details.');
//         // Optionally navigate away on severe error
//         // navigate('/owner-dashboard'); 
//       } finally {
//         setLoading(false);
//       }
//     };

//     // Only fetch if theatreId is present and not null/undefined
//     if (theatreId) {
//       fetchTheatre();
//     } else {
//       setError("No theatre ID provided in URL.");
//       setLoading(false);
//     }
//   }, [theatreId, user, navigate]); // Add navigate to dependencies since it's used in useEffect

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     setLoading(true); // Loading for submitting update

//     const theatreData = {
//       name,
//       location,
//       totalSeats: Number(totalSeats),
//     };

//     try {
//       // Use theatreId here for the update API call
//       await updateTheatre(Number(theatreId), theatreData, token); 
//       alert('Theatre updated successfully!');
//       navigate('/owner-dashboard');
//     } catch (err) {
//       console.error('Error updating theatre:', err);
//       setError(err.message || 'Failed to update theatre. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="container mx-auto p-6 text-center">
//         <div className="text-lg">Loading theatre details...</div>
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
//     <div className="container mx-auto p-6 bg-white rounded-lg shadow-md max-w-xl">
//       <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Edit Theatre</h1>
//       {error && <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</p>}
//       <form onSubmit={handleSubmit}>
//         <div className="mb-4">
//           <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Theatre Name</label>
//           <input
//             type="text"
//             id="name"
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             required
//           />
//         </div>
//         <div className="mb-4">
//           <label htmlFor="location" className="block text-gray-700 text-sm font-bold mb-2">Location</label>
//           <input
//             type="text"
//             id="location"
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             value={location}
//             onChange={(e) => setLocation(e.target.value)}
//             required
//           />
//         </div>
//         <div className="mb-6">
//           <label htmlFor="totalSeats" className="block text-gray-700 text-sm font-bold mb-2">Total Seats</label>
//           <input
//             type="number"
//             id="totalSeats"
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             value={totalSeats}
//             onChange={(e) => setTotalSeats(e.target.value)}
//             required
//             min="1"
//           />
//         </div>
//         <div className="flex items-center justify-between">
//           <button
//             type="submit"
//             className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
//             disabled={loading}
//           >
//             {loading ? 'Updating Theatre...' : 'Update Theatre'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default EditTheatrePage;
// frontend/src/pages/EditTheatrePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTheatreById, updateTheatre } from '../api';
import { useAuth } from '../context/AuthContext';

const EditTheatrePage = () => {
  const { theatreId } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [totalSeats, setTotalSeats] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Loading for fetching theatre details

  useEffect(() => {
    const fetchTheatre = async () => {
      setLoading(true);
      setError(null);
      try {
        // Ensure theatreId is available before making the API call
        if (!theatreId) {
          setError("No theatre ID provided in URL.");
          setLoading(false);
          return;
        }

        const theatreData = await getTheatreById(Number(theatreId)); 
        
        // Basic authorization check: Only owner or admin can edit
        // (More robust checks might happen on the backend as well)
        if (user?.role !== 'ADMIN' && theatreData.ownerId !== user?.id) {
          setError('You are not authorized to edit this theatre.');
          setLoading(false);
          return;
        }

        setName(theatreData.name);
        setLocation(theatreData.location);
        setTotalSeats(theatreData.totalSeats);
      } catch (err) {
        console.error('Error fetching theatre:', err);
        setError(err.message || 'Failed to load theatre details.');
        // Optionally navigate away on severe error
        // navigate('/owner-dashboard'); 
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if theatreId is present and not null/undefined
    if (theatreId) {
      fetchTheatre();
    } else {
      setError("No theatre ID provided in URL.");
      setLoading(false);
    }
  }, [theatreId, user, navigate]); // Add navigate to dependencies since it's used in useEffect

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true); // Loading for submitting update

    const theatreData = {
      name,
      location,
      totalSeats: Number(totalSeats),
    };

    try {
      // Use theatreId here for the update API call
      await updateTheatre(Number(theatreId), theatreData, token); 
      alert('Theatre updated successfully!');
      navigate('/owner-dashboard');
    } catch (err) {
      console.error('Error updating theatre:', err);
      setError(err.message || 'Failed to update theatre. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 sm:p-6 text-center"> {/* Responsive padding */}
        <div className="text-lg sm:text-xl">Loading theatre details...</div> {/* Responsive text size */}
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
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6 sm:mb-8">Edit Theatre</h1> {/* Responsive text size and margin */}
      {error && <p className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded relative mb-4 text-sm sm:text-base">{error}</p>} {/* Responsive padding and text size */}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm sm:text-base font-bold mb-2">Theatre Name</label> {/* Responsive text size */}
          <input
            type="text"
            id="name"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm sm:text-base" /* Responsive text size */
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="location" className="block text-gray-700 text-sm sm:text-base font-bold mb-2">Location</label> {/* Responsive text size */}
          <input
            type="text"
            id="location"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm sm:text-base" /* Responsive text size */
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="totalSeats" className="block text-gray-700 text-sm sm:text-base font-bold mb-2">Total Seats</label> {/* Responsive text size */}
          <input
            type="number"
            id="totalSeats"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm sm:text-base" /* Responsive text size */
            value={totalSeats}
            onChange={(e) => setTotalSeats(e.target.value)}
            required
            min="1"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full text-base sm:text-lg" /* Responsive text size and padding */
            disabled={loading}
          >
            {loading ? 'Updating Theatre...' : 'Update Theatre'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTheatrePage;