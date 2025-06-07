// // frontend/src/pages/RegisterPage.jsx
// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// const RegisterPage = () => {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [role, setRole] = useState('CUSTOMER'); // Default role
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const { register } = useAuth();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     setLoading(true);

//     try {
//       const result = await register(name, email, password, role);

//       if (result.success) {
//         navigate('/');
//       } else {
//         setError(result.error || 'Registration failed. Please try again.');
//       }
//     } catch (err) {
//       console.error('Registration error:', err);
//       setError('An unexpected error occurred during registration.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
//       <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
//         <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Register</h2>
//         {error && <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</p>}
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
//               Name
//             </label>
//             <input
//               type="text"
//               id="name"
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
//               Email
//             </label>
//             <input
//               type="email"
//               id="email"
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>
//           <div className="mb-6">
//             <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>
//           <div className="mb-6">
//             <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-2">
//               Register As
//             </label>
//             <select
//               id="role"
//               className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
//               value={role}
//               onChange={(e) => setRole(e.target.value)}
//             >
//               <option value="CUSTOMER">Customer</option>
//               <option value="OWNER">Theatre Owner</option>
//             </select>
//           </div>
//           <div className="flex items-center justify-between">
//             <button
//               type="submit"
//               className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
//               disabled={loading}
//             >
//               {loading ? 'Registering...' : 'Register'}
//             </button>
//           </div>
//         </form>
//         <p className="text-center text-gray-600 text-sm mt-4">
//           Already have an account?{' '}
//           <Link to="/login" className="text-blue-600 hover:text-blue-800 font-bold">
//             Login here
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default RegisterPage;
// frontend/src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('CUSTOMER'); // Default role
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await register(name, email, password, role);

      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('An unexpected error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 sm:p-6"> {/* Responsive padding */}
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-sm sm:max-w-md"> {/* Responsive padding and max-width */}
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6 text-gray-800">Register</h2> {/* Responsive text size and margin */}
        {error && <p className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded relative mb-4 text-sm sm:text-base">{error}</p>} {/* Responsive padding and text size */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 text-sm sm:text-base font-bold mb-2"> {/* Responsive text size */}
              Name
            </label>
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
            <label htmlFor="email" className="block text-gray-700 text-sm sm:text-base font-bold mb-2"> {/* Responsive text size */}
              Email
            </label>
            <input
              type="email"
              id="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm sm:text-base" /* Responsive text size */
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm sm:text-base font-bold mb-2"> {/* Responsive text size */}
              Password
            </label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline text-sm sm:text-base" /* Responsive text size */
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="role" className="block text-gray-700 text-sm sm:text-base font-bold mb-2"> {/* Responsive text size */}
              Register As
            </label>
            <select
              id="role"
              className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline text-sm sm:text-base" /* Responsive padding and text size */
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="CUSTOMER">Customer</option>
              <option value="OWNER">Theatre Owner</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full text-base sm:text-lg" /* Responsive padding and text size */
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>
        <p className="text-center text-gray-600 text-xs sm:text-sm mt-3 sm:mt-4"> {/* Responsive text size and margin */}
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-800 font-bold">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;