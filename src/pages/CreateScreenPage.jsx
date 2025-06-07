// // src/pages/CreateScreenPage.jsx
// import React, { useState, useEffect } from 'react';
// // import { useNavigate } from 'react-router-dom';
// import { useNavigate, Link } from 'react-router-dom';
// import { createScreen, getOwnerTheatres } from '../api';
// import { useAuth } from '../context/AuthContext';

// const CreateScreenPage = () => {
//   const [name, setName] = useState('');
//   const [capacity, setCapacity] = useState('');
//   const [theatreId, setTheatreId] = useState(''); // To select which theatre it belongs to
//   const [ownerTheatres, setOwnerTheatres] = useState([]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const { token, isAuthenticated } = useAuth();

//   useEffect(() => {
//     const fetchTheatres = async () => {
//       if (!isAuthenticated || !token) return;
//       try {
//         setLoading(true);
//         const data = await getOwnerTheatres(token);
//         setOwnerTheatres(Array.isArray(data) ? data : data.theatres || data.data || []); // Handle various response formats
//         if (ownerTheatres.length > 0) {
//             setTheatreId(ownerTheatres[0].id); // Pre-select first theatre if available
//         }
//       } catch (err) {
//         console.error('Error fetching owner theatres:', err);
//         setError('Failed to load your theatres. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchTheatres();
//   }, [token, isAuthenticated]); // Dependency on token and isAuthenticated

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     setLoading(true);

//     if (!theatreId) {
//       setError('Please select a theatre.');
//       setLoading(false);
//       return;
//     }

//     const screenData = {
//       name,
//       capacity: Number(capacity),
//       theatreId: Number(theatreId),
//     };

//     try {
//       await createScreen(screenData, token);
//       alert('Screen created successfully!');
//       navigate('/owner-dashboard');
//     } catch (err) {
//       console.error('Error creating screen:', err);
//       setError(err.message || 'Failed to create screen. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="container mx-auto p-6 text-center">
//         <div className="text-lg">Loading theatres...</div>
//       </div>
//     );
//   }

//   if (ownerTheatres.length === 0 && !loading) {
//     return (
//       <div className="container mx-auto p-6 text-center">
//         <p className="text-xl text-gray-600">You need to create a theatre first before adding a screen.</p>
//         <Link to="/create-theatre" className="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
//           Create Theatre
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto p-6 bg-white rounded-lg shadow-md max-w-xl">
//       <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Add New Screen</h1>
//       {error && <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</p>}
//       <form onSubmit={handleSubmit}>
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
//           <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Screen Name</label>
//           <input
//             type="text"
//             id="name"
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             required
//           />
//         </div>
//         <div className="mb-6">
//           <label htmlFor="capacity" className="block text-gray-700 text-sm font-bold mb-2">Capacity (Number of Seats)</label>
//           <input
//             type="number"
//             id="capacity"
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             value={capacity}
//             onChange={(e) => setCapacity(e.target.value)}
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
//             {loading ? 'Adding Screen...' : 'Add Screen'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CreateScreenPage;

// src/pages/CreateScreenPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createScreen, getOwnerTheatres } from '../api';
import { useAuth } from '../context/AuthContext';

const CreateScreenPage = () => {
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState('');
  const [theatreId, setTheatreId] = useState(''); // To select which theatre it belongs to
  const [ownerTheatres, setOwnerTheatres] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchTheatres = async () => {
      if (!isAuthenticated || !token) return;
      try {
        setLoading(true);
        const data = await getOwnerTheatres(token);
        // Handle various response formats - ensure it's an array
        const fetchedTheatres = Array.isArray(data) ? data : data.theatres || data.data || [];
        setOwnerTheatres(fetchedTheatres);
        if (fetchedTheatres.length > 0) {
            setTheatreId(fetchedTheatres[0].id); // Pre-select first theatre if available
        }
      } catch (err) {
        console.error('Error fetching owner theatres:', err);
        setError('Failed to load your theatres. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchTheatres();
  }, [token, isAuthenticated]); // Dependency on token and isAuthenticated

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!theatreId) {
      setError('Please select a theatre.');
      setLoading(false);
      return;
    }

    const screenData = {
      name,
      capacity: Number(capacity),
      theatreId: Number(theatreId),
    };

    try {
      await createScreen(screenData, token);
      alert('Screen created successfully!');
      navigate('/owner-dashboard');
    } catch (err) {
      console.error('Error creating screen:', err);
      setError(err.message || 'Failed to create screen. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 sm:p-6 text-center"> {/* Responsive padding */}
        <div className="text-lg sm:text-xl">Loading theatres...</div> {/* Responsive text size */}
      </div>
    );
  }

  if (ownerTheatres.length === 0 && !loading) {
    return (
      <div className="container mx-auto p-4 sm:p-6 text-center"> {/* Responsive padding */}
        <p className="text-base sm:text-xl text-gray-600 mb-4">You need to create a theatre first before adding a screen.</p> {/* Responsive text size and margin */}
        <Link to="/create-theatre" className="mt-2 sm:mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm sm:text-base"> {/* Responsive padding and text size */}
          Create Theatre
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-md max-w-xl sm:max-w-2xl"> {/* Responsive padding and max-width */}
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6 sm:mb-8">Add New Screen</h1> {/* Responsive text size and margin */}
      {error && <p className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded relative mb-4 text-sm sm:text-base">{error}</p>} {/* Responsive padding and text size */}
      <form onSubmit={handleSubmit}>
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
          <label htmlFor="name" className="block text-gray-700 text-sm sm:text-base font-bold mb-2">Screen Name</label> {/* Responsive text size */}
          <input
            type="text"
            id="name"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm sm:text-base" /* Responsive text size */
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="capacity" className="block text-gray-700 text-sm sm:text-base font-bold mb-2">Capacity (Number of Seats)</label> {/* Responsive text size */}
          <input
            type="number"
            id="capacity"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm sm:text-base" /* Responsive text size */
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
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
            {loading ? 'Adding Screen...' : 'Add Screen'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateScreenPage;