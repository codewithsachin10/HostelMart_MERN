// client/src/pages/AuthCallbackPage.js
import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

function AuthCallbackPage() {
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Get the token and user data from the URL
    const token = searchParams.get('token');
    const userParam = searchParams.get('user');

    if (token && userParam) {
      try {
        // 2. Parse the user data
        const user = JSON.parse(decodeURIComponent(userParam));
        
        // 3. Log the user in using our AuthContext
        // This will save the token/user and navigate to /products
        login(user, token);
        
      } catch (error) {
        console.error('Failed to parse user data from URL', error);
        navigate('/'); // On error, send back to login
      }
    } else {
      // If no token, something went wrong
      console.error('Google auth callback missing token or user');
      navigate('/');
    }
  }, [login, searchParams, navigate]);

  // Show a loading spinner while we process
  return <LoadingSpinner />;
}

export default AuthCallbackPage;