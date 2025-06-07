
// import React, { useState, useEffect } from 'react';
// import { getShowSeats, createBooking } from '../api';
// import { useAuth } from '../context/AuthContext';

// const SeatSelectionModal = ({ show, onClose, onSuccess }) => {
//   const { token, isAuthenticated } = useAuth();
//   const [showSeats, setShowSeats] = useState([]);
//   const [selectedSeatIds, setSelectedSeatIds] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [bookingLoading, setBookingLoading] = useState(false);
//   const [bookingError, setBookingError] = useState(null);

//   useEffect(() => {
//     const fetchSeats = async () => {
//       setLoading(true);
//       setError(null);
//       if (!isAuthenticated || !token) {
//         setError('Authentication required to select seats.');
//         setLoading(false);
//         return;
//       }
//       // CRITICAL CHECK: Ensure show.id exists before fetching seats
//       if (!show?.id) {
//         setError('Show ID is missing. Cannot load seats.');
//         setLoading(false);
//         return;
//       }
//       try {
//         const data = await getShowSeats(show.id, token);
//         setShowSeats(data);
//       } catch (err) {
//         console.error('Error fetching show seats:', err);
//         setError(err.message || 'Failed to load seats.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (show && show.id) { // Only fetch if show and show.id are available
//       fetchSeats();
//     }
//   }, [show, token, isAuthenticated]);

//   const handleSeatClick = (seatId, seatStatus) => {
//     if (seatStatus === 'BOOKED') {
//       return;
//     }
//     if (selectedSeatIds.includes(seatId)) {
//       setSelectedSeatIds(selectedSeatIds.filter((id) => id !== seatId));
//     } else {
//       setSelectedSeatIds([...selectedSeatIds, seatId]);
//     }
//   };

//   const handleConfirmBooking = async () => {
//     if (selectedSeatIds.length === 0) {
//       setBookingError('Please select at least one seat.');
//       return;
//     }
//     if (!isAuthenticated || !token) {
//       setBookingError('You must be logged in to book tickets.');
//       return;
//     }
//     // CRITICAL CHECK: Ensure show.id is available at the moment of booking
//     if (!show?.id) {
//       setBookingError('Show information is incomplete. Please try again.');
//       console.error('Booking failed: Show ID is missing during confirmation.');
//       return;
//     }

//     setBookingLoading(true);
//     setBookingError(null);

//     // --- CONSOLE LOGS FOR DEBUGGING (KEEP THESE FOR INITIAL TESTING) ---
//     console.log("DEBUG: Attempting to book...");
//     console.log("DEBUG: show.id:", show.id);
//     console.log("DEBUG: selectedSeatIds:", selectedSeatIds);
//     console.log("DEBUG: token exists:", !!token);
//     // --- END DEBUG LOGS ---

//     try {
//       // This call passes selectedSeatIds which api.js will now map to 'seatIds' in the payload
//       const bookingResponse = await createBooking(selectedSeatIds, show.id, token);
//       console.log('Booking successful:', bookingResponse);
//       onSuccess();
//     } catch (err) {
//       console.error('Booking error:', err);
//       // Display the specific error message from the backend
//       setBookingError(err.message || 'Failed to create booking.');
//     } finally {
//       setBookingLoading(false);
//     }
//   };

//   const calculateTotalPrice = () => {
//     return selectedSeatIds.length * (show?.price || 0); // Defensive: handle if show.price is undefined
//   };

//   // Primary guard for the 'show' prop
//   if (!show) {
//     return null; // Render nothing if show prop is missing or not yet loaded
//   }

//   // Group seats by row for rendering
//   const groupedSeats = showSeats.reduce((acc, seat) => {
//     if (!acc[seat.seatRow]) {
//       acc[seat.seatRow] = [];
//     }
//     acc[seat.seatRow].push(seat);
//     return acc;
//   }, {});

//   const sortedRows = Object.keys(groupedSeats).sort();

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl relative">
//         <button
//           onClick={onClose}
//           className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-bold"
//         >
//           &times;
//         </button>
//         <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Select Your Seats</h2>

//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
//             <p>{error}</p>
//           </div>
//         )}
//         {bookingError && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
//             <p>{bookingError}</p>
//           </div>
//         )}

//         <div className="mb-4 text-center">
//           {/* Defensive optional chaining for nested properties */}
//           <p className="text-xl font-semibold text-gray-800">{show.movie?.title || 'Loading Movie...'}</p>
//           <p className="text-md text-gray-600">{show.theatre?.name || 'Loading Theatre...'} - {show.screen?.name || 'Loading Screen...'}</p>
//           <p className="text-md text-gray-600">{new Date(show.showTime).toLocaleString()}</p>
//           <p className="text-lg font-bold text-green-700">Price per seat: ₹{show.price?.toFixed(2) || 'N/A'}</p>
//         </div>

//         {loading ? (
//           <div className="flex justify-center items-center h-48">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
//             <p className="ml-4 text-gray-600">Loading seats...</p>
//           </div>
//         ) : (
//           <div className="max-h-96 overflow-y-auto mb-6 p-2 border rounded-md bg-gray-50">
//             <div className="text-center text-lg font-semibold mb-4 text-gray-700">Screen This Way</div>
//             <div className="bg-gray-700 h-2 w-full mb-6 rounded"></div>

//             <div className="flex flex-col items-center">
//               {sortedRows.map((row) => (
//                 <div key={row} className="flex items-start mb-2 w-full justify-center">
//                   {/* <span className="font-bold mr-2 w-6 text-right mt-2">{row}</span> */}
//                   <div className="flex flex-wrap gap-1 max-w-[calc(10*2.5rem+9*0.25rem)]"> {/* Forces 10 columns */}
//                     {groupedSeats[row]
//                       .sort((a, b) => a.seatColumn - b.seatColumn)
//                       .map((seat) => (
//                         <button
//                           key={seat.id}
//                           className={`w-10 h-10 rounded-md text-white font-bold text-sm flex items-center justify-center
//                             ${seat.status === 'BOOKED'
//                               ? 'bg-red-500 cursor-not-allowed' // Booked seats are red
//                               : selectedSeatIds.includes(seat.id)
//                                 ? 'bg-blue-600 hover:bg-blue-700' // Selected seats are blue
//                                 : 'bg-green-500 hover:bg-green-600' // Available seats are green
//                             }
//                             ${selectedSeatIds.includes(seat.id) ? 'scale-110' : ''} {/* Scale up for selected seats */}
//                             transition-all duration-200 ease-in-out`}
//                           onClick={() => handleSeatClick(seat.id, seat.status)}
//                           disabled={seat.status === 'BOOKED' || bookingLoading}
//                           title={seat.status === 'BOOKED' ? 'Booked' : `Row ${seat.seatRow}, Seat ${seat.seatColumn}`}
//                         >
//                           {seat.seatColumn}
//                         </button>
//                       ))}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg">
//           <div className="text-lg font-semibold">
//             Selected Seats: {selectedSeatIds.length}
//           </div>
//           <div className="text-xl font-bold">
//             Total: ₹{calculateTotalPrice().toFixed(2)}
//           </div>
//           <button
//             onClick={handleConfirmBooking}
//             className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
//             disabled={selectedSeatIds.length === 0 || bookingLoading || loading || !isAuthenticated}
//           >
//             {bookingLoading ? 'Booking...' : `Confirm Booking (${selectedSeatIds.length})`}
//           </button>
//         </div>
//         <div className="flex justify-center mt-4 text-sm gap-4">
//           <div className="flex items-center">
//             <span className="w-4 h-4 bg-green-500 rounded-sm mr-2"></span> Available
//           </div>
//           <div className="flex items-center">
//             <span className="w-4 h-4 bg-red-500 rounded-sm mr-2"></span> Booked
//           </div>
//           <div className="flex items-center">
//             <span className="w-4 h-4 bg-blue-600 rounded-sm mr-2"></span> Selected
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SeatSelectionModal;



// src/components/SeatSelectionModal.jsx
import React, { useState, useEffect } from 'react';
import { getShowSeats, createBooking } from '../api';
import { useAuth } from '../context/AuthContext';

const SeatSelectionModal = ({ show, onClose, onSuccess }) => {
  const { token, isAuthenticated } = useAuth();
  const [showSeats, setShowSeats] = useState([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState(null);

  useEffect(() => {
    const fetchSeats = async () => {
      setLoading(true);
      setError(null);
      if (!isAuthenticated || !token) {
        setError('Authentication required to select seats.');
        setLoading(false);
        return;
      }
      // CRITICAL CHECK: Ensure show.id exists before fetching seats
      if (!show?.id) {
        setError('Show ID is missing. Cannot load seats.');
        setLoading(false);
        return;
      }
      try {
        const data = await getShowSeats(show.id, token);
        setShowSeats(data);
      } catch (err) {
        console.error('Error fetching show seats:', err);
        setError(err.message || 'Failed to load seats.');
      } finally {
        setLoading(false);
      }
    };

    if (show && show.id) { // Only fetch if show and show.id are available
      fetchSeats();
    }
  }, [show, token, isAuthenticated]);

  const handleSeatClick = (seatId, seatStatus) => {
    if (seatStatus === 'BOOKED') {
      return;
    }
    if (selectedSeatIds.includes(seatId)) {
      setSelectedSeatIds(selectedSeatIds.filter((id) => id !== seatId));
    } else {
      setSelectedSeatIds([...selectedSeatIds, seatId]);
    }
  };

  const handleConfirmBooking = async () => {
    if (selectedSeatIds.length === 0) {
      setBookingError('Please select at least one seat.');
      return;
    }
    if (!isAuthenticated || !token) {
      setBookingError('You must be logged in to book tickets.');
      return;
    }
    // CRITICAL CHECK: Ensure show.id is available at the moment of booking
    if (!show?.id) {
      setBookingError('Show information is incomplete. Please try again.');
      console.error('Booking failed: Show ID is missing during confirmation.');
      return;
    }

    setBookingLoading(true);
    setBookingError(null);

    // --- CONSOLE LOGS FOR DEBUGGING (KEEP THESE FOR INITIAL TESTING) ---
    console.log("DEBUG: Attempting to book...");
    console.log("DEBUG: show.id:", show.id);
    console.log("DEBUG: selectedSeatIds:", selectedSeatIds);
    console.log("DEBUG: token exists:", !!token);
    // --- END DEBUG LOGS ---

    try {
      // This call passes selectedSeatIds which api.js will now map to 'seatIds' in the payload
      const bookingResponse = await createBooking(selectedSeatIds, show.id, token);
      console.log('Booking successful:', bookingResponse);
      onSuccess();
    } catch (err) {
      console.error('Booking error:', err);
      // Display the specific error message from the backend
      setBookingError(err.message || 'Failed to create booking.');
    } finally {
      setBookingLoading(false);
    }
  };

  const calculateTotalPrice = () => {
    return selectedSeatIds.length * (show?.price || 0); // Defensive: handle if show.price is undefined
  };

  // Primary guard for the 'show' prop
  if (!show) {
    return null; // Render nothing if show prop is missing or not yet loaded
  }

  // Group seats by row for rendering
  const groupedSeats = showSeats.reduce((acc, seat) => {
    if (!acc[seat.seatRow]) {
      acc[seat.seatRow] = [];
    }
    acc[seat.seatRow].push(seat);
    return acc;
  }, {});

  const sortedRows = Object.keys(groupedSeats).sort();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-2 sm:p-4 z-50"> {/* Added responsive padding */}
      <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 w-full max-w-sm sm:max-w-lg md:max-w-2xl relative"> {/* Added responsive max-width and padding */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 text-gray-500 hover:text-gray-800 text-xl sm:text-2xl font-bold" // Responsive size and position
        >
          &times;
        </button>
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-4 sm:mb-6">Select Your Seats</h2> {/* Responsive text size and margin */}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded relative mb-3 sm:mb-4 text-sm sm:text-base"> {/* Responsive padding and text size */}
            <p>{error}</p>
          </div>
        )}
        {bookingError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded relative mb-3 sm:mb-4 text-sm sm:text-base"> {/* Responsive padding and text size */}
            <p>{bookingError}</p>
          </div>
        )}

        <div className="mb-4 text-center">
          {/* Defensive optional chaining for nested properties */}
          <p className="text-lg sm:text-xl font-semibold text-gray-800">{show.movie?.title || 'Loading Movie...'}</p> {/* Responsive text size */}
          <p className="text-sm sm:text-base text-gray-600">{show.theatre?.name || 'Loading Theatre...'} - {show.screen?.name || 'Loading Screen...'}</p> {/* Responsive text size */}
          <p className="text-sm sm:text-base text-gray-600">{new Date(show.showTime).toLocaleString()}</p> {/* Responsive text size */}
          <p className="text-base sm:text-lg font-bold text-green-700">Price per seat: ₹{show.price?.toFixed(2) || 'N/A'}</p> {/* Responsive text size */}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-4 border-b-4 border-blue-500"></div> {/* Responsive spinner size */}
            <p className="ml-2 sm:ml-4 text-gray-600 text-sm sm:text-base">Loading seats...</p> {/* Responsive text size */}
          </div>
        ) : (
          <div className="max-h-80 sm:max-h-96 overflow-y-auto mb-4 sm:mb-6 p-2 border rounded-md bg-gray-50"> {/* Responsive max-height and margin */}
            <div className="text-center text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-700">Screen This Way</div> {/* Responsive text size and margin */}
            <div className="bg-gray-700 h-1 sm:h-2 w-full mb-4 sm:mb-6 rounded"></div> {/* Responsive height and margin */}

            <div className="flex flex-col items-center">
              {sortedRows.map((row) => (
                <div key={row} className="flex items-start mb-1 sm:mb-2 w-full justify-center"> {/* Responsive margin */}
                  <span className="font-bold mr-1 sm:mr-2 w-4 sm:w-6 text-right mt-1 sm:mt-2 text-sm sm:text-base">{row}</span> {/* Responsive size and margin */}
                  <div className="flex flex-wrap gap-0.5 sm:gap-1 max-w-full justify-center"> {/* Responsive gap and max-width */}
                    {groupedSeats[row]
                      .sort((a, b) => a.seatColumn - b.seatColumn)
                      .map((seat) => (
                        <button
                          key={seat.id}
                          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-md text-white font-bold text-xs sm:text-sm flex items-center justify-center
                            ${seat.status === 'BOOKED'
                              ? 'bg-red-500 cursor-not-allowed'
                              : selectedSeatIds.includes(seat.id)
                                ? 'bg-blue-600 hover:bg-blue-700'
                                : 'bg-green-500 hover:bg-green-600'
                            }
                            ${selectedSeatIds.includes(seat.id) ? 'scale-110' : ''}
                            transition-all duration-200 ease-in-out`}
                          onClick={() => handleSeatClick(seat.id, seat.status)}
                          disabled={seat.status === 'BOOKED' || bookingLoading}
                          title={seat.status === 'BOOKED' ? 'Booked' : `Row ${seat.seatRow}, Seat ${seat.seatColumn}`}
                        >
                          {seat.seatColumn}
                        </button>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-100 p-3 sm:p-4 rounded-lg mt-4 sm:mt-0"> {/* Responsive flex direction, padding and margin */}
          <div className="text-base sm:text-lg font-semibold mb-2 sm:mb-0"> {/* Responsive text size and margin */}
            Selected Seats: {selectedSeatIds.length}
          </div>
          <div className="text-lg sm:text-xl font-bold mb-2 sm:mb-0"> {/* Responsive text size and margin */}
            Total: ₹{calculateTotalPrice().toFixed(2)}
          </div>
          <button
            onClick={handleConfirmBooking}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 text-sm sm:text-base" // Responsive padding and text size
            disabled={selectedSeatIds.length === 0 || bookingLoading || loading || !isAuthenticated}
          >
            {bookingLoading ? 'Booking...' : `Confirm Booking (${selectedSeatIds.length})`}
          </button>
        </div>
        <div className="flex justify-center mt-3 sm:mt-4 text-xs sm:text-sm gap-2 sm:gap-4"> {/* Responsive text size and gap */}
          <div className="flex items-center">
            <span className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-sm mr-1 sm:mr-2"></span> Available {/* Responsive size and margin */}
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-sm mr-1 sm:mr-2"></span> Booked
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-600 rounded-sm mr-1 sm:mr-2"></span> Selected
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelectionModal;