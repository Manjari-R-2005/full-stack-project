import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Music, 
  Star, 
  Ticket, 
  ArrowLeft,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import axios from 'axios';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTicketType, setSelectedTicketType] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [bookingStatus, setBookingStatus] = useState('');

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/events/${id}`);
      setEvent(response.data);
      setSelectedTicketType(response.data.ticketTypes[0]?.type || '');
      setLoading(false);
    } catch (error) {
      console.error('Error fetching event:', error);
      setLoading(false);
    }
  };

  const handleBooking = () => {
    if (!selectedTicketType || quantity < 1) return;
    
    // Redirect to booking page with event and ticket details
    window.location.href = `/booking/${id}?ticketType=${selectedTicketType}&quantity=${quantity}`;
  };

  const getSelectedTicketInfo = () => {
    return event?.ticketTypes.find(t => t.type === selectedTicketType);
  };

  const getTotalPrice = () => {
    const ticketInfo = getSelectedTicketInfo();
    return ticketInfo ? ticketInfo.price * quantity : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Event not found</h2>
          <Link to="/" className="btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen">
      {/* Hero Section */}
      <section className="relative h-96 lg:h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={event.poster}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/60 to-transparent"></div>
        </div>
        
        <div className="relative z-10 h-full flex items-end">
          <div className="max-w-7xl mx-auto px-4 pb-12 w-full">
            <Link 
              to="/" 
              className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Events
            </Link>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center mb-4">
                <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-semibold mr-4">
                  {event.genre}
                </span>
                {event.featured && (
                  <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                    <Star className="h-4 w-4 mr-1" />
                    Featured
                  </span>
                )}
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">
                {event.title}
              </h1>
              
              <p className="text-xl lg:text-2xl text-primary-400 font-semibold mb-4">
                {event.artist}
              </p>
              
              <div className="flex flex-wrap items-center gap-6 text-white/80">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  {format(new Date(event.date), 'EEEE, MMMM dd, yyyy')}
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  {event.time}
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  {event.venue.name}, {event.venue.city}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Event Information */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <motion.div
              className="card p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h2 className="text-2xl font-bold text-white mb-4">About This Event</h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                {event.description}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
                    <Music className="h-5 w-5 mr-2 text-primary-400" />
                    Artist Lineup
                  </h3>
                  <ul className="space-y-2">
                    {event.lineup.map((artist, index) => (
                      <li key={index} className="text-gray-300 flex items-center">
                        <span className="w-2 h-2 bg-primary-400 rounded-full mr-3"></span>
                        {artist}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-primary-400" />
                    Event Details
                  </h3>
                  <div className="space-y-2 text-gray-300">
                    <p><span className="text-white font-medium">Duration:</span> {event.duration}</p>
                    <p><span className="text-white font-medium">Venue Capacity:</span> {event.venue.capacity.toLocaleString()}</p>
                    <p><span className="text-white font-medium">Address:</span> {event.venue.address}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Venue Information */}
            <motion.div
              className="card p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <MapPin className="h-6 w-6 mr-2 text-primary-400" />
                Venue Information
              </h2>
              
              <div className="bg-dark-700 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-2">{event.venue.name}</h3>
                <p className="text-gray-300 mb-4">{event.venue.address}, {event.venue.city}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center text-gray-300">
                    <Users className="h-5 w-5 mr-2 text-primary-400" />
                    Capacity: {event.venue.capacity.toLocaleString()}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Booking Section */}
          <div className="lg:col-span-1">
            <motion.div
              className="card p-8 sticky top-24"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Ticket className="h-6 w-6 mr-2 text-primary-400" />
                Book Tickets
              </h2>

              {/* Ticket Types */}
              <div className="space-y-4 mb-6">
                {event.ticketTypes.map((ticketType) => (
                  <div
                    key={ticketType.type}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedTicketType === ticketType.type
                        ? 'border-primary-500 bg-primary-500/10'
                        : 'border-dark-600 hover:border-primary-400'
                    }`}
                    onClick={() => setSelectedTicketType(ticketType.type)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-white">{ticketType.type}</h3>
                      <span className="text-xl font-bold text-primary-400">
                        ${ticketType.price}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">
                        {ticketType.remainingTickets} remaining
                      </span>
                      <div className={`flex items-center ${
                        ticketType.remainingTickets > 50 ? 'text-green-400' : 
                        ticketType.remainingTickets > 10 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          ticketType.remainingTickets > 50 ? 'bg-green-400' : 
                          ticketType.remainingTickets > 10 ? 'bg-yellow-400' : 'bg-red-400'
                        }`}></div>
                        {ticketType.remainingTickets > 50 ? 'Available' : 
                         ticketType.remainingTickets > 10 ? 'Limited' : 'Few Left'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-white font-medium mb-2">Quantity</label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white focus:border-primary-500 focus:outline-none"
                >
                  {[...Array(Math.min(10, getSelectedTicketInfo()?.remainingTickets || 1))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} {i === 0 ? 'ticket' : 'tickets'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Total Price */}
              <div className="bg-dark-700 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between text-lg">
                  <span className="text-gray-300">Total Price:</span>
                  <span className="font-bold text-white text-xl">
                    ${getTotalPrice()}
                  </span>
                </div>
              </div>

              {/* Book Button */}
              <button
                onClick={handleBooking}
                disabled={bookingStatus === 'loading' || !selectedTicketType}
                className="w-full btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {bookingStatus === 'loading' ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                ) : null}
                {bookingStatus === 'loading' ? 'Booking...' : 'Book Tickets'}
              </button>

              {/* Booking Status Messages */}
              {bookingStatus === 'success' && (
                <div className="mt-4 p-4 bg-green-500/20 border border-green-500 rounded-lg flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                  <span className="text-green-400">Tickets booked successfully!</span>
                </div>
              )}

              {bookingStatus === 'error' && (
                <div className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded-lg flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                  <span className="text-red-400">Booking failed. Please try again.</span>
                </div>
              )}

              {/* Additional Info */}
              <div className="mt-6 text-sm text-gray-400 space-y-2">
                <p>• Tickets are non-refundable</p>
                <p>• Valid ID required at venue</p>
                <p>• Doors open 1 hour before show time</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
