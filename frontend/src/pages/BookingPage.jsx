import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  Ticket, 
  User, 
  Mail, 
  Phone, 
  CreditCard,
  CheckCircle,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const BookingPage = () => {
  const { eventId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [error, setError] = useState('');

  const ticketType = searchParams.get('ticketType') || '';
  const quantity = parseInt(searchParams.get('quantity')) || 1;

  const [customerDetails, setCustomerDetails] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/events/${eventId}`);
      setEvent(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching event:', error);
      setError('Failed to load event details');
      setLoading(false);
    }
  };

  const getTicketInfo = () => {
    return event?.ticketTypes.find(t => t.type === ticketType);
  };

  const getTotalPrice = () => {
    const ticket = getTicketInfo();
    return ticket ? ticket.price * quantity : 0;
  };

  const handleInputChange = (e) => {
    setCustomerDetails({
      ...customerDetails,
      [e.target.name]: e.target.value
    });
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    
    if (!customerDetails.name || !customerDetails.email || !customerDetails.phone) {
      setError('Please fill in all required fields');
      return;
    }

    setBookingLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/bookings', {
        eventId,
        ticketType,
        quantity,
        customerDetails
      });

      setBookingData(response.data.booking);
      setBookingComplete(true);
    } catch (error) {
      setError(error.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Event not found</h2>
          <button onClick={() => navigate('/')} className="btn-primary">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (bookingComplete) {
    return (
      <div className="min-h-screen pt-16 px-4">
        <div className="max-w-2xl mx-auto py-12">
          <motion.div
            className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-4">Booking Confirmed!</h1>
            <p className="text-gray-300 mb-8">
              Your tickets have been successfully booked. Check your email for confirmation details.
            </p>

            <div className="bg-black/20 rounded-lg p-6 mb-8 text-left">
              <h3 className="text-xl font-semibold text-white mb-4">Booking Details</h3>
              <div className="space-y-2 text-gray-300">
                <p><span className="text-white font-medium">Booking ID:</span> {bookingData?.bookingId}</p>
                <p><span className="text-white font-medium">Event:</span> {event.title}</p>
                <p><span className="text-white font-medium">Date:</span> {format(new Date(event.date), 'EEEE, MMMM dd, yyyy')}</p>
                <p><span className="text-white font-medium">Venue:</span> {event.venue.name}</p>
                <p><span className="text-white font-medium">Ticket Type:</span> {ticketType}</p>
                <p><span className="text-white font-medium">Quantity:</span> {quantity}</p>
                <p><span className="text-white font-medium">Total Paid:</span> ${getTotalPrice()}</p>
              </div>
              
              {bookingData?.qrCode && (
                <div className="mt-6 pt-4 border-t border-white/20">
                  <p className="text-white font-medium mb-3">QR Code for Entry:</p>
                  <div className="bg-white p-4 rounded-lg inline-block">
                    <img 
                      src={bookingData.qrCode} 
                      alt="QR Code" 
                      className="w-40 h-40"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-primary"
              >
                View My Tickets
              </button>
              <button
                onClick={() => navigate('/')}
                className="btn-secondary"
              >
                Back to Home
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const ticketInfo = getTicketInfo();

  return (
    <div className="min-h-screen pt-16 px-4">
      <div className="max-w-4xl mx-auto py-8">
        <button
          onClick={() => navigate(`/event/${eventId}`)}
          className="flex items-center text-white/80 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Event
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Event Summary */}
          <motion.div
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">Event Summary</h2>
            
            <div className="space-y-4">
              <div>
                <img
                  src={event.poster}
                  alt={event.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-white">{event.title}</h3>
                <p className="text-purple-400 font-medium">{event.artists?.[0]?.name}</p>
              </div>
              
              <div className="space-y-2 text-gray-300">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-3 text-purple-400" />
                  {format(new Date(event.date), 'EEEE, MMMM dd, yyyy')}
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-3 text-purple-400" />
                  {event.venue.name}
                </div>
              </div>
            </div>

            {/* Ticket Summary */}
            <div className="mt-6 pt-6 border-t border-white/20">
              <h4 className="text-lg font-semibold text-white mb-4">Ticket Summary</h4>
              <div className="bg-black/20 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">{ticketType} × {quantity}</span>
                  <span className="text-white font-semibold">${ticketInfo?.price * quantity}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-purple-400">${getTotalPrice()}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Booking Form */}
          <motion.div
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">Booking Details</h2>

            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg flex items-center">
                <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                <span className="text-red-400">{error}</span>
              </div>
            )}

            <form onSubmit={handleBooking} className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-2">
                  <User className="h-5 w-5 inline mr-2" />
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={customerDetails.name}
                  onChange={handleInputChange}
                  className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  <Mail className="h-5 w-5 inline mr-2" />
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={customerDetails.email}
                  onChange={handleInputChange}
                  className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  <Phone className="h-5 w-5 inline mr-2" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={customerDetails.phone}
                  onChange={handleInputChange}
                  className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              {/* Payment Section (Simulated) */}
              <div className="pt-6 border-t border-white/20">
                <h3 className="text-lg font-semibold text-white mb-4">
                  <CreditCard className="h-5 w-5 inline mr-2" />
                  Payment Information
                </h3>
                <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-4 mb-4">
                  <p className="text-yellow-400 text-sm">
                    <strong>Demo Mode:</strong> This is a simulated payment. No actual charges will be made.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={bookingLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {bookingLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Ticket className="h-5 w-5 mr-2" />
                    Confirm Booking - ${getTotalPrice()}
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-sm text-gray-400 space-y-1">
              <p>• Tickets are non-refundable</p>
              <p>• Valid ID required at venue</p>
              <p>• Confirmation will be sent to your email</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
