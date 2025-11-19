import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Calendar, 
  DollarSign,
  Ticket,
  Eye,
  Search,
  Filter
} from 'lucide-react';
import { format } from 'date-fns';
import axios from 'axios';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    duration: '',
    venue: {
      name: '',
      address: '',
      capacity: ''
    },
    artists: [{ name: '', genre: '', image: '' }],
    ticketTypes: [
      { type: 'Regular', price: '', total: '', available: '', features: [] },
      { type: 'VIP', price: '', total: '', available: '', features: [] },
      { type: 'Backstage Pass', price: '', total: '', available: '', features: [] }
    ],
    poster: '',
    category: 'Concert',
    featured: false
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [eventsRes, bookingsRes, usersRes, statsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/events'),
        axios.get('http://localhost:5000/api/bookings'),
        axios.get('http://localhost:5000/api/users'),
        axios.get('http://localhost:5000/api/bookings/stats/overview')
      ]);

      setEvents(eventsRes.data.events || eventsRes.data);
      setBookings(bookingsRes.data.bookings || bookingsRes.data);
      setUsers(usersRes.data.users || usersRes.data);
      setStats(statsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setLoading(false);
    }
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        await axios.put(`http://localhost:5000/api/events/${editingEvent._id}`, eventForm);
      } else {
        await axios.post('http://localhost:5000/api/events', eventForm);
      }
      setShowEventModal(false);
      setEditingEvent(null);
      resetEventForm();
      fetchDashboardData();
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await axios.delete(`http://localhost:5000/api/events/${eventId}`);
        fetchDashboardData();
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const resetEventForm = () => {
    setEventForm({
      title: '',
      description: '',
      date: '',
      duration: '',
      venue: { name: '', address: '', capacity: '' },
      artists: [{ name: '', genre: '', image: '' }],
      ticketTypes: [
        { type: 'Regular', price: '', total: '', available: '', features: [] },
        { type: 'VIP', price: '', total: '', available: '', features: [] },
        { type: 'Backstage Pass', price: '', total: '', available: '', features: [] }
      ],
      poster: '',
      category: 'Concert',
      featured: false
    });
  };

  const openEditModal = (event) => {
    setEditingEvent(event);
    setEventForm({
      ...event,
      date: event.date ? new Date(event.date).toISOString().split('T')[0] : ''
    });
    setShowEventModal(true);
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
          <h1 className="text-4xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-gray-400">Manage events, bookings, and users</p>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-white/10 backdrop-blur-md rounded-xl p-1">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: DollarSign },
            { id: 'events', label: 'Events', icon: Calendar },
            { id: 'bookings', label: 'Bookings', icon: Ticket },
            { id: 'users', label: 'Users', icon: Users }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <tab.icon className="h-5 w-5 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Revenue</p>
                    <p className="text-3xl font-bold text-white">${stats.totalRevenue || 0}</p>
                  </div>
                  <DollarSign className="h-12 w-12 text-green-400" />
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Bookings</p>
                    <p className="text-3xl font-bold text-white">{stats.totalBookings || 0}</p>
                  </div>
                  <Ticket className="h-12 w-12 text-blue-400" />
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Active Events</p>
                    <p className="text-3xl font-bold text-white">{events.length}</p>
                  </div>
                  <Calendar className="h-12 w-12 text-purple-400" />
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Users</p>
                    <p className="text-3xl font-bold text-white">{users.length}</p>
                  </div>
                  <Users className="h-12 w-12 text-orange-400" />
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Recent Bookings</h3>
              <div className="space-y-4">
                {bookings.slice(0, 5).map((booking) => (
                  <div key={booking._id} className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
                    <div>
                      <p className="text-white font-medium">{booking.eventId?.title}</p>
                      <p className="text-gray-400 text-sm">{booking.customerDetails?.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-purple-400 font-semibold">${booking.totalPrice}</p>
                      <p className="text-gray-400 text-sm">{booking.ticketType} × {booking.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Events Management</h2>
              <button
                onClick={() => {
                  resetEventForm();
                  setShowEventModal(true);
                }}
                className="btn-primary flex items-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Event
              </button>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {events.map((event) => (
                  <div key={event._id} className="bg-black/20 rounded-xl overflow-hidden">
                    <img
                      src={event.poster || '/placeholder-event.jpg'}
                      alt={event.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-white mb-2">{event.title}</h3>
                      <p className="text-gray-400 text-sm mb-2">
                        {event.date && format(new Date(event.date), 'MMM dd, yyyy')}
                      </p>
                      <p className="text-gray-400 text-sm mb-4">{event.venue?.name}</p>
                      
                      <div className="flex justify-between items-center">
                        <span className={`px-2 py-1 rounded text-xs ${
                          event.featured ? 'bg-yellow-500 text-black' : 'bg-gray-600 text-white'
                        }`}>
                          {event.featured ? 'Featured' : 'Regular'}
                        </span>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openEditModal(event)}
                            className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                          >
                            <Edit className="h-4 w-4 text-white" />
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(event._id)}
                            className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4 text-white" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">Bookings Management</h2>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left text-white font-semibold py-3">Booking ID</th>
                      <th className="text-left text-white font-semibold py-3">Event</th>
                      <th className="text-left text-white font-semibold py-3">Customer</th>
                      <th className="text-left text-white font-semibold py-3">Tickets</th>
                      <th className="text-left text-white font-semibold py-3">Amount</th>
                      <th className="text-left text-white font-semibold py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking._id} className="border-b border-white/10">
                        <td className="py-3 text-gray-300 font-mono text-sm">{booking.bookingId}</td>
                        <td className="py-3 text-white">{booking.eventId?.title}</td>
                        <td className="py-3 text-gray-300">{booking.customerDetails?.name}</td>
                        <td className="py-3 text-gray-300">{booking.ticketType} × {booking.quantity}</td>
                        <td className="py-3 text-purple-400 font-semibold">${booking.totalPrice}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            booking.bookingStatus === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                            booking.bookingStatus === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {booking.bookingStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">Users Management</h2>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left text-white font-semibold py-3">Name</th>
                      <th className="text-left text-white font-semibold py-3">Email</th>
                      <th className="text-left text-white font-semibold py-3">Role</th>
                      <th className="text-left text-white font-semibold py-3">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id} className="border-b border-white/10">
                        <td className="py-3 text-white">{user.name}</td>
                        <td className="py-3 text-gray-300">{user.email}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 text-gray-300">
                          {user.createdAt && format(new Date(user.createdAt), 'MMM dd, yyyy')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Event Modal */}
        {showEventModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold text-white mb-6">
                {editingEvent ? 'Edit Event' : 'Add New Event'}
              </h3>
              
              <form onSubmit={handleEventSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">Event Title</label>
                    <input
                      type="text"
                      value={eventForm.title}
                      onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                      className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white font-medium mb-2">Date</label>
                    <input
                      type="date"
                      value={eventForm.date}
                      onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
                      className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Description</label>
                  <textarea
                    value={eventForm.description}
                    onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                    className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 text-white h-24"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">Venue Name</label>
                    <input
                      type="text"
                      value={eventForm.venue.name}
                      onChange={(e) => setEventForm({
                        ...eventForm, 
                        venue: {...eventForm.venue, name: e.target.value}
                      })}
                      className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white font-medium mb-2">Capacity</label>
                    <input
                      type="number"
                      value={eventForm.venue.capacity}
                      onChange={(e) => setEventForm({
                        ...eventForm, 
                        venue: {...eventForm.venue, capacity: parseInt(e.target.value)}
                      })}
                      className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 text-white"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEventModal(false);
                      setEditingEvent(null);
                    }}
                    className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  >
                    {editingEvent ? 'Update Event' : 'Create Event'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
