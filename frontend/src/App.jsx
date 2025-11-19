import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Homepage from './pages/Homepage';
<<<<<<< HEAD
import Events from './pages/Events';
import Artists from './pages/Artists';
import About from './pages/About';
import EventDetails from './pages/EventDetails';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOtp from './pages/VerifyOtp';
import ResetPassword from './pages/ResetPassword';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
=======
import EventDetails from './pages/EventDetails';
import BookingPage from './pages/BookingPage';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
>>>>>>> 7df5785370399dba91a4613466a0805dde142abf

function App() {
  return (
    <Router>
      <AuthProvider>
<<<<<<< HEAD
        <div className="min-h-screen bg-dark-900">
          <Navbar />
          <div className="h-16" />
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/events" element={<Events />} />
            <Route path="/artists" element={<Artists />} />
            <Route path="/about" element={<About />} />
            <Route path="/event/:id" element={<EventDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot" element={<ForgotPassword />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
=======
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
          <Navbar />
          <main className="min-h-screen">
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/event/:id" element={<EventDetails />} />
              <Route path="/booking/:eventId" element={
                <ProtectedRoute>
                  <BookingPage />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute adminOnly={true}>
                  <AdminPanel />
                </ProtectedRoute>
              } />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </main>
>>>>>>> 7df5785370399dba91a4613466a0805dde142abf
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
