// // src/pages/UserBookings.jsx
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { getUserBookings, cancelBooking } from '../api';

// const UserBookings = () => {
//   const { user, token, isAuthenticated } = useAuth();
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const fetchBookings = async () => {
//     if (!isAuthenticated || !token) {
//       setLoading(false);
//       return;
//     }
//     try {
//       setLoading(true);
//       const data = await getUserBookings(token);
//       setBookings(data);
//     } catch (err) {
//       setError(err.message || 'Failed to fetch bookings.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBookings();
//   }, [isAuthenticated, token]);

//   const handleCancelBooking = async (bookingId) => {
//     if (window.confirm('Are you sure you want to cancel this booking? This will release your seats.')) {
//       setError('');
//       try {
//         await cancelBooking(bookingId, token);
//         alert('Booking cancelled successfully!');
//         fetchBookings(); // Refresh bookings
//       } catch (err) {
//         console.error('Error cancelling booking:', err);
//         setError(err.message || 'Failed to cancel booking.');
//       }
//     }
//   };

//   if (!isAuthenticated) {
//     return (
//       <div className="text-center mt-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
//         <p>Please log in to view your bookings.</p>
//         <button
//           onClick={() => navigate('/login')}
//           className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full transition duration-300"
//         >
//           Go to Login
//         </button>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
//         <p className="ml-4 text-lg text-gray-600">Loading your bookings...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center mt-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
//         <p className="font-bold">Error:</p>
//         <p>{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-5xl font-extrabold text-center text-gray-800 mb-10 tracking-tight">
//         My Bookings
//       </h1>
//       {bookings.length === 0 ? (
//         <p className="text-center text-xl text-gray-600 p-8 bg-white rounded-lg shadow-md">
//           You have no bookings yet.
//         </p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {bookings.map((booking) => (
//             <div key={booking.id} className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200 transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl">
//               <div className="p-6">
//                 <h2 className="text-2xl font-bold text-gray-800 mb-2">
//                   Booking ID: {booking.id}
//                 </h2>
//                 <p className="text-gray-700 text-lg mb-1">
//                   Movie: {booking.show?.movie?.title || 'N/A'}
//                 </p>
//                 <p className="text-gray-700 text-lg mb-1">
//                   {/* UPDATED LINE: Accessing theatre name */}
//                   Theatre: {booking.show?.theatre?.name || 'N/A'} - {booking.show?.screen?.name || 'N/A'}
//                 </p>
//                 <p className="text-gray-700 text-lg mb-1">
//                   Show Time: {booking.show?.showTime ? new Date(booking.show.showTime).toLocaleString() : 'N/A'}
//                 </p>
//                 <p className="text-gray-700 text-lg mb-1">
//                   {/* UPDATED LINE: Correctly mapping seat details */}
//                   Seats: {booking.bookedSeats && booking.bookedSeats.length > 0
//                     ? booking.bookedSeats.map(bookedSeat => `${bookedSeat.seat.seatRow}${bookedSeat.seat.seatColumn}`).join(', ')
//                     : 'N/A'
//                   }
//                 </p>
//                 <p className="text-gray-700 text-lg mb-1">
//                   Total Seats: {booking.bookedSeats ? booking.bookedSeats.length : 0}
//                 </p>
//                 <p className={`text-xl font-bold mt-2 ${booking.status === 'cancelled' ? 'text-red-600' : 'text-green-600'}`}>
//                   Status: {booking.status.toUpperCase()}
//                 </p>
//                 <p className="text-gray-500 text-sm mt-2">
//                   Booked On: {new Date(booking.createdAt).toLocaleDateString()}
//                 </p>

//                 <div className="mt-4 border-t pt-4 flex gap-2">
//                   {booking.status !== 'cancelled' && (
//                     <button
//                       onClick={() => handleCancelBooking(booking.id)}
//                       className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-full transition duration-300 flex-1"
//                     >
//                       Cancel Booking
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserBookings;



// src/pages/UserBookings.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserBookings, cancelBooking } from '../api';

const UserBookings = () => {
  const { user, token, isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchBookings = async () => {
    if (!isAuthenticated || !token) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await getUserBookings(token);
      setBookings(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [isAuthenticated, token]);

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking? This will release your seats.')) {
      setError('');
      try {
        await cancelBooking(bookingId, token);
        alert('Booking cancelled successfully!');
        fetchBookings(); // Refresh bookings
      } catch (err) {
        console.error('Error cancelling booking:', err);
        setError(err.message || 'Failed to cancel booking.');
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center mt-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
        <p>Please log in to view your bookings.</p>
        <button
          onClick={() => navigate('/login')}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full transition duration-300"
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        <p className="ml-4 text-lg text-gray-600">Loading your bookings...</p>
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
        My Bookings
      </h1>
      {bookings.length === 0 ? (
        <p className="text-center text-xl text-gray-600 p-8 bg-white rounded-lg shadow-md">
          You have no bookings yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200 transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Booking ID: {booking.id}
                </h2>
                <p className="text-gray-700 text-lg mb-1">
                  Movie: {booking.show?.movie?.title || 'N/A'}
                </p>
                <p className="text-gray-700 text-lg mb-1">
                  {/* CORRECTED LINE: Access theatre via show.screen.theatre */}
                  Theatre: {booking.show?.screen?.theatre?.name || 'N/A'} - Screen: {booking.show?.screen?.name || 'N/A'}
                </p>
                <p className="text-gray-700 text-lg mb-1">
                  Show Time: {booking.show?.showTime ? new Date(booking.show.showTime).toLocaleString() : 'N/A'}
                </p>
                <p className="text-gray-700 text-lg mb-1">
                  {/* Correctly mapping seat details */}
                  Seats: {booking.bookedSeats && booking.bookedSeats.length > 0
                    ? booking.bookedSeats.map(bookedSeat => `${bookedSeat.seat.seatRow}${bookedSeat.seat.seatColumn}`).join(', ')
                    : 'N/A'
                  }
                </p>
                <p className="text-gray-700 text-lg mb-1">
                  Total Seats: {booking.bookedSeats ? booking.bookedSeats.length : 0}
                </p>
                <p className={`text-xl font-bold mt-2 ${booking.status === 'cancelled' ? 'text-red-600' : 'text-green-600'}`}>
                  Status: {booking.status.toUpperCase()}
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Booked On: {new Date(booking.createdAt).toLocaleDateString()}
                </p>

                <div className="mt-4 border-t pt-4 flex gap-2">
                  {booking.status !== 'cancelled' && (
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-full transition duration-300 flex-1"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserBookings;