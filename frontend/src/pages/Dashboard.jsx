<<<<<<< HEAD
import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, loading: authLoading, isAuthenticated, getBookings, updateProfile, changePassword } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' | 'profile'
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [pwd, setPwd] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [msg, setMsg] = useState({ type: '', text: '' });

  const greetingName = useMemo(() => user?.name || user?.email?.split('@')[0] || 'User', [user]);

  useEffect(() => {
    if (user) {
      setProfile({ name: user.name || '', email: user.email || '' });
    }
  }, [user]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (authLoading || !isAuthenticated) return;
      setLoading(true);
      const res = await getBookings();
      if (mounted) {
        if (res.success) setBookings(res.bookings || []);
        setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [authLoading, isAuthenticated, getBookings]);

  const onSaveProfile = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    const res = await updateProfile({ name: profile.name, email: profile.email });
    setMsg({ type: res.success ? 'success' : 'error', text: res.message });
  };

  const onChangePassword = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    if (!pwd.currentPassword || !pwd.newPassword) {
      setMsg({ type: 'error', text: 'Please fill all password fields' });
      return;
    }
    if (pwd.newPassword !== pwd.confirmPassword) {
      setMsg({ type: 'error', text: 'New password and confirm password do not match' });
      return;
    }
    const res = await changePassword({ currentPassword: pwd.currentPassword, newPassword: pwd.newPassword });
    setMsg({ type: res.success ? 'success' : 'error', text: res.message });
    if (res.success) setPwd({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const downloadReceipt = (b) => {
    try {
      const w = window.open('', 'PRINT', 'height=700,width=800');
      if (!w) return;
      w.document.write('<html><head><title>Receipt</title></head><body style="font-family: Arial, sans-serif; padding:20px;">');
      w.document.write(`<h2 style="margin-top:0;">ConcertHub - Booking Receipt</h2>`);
      w.document.write(`<p><strong>Event:</strong> ${b.eventTitle}</p>`);
      w.document.write(`<p><strong>Date & Time:</strong> ${new Date(b.date).toLocaleDateString()} ${b.time || ''}</p>`);
      w.document.write(`<p><strong>Venue:</strong> ${b.venueName}${b.venueCity ? ', ' + b.venueCity : ''}</p>`);
      w.document.write(`<p><strong>Ticket:</strong> ${b.quantity} x ${b.ticketType}</p>`);
      w.document.write(`<p><strong>Total Paid:</strong> $${(b.totalAmount || 0).toFixed ? b.totalAmount.toFixed(2) : b.totalAmount}</p>`);
      w.document.write(`<p><strong>Buyer:</strong> ${profile.name} (${profile.email})</p>`);
      w.document.write('</body></html>');
      w.document.close();
      w.focus();
      w.print();
      w.close();
    } catch (e) {
      // no-op
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading...</div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-8 text-center">
          <h1 className="text-2xl font-bold mb-2">Please sign in</h1>
          <p className="text-gray-300 mb-4">You need to be logged in to view your dashboard.</p>
          <Link to="/login" className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-md font-medium">Go to Login</Link>
        </div>
=======
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
>>>>>>> 7df5785370399dba91a4613466a0805dde142abf
      </div>
    );
  }

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {greetingName}!</h1>
        <p className="text-gray-300 mb-8">Manage your bookings and profile settings.</p>

        <div className="border-b border-gray-800 mb-6">
          <nav className="flex gap-4">
            <button
              className={`px-3 py-2 border-b-2 ${activeTab==='bookings' ? 'border-blue-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
              onClick={() => setActiveTab('bookings')}
            >Bookings</button>
            <button
              className={`px-3 py-2 border-b-2 ${activeTab==='profile' ? 'border-blue-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
              onClick={() => setActiveTab('profile')}
            >Profile Settings</button>
          </nav>
        </div>

        {msg.text && (
          <div className={`mb-6 rounded-md px-4 py-3 ${msg.type==='success' ? 'bg-green-900/30 text-green-300 border border-green-700' : 'bg-red-900/30 text-red-300 border border-red-700'}`}>
            {msg.text}
          </div>
        )}

        {activeTab === 'bookings' && (
          <section>
            {loading ? (
              <div className="text-gray-300">Loading your bookings...</div>
            ) : bookings.length === 0 ? (
              <div className="text-gray-400">No bookings yet.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookings.map((b, idx) => (
                  <div key={idx} className="bg-gray-800/60 border border-gray-700 rounded-lg p-5 flex flex-col justify-between">
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold">{b.eventTitle}</h3>
                      <p className="text-gray-300"><span className="text-gray-400">Date & Venue:</span> {b.date ? new Date(b.date).toLocaleDateString() : ''} • {b.venueName}{b.venueCity ? ', ' + b.venueCity : ''}</p>
                      <p className="text-gray-300"><span className="text-gray-400">Ticket:</span> {b.ticketType} × {b.quantity}</p>
                      <p className="text-gray-300"><span className="text-gray-400">Amount:</span> ${b.totalAmount?.toFixed ? b.totalAmount.toFixed(2) : b.totalAmount}</p>
                    </div>
                    <div className="pt-4">
                      <button onClick={() => downloadReceipt(b)} className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium">Download Receipt</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'profile' && (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <form onSubmit={onSaveProfile} className="bg-gray-800/60 border border-gray-700 rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-bold">Profile</h2>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="pt-2">
                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-md font-medium">Save Changes</button>
              </div>
            </form>

            <form onSubmit={onChangePassword} className="bg-gray-800/60 border border-gray-700 rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-bold">Change Password</h2>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Current Password</label>
                <input
                  type="password"
                  value={pwd.currentPassword}
                  onChange={(e) => setPwd({ ...pwd, currentPassword: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">New Password</label>
                  <input
                    type="password"
                    value={pwd.newPassword}
                    onChange={(e) => setPwd({ ...pwd, newPassword: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    value={pwd.confirmPassword}
                    onChange={(e) => setPwd({ ...pwd, confirmPassword: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="pt-2">
                <button type="submit" className="bg-gray-700 hover:bg-gray-600 text-white px-5 py-2 rounded-md font-medium">Update Password</button>
              </div>
            </form>
          </section>
        )}
=======
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
>>>>>>> 7df5785370399dba91a4613466a0805dde142abf
      </div>
    </div>
  );
};

export default Dashboard;
