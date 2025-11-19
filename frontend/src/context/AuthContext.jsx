import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

<<<<<<< HEAD
// Initialize axios defaults synchronously
axios.defaults.baseURL = 'http://localhost:5000';
const initialToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
if (initialToken) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${initialToken}`;
}

=======
>>>>>>> 7df5785370399dba91a4613466a0805dde142abf
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
<<<<<<< HEAD
  const [token, setToken] = useState(initialToken);

  // Set up axios defaults
  useEffect(() => {
    axios.defaults.baseURL = 'http://localhost:5000';
  }, []);

  useEffect(() => {
=======
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Set up axios defaults
  useEffect(() => {
>>>>>>> 7df5785370399dba91a4613466a0805dde142abf
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

<<<<<<< HEAD
  // Ensure Authorization header is always attached using latest token
  useEffect(() => {
    const reqId = axios.interceptors.request.use((config) => {
      const t = token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
      if (t) {
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${t}`;
      }
      return config;
    });
    return () => {
      axios.interceptors.request.eject(reqId);
    };
  }, [token]);

=======
>>>>>>> 7df5785370399dba91a4613466a0805dde142abf
  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await axios.get('http://localhost:5000/api/auth/me');
          setUser(response.data.user);
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };
<<<<<<< HEAD
    checkAuth();
  }, [token]);

  const forgotPassword = async (email) => {
    try {
      await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      return { success: true, message: 'OTP sent to email if it exists' };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send OTP';
      return { success: false, message };
    }
  };

  const verifyOtp = async ({ email, otp }) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/verify-otp', { email, otp });
      return { success: true, message: res.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'OTP verification failed';
      return { success: false, message };
    }
  };

  const resetPassword = async ({ email, otp, password }) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/reset-password', { email, otp, password });
      return { success: true, message: res.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Password reset failed';
      return { success: false, message };
    }
  };

  const googleLogin = async (idToken) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/google', { idToken });
      const { token: newToken, user: newUser } = response.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(newUser);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Google login failed';
      return { success: false, message };
    }
  };

=======

    checkAuth();
  }, [token]);

>>>>>>> 7df5785370399dba91a4613466a0805dde142abf
  const signup = async (userData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', userData);
      
      // Don't automatically log in after signup
      return { success: true, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Signup failed';
      return { success: false, message };
    }
  };

  const login = async (credentials) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', credentials);
      const { token: newToken, user: newUser } = response.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(newUser);
      
      return { success: true, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put('http://localhost:5000/api/auth/profile', profileData);
      setUser(response.data.user);
      return { success: true, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      return { success: false, message };
    }
  };

<<<<<<< HEAD
  const changePassword = async ({ currentPassword, newPassword }) => {
    try {
      const res = await axios.put('http://localhost:5000/api/auth/password', { currentPassword, newPassword });
      return { success: true, message: res.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Password update failed';
      return { success: false, message };
    }
  };

  const getBookings = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/bookings');
      return { success: true, bookings: res.data.bookings || [] };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to load bookings';
      return { success: false, message, bookings: [] };
    }
  };

=======
>>>>>>> 7df5785370399dba91a4613466a0805dde142abf
  const value = {
    user,
    loading,
    signup,
    login,
<<<<<<< HEAD
    forgotPassword,
    verifyOtp,
    resetPassword,
    googleLogin,
    logout,
    updateProfile,
    changePassword,
    getBookings,
=======
    logout,
    updateProfile,
>>>>>>> 7df5785370399dba91a4613466a0805dde142abf
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
