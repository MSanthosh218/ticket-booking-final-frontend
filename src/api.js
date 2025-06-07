// src/api.js
const API_BASE_URL = 'https://booking-tickets-backend-5.onrender.com/api'; // Your backend server URL

// Helper function to make authenticated requests
const request = async (method, url, data = null, token = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
    body: data ? JSON.stringify(data) : null,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, config);
    const responseData = await response.json();

    if (!response.ok) {
      // If response is not OK (e.g., 4xx, 5xx), throw an error with the message from the backend
      throw new Error(responseData.message || responseData.error || 'Something went wrong');
    }

    return responseData;
  } catch (error) {
    console.error(`API Error (${method} ${url}):`, error);
    throw error; // Re-throw to be caught by calling component
  }
};

// --- Authentication Endpoints ---
export const registerUser = (userData) => request('POST', '/auth/register', userData);
export const loginUser = (credentials) => request('POST', '/auth/login', credentials);

// --- User Endpoints (ADD THESE FOR ADMIN DASHBOARD) ---
export const getAllUsers = (token) => request('GET', '/users', null, token);
export const deleteUser = (id, token) => request('DELETE', `/users/${id}`, null, token);

// --- Movie Endpoints ---
export const createMovie = (movieData, token) => request('POST', '/movies', movieData, token);
export const getAllMovies = () => request('GET', '/movies');
export const getMovieById = (id) => request('GET', `/movies/${id}`);
export const deleteMovie = (id, token) => request('DELETE', `/movies/${id}`, null, token);
export const updateMovie = (id, movieData, token) => request('PUT', `/movies/${id}`, movieData, token);


// --- Theatre Endpoints ---
export const createTheatre = (theatreData, token) => request('POST', '/theatres', theatreData, token);
export const getAllTheatres = () => request('GET', '/theatres'); // Publicly accessible
export const getOwnerTheatres = (token) => request('GET', '/theatres/my', null, token);
export const deleteTheatre = (id, token) => request('DELETE', `/theatres/${id}`, null, token);
export const getTheatreById = (id) => request('GET', `/theatres/${id}`); // Added for EditTheatrePage
export const updateTheatre = (id, theatreData, token) => request('PUT', `/theatres/${id}`, theatreData, token);


// --- Screen Endpoints ---
export const createScreen = (screenData, token) => request('POST', '/screens', screenData, token);
export const getScreensByTheatre = (theatreId) => request('GET', `/screens/theatres/${theatreId}`);
export const getScreenById = (id) => request('GET', `/screens/${id}`);
export const updateScreen = (id, screenData, token) => request('PUT', `/screens/${id}`, screenData, token);
export const deleteScreen = (id, token) => request('DELETE', `/screens/${id}`, null, token);

// --- Show Endpoints ---
export const createShow = (showData, token) => request('POST', '/shows', showData, token);
export const getAllShows = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return request('GET', `/shows${query ? `?${query}` : ''}`);
};
export const getShowById = (id) => request('GET', `/shows/${id}`);
export const updateShow = (id, showData, token) => request('PUT', `/shows/${id}`, showData, token);
export const deleteShow = (id, token) => request('DELETE', `/shows/${id}`, null, token);

// --- ShowSeat Endpoints ---
export const getShowSeats = (showId, token) => request('GET', `/shows/${showId}/seats`, null, token);

// --- Booking Endpoints ---
export const createBooking = (selectedSeatIds, showId, token) => request('POST', '/bookings', { showId, seatIds: selectedSeatIds }, token);
export const getUserBookings = (token) => request('GET', '/bookings', null, token);
export const updateBooking = (id, bookingData, token) => request('PUT', `/bookings/${id}`, bookingData, token);
export const cancelBooking = (id, token) => request('DELETE', `/bookings/${id}`, null, token);