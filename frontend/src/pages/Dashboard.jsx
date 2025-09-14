import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  Ticket, 
  User, 
  Download,
  X,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [cancellingBooking, setCancellingBooking] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [bookingsResponse, statsResponse] = await Promise.all([
        axios.get('http://localhost:5000/api/bookings/my-bookings'),
        axios.get('http://localhost:5000/api/users/dashboard')
      ]);

      setBookings(bookingsResponse.data);
      setStats(statsResponse.data.stats);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    setCancellingBooking(bookingId);
    try {
      await axios.patch(`http://localhost:5000/api/bookings/${bookingId}/cancel`);
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking. Please try again.');
    } finally {
      setCancellingBooking(null);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'cancelled':
        return <X className="h-5 w-5 text-red-400" />;
      case 'attended':
        return <CheckCircle className="h-5 w-5 text-blue-400" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-400 bg-green-400/20';
      case 'cancelled':
        return 'text-red-400 bg-red-400/20';
      case 'attended':
        return 'text-blue-400 bg-blue-400/20';
      default:
        return 'text-yellow-400 bg-yellow-400/20';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 px-4">
      <div className="max-w-7xl mx-auto py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, <span className="text-purple-400">{user?.name}</span>
          </h1>
          <p className="text-gray-400">Manage your tickets and view your booking history</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Bookings</p>
                <p className="text-3xl font-bold text-white">{stats.totalBookings || 0}</p>
              </div>
              <Ticket className="h-12 w-12 text-purple-400" />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Confirmed Tickets</p>
                <p className="text-3xl font-bold text-white">{stats.confirmedBookings || 0}</p>
              </div>
              <CheckCircle className="h-12 w-12 text-green-400" />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Upcoming Events</p>
                <p className="text-3xl font-bold text-white">{stats.upcomingEvents || 0}</p>
              </div>
              <Calendar className="h-12 w-12 text-blue-400" />
            </div>
          </div>
        </motion.div>

        {/* Bookings List */}
        <motion.div
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">My Bookings</h2>

          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <Ticket className="h-16 w-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No bookings yet</h3>
              <p className="text-gray-500 mb-6">Start exploring events and book your first ticket!</p>
              <button
                onClick={() => window.location.href = '/'}
                className="btn-primary"
              >
                Browse Events
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <motion.div
                  key={booking._id}
                  className="bg-black/20 rounded-xl p-6 border border-white/10"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start space-x-4 mb-4 lg:mb-0">
                      <img
                        src={booking.eventId?.poster || '/placeholder-event.jpg'}
                        alt={booking.eventId?.title}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-semibold text-white">
                            {booking.eventId?.title}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center ${getStatusColor(booking.bookingStatus)}`}>
                            {getStatusIcon(booking.bookingStatus)}
                            <span className="ml-1 capitalize">{booking.bookingStatus}</span>
                          </span>
                        </div>
                        
                        <div className="space-y-1 text-gray-400 text-sm">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            {booking.eventId?.date && format(new Date(booking.eventId.date), 'EEEE, MMMM dd, yyyy')}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            {booking.eventId?.venue?.name}
                          </div>
                          <div className="flex items-center">
                            <Ticket className="h-4 w-4 mr-2" />
                            {booking.ticketType} × {booking.quantity}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col lg:items-end space-y-3">
                      <div className="text-right">
                        <p className="text-gray-400 text-sm">Booking ID</p>
                        <p className="text-white font-mono text-sm">{booking.bookingId}</p>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-gray-400 text-sm">Total Paid</p>
                        <p className="text-2xl font-bold text-purple-400">${booking.totalPrice}</p>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          className="btn-secondary text-sm px-4 py-2 flex items-center"
                          onClick={() => window.open(`data:text/plain;charset=utf-8,Booking ID: ${booking.bookingId}\nEvent: ${booking.eventId?.title}\nQR Code: ${booking.qrCode}`, '_blank')}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </button>
                        
                        {booking.bookingStatus === 'confirmed' && booking.canCancel && (
                          <button
                            onClick={() => handleCancelBooking(booking._id)}
                            disabled={cancellingBooking === booking._id}
                            className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center"
                          >
                            {cancellingBooking === booking._id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                            ) : (
                              <X className="h-4 w-4 mr-1" />
                            )}
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {booking.qrCode && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <p className="text-gray-400 text-sm mb-2">QR Code for Entry:</p>
                      <div className="bg-white p-4 rounded-lg inline-block">
                        <img 
                          src={booking.qrCode} 
                          alt="QR Code" 
                          className="w-32 h-32"
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
