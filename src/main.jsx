// src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* BrowserRouter must wrap everything that uses routing */}
    <BrowserRouter>
      {/* AuthProvider must wrap everything that uses authentication context */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)