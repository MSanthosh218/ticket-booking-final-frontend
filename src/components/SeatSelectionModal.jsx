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
    return selectedSeatIds.length * show.price;
  };

  if (!show) {
    return null; // Or some placeholder/error if show prop is missing
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
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-bold"
        >
          &times;
        </button>
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Select Your Seats</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <p>{error}</p>
          </div>
        )}
        {bookingError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <p>{bookingError}</p>
          </div>
        )}

        <div className="mb-4 text-center">
          <p className="text-xl font-semibold text-gray-800">{show.movie?.title}</p>
          <p className="text-md text-gray-600">{show.theatre?.name} - {show.screen?.name}</p>
          <p className="text-md text-gray-600">{new Date(show.showTime).toLocaleString()}</p>
          <p className="text-lg font-bold text-green-700">Price per seat: ₹{show.price.toFixed(2)}</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
            <p className="ml-4 text-gray-600">Loading seats...</p>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto mb-6 p-2 border rounded-md bg-gray-50">
            <div className="text-center text-lg font-semibold mb-4 text-gray-700">Screen This Way</div>
            <div className="bg-gray-700 h-2 w-full mb-6 rounded"></div>

            <div className="flex justify-center flex-wrap gap-x-2 gap-y-4">
              {sortedRows.map((row) => (
                <div key={row} className="flex items-center mb-2">
                  <span className="font-bold mr-2 w-6 text-right">{row}</span>
                  <div className="flex gap-1">
                    {groupedSeats[row]
                      .sort((a, b) => a.seatColumn - b.seatColumn)
                      .map((seat) => (
                        <button
                          key={seat.id}
                          className={`w-10 h-10 rounded-md text-white font-bold text-sm flex items-center justify-center
                            ${seat.status === 'BOOKED' ? 'bg-red-500 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}
                            ${selectedSeatIds.includes(seat.id) ? 'border-4 border-blue-400 scale-110' : ''}
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

        <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg">
          <div className="text-lg font-semibold">
            Selected Seats: {selectedSeatIds.length}
          </div>
          <div className="text-xl font-bold">
            Total: ₹{calculateTotalPrice().toFixed(2)}
          </div>
          <button
            onClick={handleConfirmBooking}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
            disabled={selectedSeatIds.length === 0 || bookingLoading || loading || !isAuthenticated}
          >
            {bookingLoading ? 'Booking...' : `Confirm Booking (${selectedSeatIds.length})`}
          </button>
        </div>
        <div className="flex justify-center mt-4 text-sm gap-4">
          <div className="flex items-center">
            <span className="w-4 h-4 bg-green-500 rounded-sm mr-2"></span> Available
          </div>
          <div className="flex items-center">
            <span className="w-4 h-4 bg-red-500 rounded-sm mr-2"></span> Booked
          </div>
          <div className="flex items-center">
            <span className="w-4 h-4 bg-blue-400 border-2 border-blue-600 rounded-sm mr-2"></span> Selected
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelectionModal;