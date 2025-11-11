// client/src/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react'; // 👈 IMPORT useEffect
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 👈 Add loading state
  const navigate = useNavigate();

  // --- 👇 NEW: Check for token on app load ---
  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        // Here, you'd normally verify the token with the backend
        // For now, we'll just trust it
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to load user from localStorage", error);
      // Clear storage if data is corrupt
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    setLoading(false); // Done loading
  }, []);

  // Login function
  const login = (userData, token) => { // 👈 MODIFIED: now accepts token
    setUser(userData);
    localStorage.setItem('token', token); // 👈 SAVE TOKEN
    localStorage.setItem('user', JSON.stringify(userData)); // 👈 SAVE USER
    navigate('/products'); 
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('token'); // 👈 REMOVE TOKEN
    localStorage.removeItem('user'); // 👈 REMOVE USER
    navigate('/'); 
  };

  // Don't render the app until we've checked for a user
  if (loading) {
    return null; // Or return a full-page loading spinner
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}