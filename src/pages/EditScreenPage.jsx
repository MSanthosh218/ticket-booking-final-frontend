// // src/pages/EditScreenPage.jsx
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { getScreenById, updateScreen, getOwnerTheatres } from '../api';
// import { useAuth } from '../context/AuthContext';

// const EditScreenPage = () => {
//   const { screenId } = useParams();
//   const navigate = useNavigate();
//   const { token, user } = useAuth();

//   const [name, setName] = useState('');
//   const [capacity, setCapacity] = useState('');
//   const [theatreId, setTheatreId] = useState('');
//   const [ownerTheatres, setOwnerTheatres] = useState([]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true); // Loading for fetching screen/theatre details

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const screenData = await getScreenById(Number(screenId));
//         // Fetch owner's theatres for the dropdown
//         const ownerTheatresData = await getOwnerTheatres(token);
//         const theatres = Array.isArray(ownerTheatresData) ? ownerTheatresData : ownerTheatresData.theatres || ownerTheatresData.data || [];

//         // Check if the current user is authorized to edit this screen
//         // (i.e., owns the theatre associated with the screen or is an admin)
//         const associatedTheatre = theatres.find(t => t.id === screenData.theatreId);
//         if (user?.role !== 'ADMIN' && (!associatedTheatre || associatedTheatre.ownerId !== user?.id)) {
//           setError('You are not authorized to edit this screen.');
//           setLoading(false);
//           return;
//         }

//         setName(screenData.name);
//         setCapacity(screenData.capacity);
//         setTheatreId(screenData.theatreId);
//         setOwnerTheatres(theatres);

//       } catch (err) {
//         console.error('Error fetching screen/theatre data:', err);
//         setError(err.message || 'Failed to load screen details.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [screenId, token, user]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     setLoading(true); // Loading for submitting update

//     const screenData = {
//       name,
//       capacity: Number(capacity),
//       theatreId: Number(theatreId), // Ensure it's a number
//     };

//     try {
//       await updateScreen(Number(screenId), screenData, token);
//       alert('Screen updated successfully!');
//       navigate('/owner-dashboard');
//     } catch (err) {
//       console.error('Error updating screen:', err);
//       setError(err.message || 'Failed to update screen. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="container mx-auto p-6 text-center">
//         <div className="text-lg">Loading screen details...</div>
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
//       <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Edit Screen</h1>
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
//             {loading ? 'Updating Screen...' : 'Update Screen'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default EditScreenPage;
// src/pages/EditScreenPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getScreenById, updateScreen, getOwnerTheatres } from '../api';
import { useAuth } from '../context/AuthContext';

const EditScreenPage = () => {
  const { screenId } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState('');
  const [theatreId, setTheatreId] = useState('');
  const [ownerTheatres, setOwnerTheatres] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Loading for fetching screen/theatre details

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const screenData = await getScreenById(Number(screenId));
        // Fetch owner's theatres for the dropdown
        const ownerTheatresData = await getOwnerTheatres(token);
        const theatres = Array.isArray(ownerTheatresData) ? ownerTheatresData : ownerTheatresData.theatres || ownerTheatresData.data || [];

        // Check if the current user is authorized to edit this screen
        // (i.e., owns the theatre associated with the screen or is an admin)
        const associatedTheatre = theatres.find(t => t.id === screenData.theatreId);
        if (user?.role !== 'ADMIN' && (!associatedTheatre || associatedTheatre.ownerId !== user?.id)) {
          setError('You are not authorized to edit this screen.');
          setLoading(false);
          return;
        }

        setName(screenData.name);
        setCapacity(screenData.capacity);
        setTheatreId(screenData.theatreId);
        setOwnerTheatres(theatres);

      } catch (err) {
        console.error('Error fetching screen/theatre data:', err);
        setError(err.message || 'Failed to load screen details.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [screenId, token, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true); // Loading for submitting update

    const screenData = {
      name,
      capacity: Number(capacity),
      theatreId: Number(theatreId), // Ensure it's a number
    };

    try {
      await updateScreen(Number(screenId), screenData, token);
      alert('Screen updated successfully!');
      navigate('/owner-dashboard');
    } catch (err) {
      console.error('Error updating screen:', err);
      setError(err.message || 'Failed to update screen. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 sm:p-6 text-center"> {/* Responsive padding */}
        <div className="text-lg sm:text-xl">Loading screen details...</div> {/* Responsive text size */}
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
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6 sm:mb-8">Edit Screen</h1> {/* Responsive text size and margin */}
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
            {loading ? 'Updating Screen...' : 'Update Screen'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditScreenPage;