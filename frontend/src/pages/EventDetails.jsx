import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, CreditCard, Loader2, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState('tickets');
  const [formData, setFormData] = useState({
    ticketType: '',
    quantity: 1,
    attendees: [{ name: '', email: '', phone: '' }],
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    upiId: ''
  });
  const [bookingId, setBookingId] = useState('');
  const [bookingStatus, setBookingStatus] = useState('');
  const [selectedTicketType, setSelectedTicketType] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'upi'

  const scrollToTickets = () => {
    setStep('tickets');
    setTimeout(() => {
      const el = document.getElementById('tickets');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  };

  // Sample event data - replace with API call
  const sampleEvent = {
    id: '1',
    title: 'Summer Music Festival',
    date: '2023-12-15',
    time: '19:00',
    venue: 'Concert Hall',
    city: 'New York',
    description: 'An amazing concert experience with top artists.',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1600&auto=format&fit=crop',
    lineup: ['Headliner: The Midnight Echo', 'Neon Dreams', 'Soul Revival'],
    ticketTypes: [
      { type: 'VIP', price: 120, remainingTickets: 50 },
      { type: 'Regular', price: 60, remainingTickets: 200 },
      { type: 'Student', price: 35, remainingTickets: 150 },
    ],
  };

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`/api/events/${id}`);
        setEvent(res.data);
      } catch (error) {
        console.warn('Falling back to sample event:', error?.message || error);
        setEvent(sampleEvent);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleBooking = async () => {
    try {
      if (!user) {
        navigate('/login');
        return;
      }
      setBookingStatus('loading');
      // Decrement tickets + optionally email via backend
      const buyer = (formData?.attendees?.[0]) || { email: '' };
      const preferredEmail = buyer.email || user?.email || '';
      await axios.patch(`/api/events/${id}/book-tickets`, {
        ticketType: selectedTicketType,
        quantity,
        email: preferredEmail,
      });

      setBookingId(`BK-${Math.random().toString(36).substr(2, 8).toUpperCase()}`);
      setBookingStatus('success');
      setStep('confirmation');
      // Redirect to dashboard so the user can see bookings immediately
      navigate('/dashboard');
    } catch (error) {
      console.error('Booking failed:', error);
      setBookingStatus('error');
      const msg = error?.response?.data?.message || error?.message || 'Booking failed. Please login and try again.';
      if (typeof window !== 'undefined') alert(msg);
    }
  };

  async function generateReceiptPDF() {
    try {
      const { jsPDF } = await import('https://cdn.skypack.dev/jspdf');
      const doc = new jsPDF();
      const buyer = (formData?.attendees?.[0]) || {};
      doc.setFontSize(18);
      doc.text('ConcertHub - Booking Receipt', 14, 18);
      doc.setFontSize(12);
      doc.text(`Booking ID: ${bookingId}`, 14, 28);
      doc.text(`Event: ${event?.title || ''}`, 14, 36);
      doc.text(`Date: ${event?.date || ''}  Time: ${event?.time || ''}`, 14, 44);
      doc.text(`Venue: ${(event?.venue?.name || event?.venue || '')}, ${(event?.venue?.city || event?.city || '')}`, 14, 52);
      doc.text(`Ticket: ${quantity} x ${selectedTicketType}`, 14, 60);
      const ticket = getSelectedTicketInfo();
      const total = ticket ? (ticket.price * quantity).toFixed(2) : '0.00';
      doc.text(`Total Paid: $${total}`, 14, 68);
      doc.text(`Name: ${buyer.name || ''}`, 14, 80);
      doc.text(`Email: ${buyer.email || ''}`, 14, 88);
      doc.save(`ConcertHub_Receipt_${bookingId}.pdf`);
    } catch (e) {
      console.error('PDF generation failed:', e?.message || e);
      // Fallback: open printable window
      const w = window.open('', 'PRINT', 'height=600,width=800');
      if (w) {
        const ticket = getSelectedTicketInfo();
        const total = ticket ? (ticket.price * quantity).toFixed(2) : '0.00';
        w.document.write(`<html><head><title>Receipt</title></head><body>`);
        w.document.write(`<h2>ConcertHub - Booking Receipt</h2>`);
        w.document.write(`<p><strong>Booking ID:</strong> ${bookingId}</p>`);
        w.document.write(`<p><strong>Event:</strong> ${event?.title}</p>`);
        w.document.write(`<p><strong>Date:</strong> ${event?.date} ${event?.time}</p>`);
        w.document.write(`<p><strong>Venue:</strong> ${(event?.venue?.name || event?.venue)}, ${(event?.venue?.city || event?.city)}</p>`);
        w.document.write(`<p><strong>Tickets:</strong> ${quantity} x ${selectedTicketType}</p>`);
        w.document.write(`<p><strong>Total Paid:</strong> $${total}</p>`);
        w.document.write(`</body></html>`);
        w.document.close();
        w.focus();
        w.print();
        w.close();
      }
    }
  }

  const getSelectedTicketInfo = () => {
    return event?.ticketTypes?.find(t => t.type === selectedTicketType);
  };

  const getTotalPrice = () => {
    const ticket = getSelectedTicketInfo();
    return ticket ? (ticket.price * quantity).toFixed(2) : '0.00';
  };

  const handleAttendeeChange = (index, field, value) => {
    const updatedAttendees = [...formData.attendees];
    updatedAttendees[index] = {
      ...updatedAttendees[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      attendees: updatedAttendees
    }));
  };

  const addAttendee = () => {
    if (formData.attendees.length < quantity) {
      setFormData(prev => ({
        ...prev,
        attendees: [...prev.attendees, { name: '', email: '', phone: '' }]
      }));
    }
  };

  const removeAttendee = (index) => {
    if (formData.attendees.length > 1) {
      const updatedAttendees = formData.attendees.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        attendees: updatedAttendees
      }));
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'tickets':
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Select Ticket Type</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {event.ticketTypes.map((ticketType) => (
                  <div
                    key={ticketType.type}
                    className={`border rounded-lg p-6 cursor-pointer transition-all ${
                      selectedTicketType === ticketType.type
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-gray-700 hover:border-blue-400'
                    }`}
                    onClick={() => setSelectedTicketType(ticketType.type)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-white">{ticketType.type}</h3>
                        <p className="text-blue-400 text-2xl font-bold mt-2">${ticketType.price}</p>
                        <p className="text-gray-400 text-sm mt-1">
                          {ticketType.remainingTickets} tickets remaining
                        </p>
                      </div>
                      {selectedTicketType === ticketType.type && (
                        <div className="bg-blue-500 text-white rounded-full p-1">
                          <CheckCircle className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Select Quantity</h2>
              <select
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
              >
                {[...Array(10).keys()].map((num) => (
                  <option key={num + 1} value={num + 1}>
                    {num + 1} {num === 0 ? 'ticket' : 'tickets'}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-between items-center pt-4">
              <div>
                <p className="text-gray-400">Total</p>
                <p className="text-2xl font-bold text-white">${getTotalPrice()}</p>
              </div>
              <button
                onClick={() => setStep('details')}
                disabled={!selectedTicketType}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Details
              </button>
            </div>
          </div>
        );

      case 'details':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Attendee Information</h2>
              <div className="space-y-6">
                {formData.attendees.map((attendee, index) => (
                  <div key={index} className="bg-gray-800/50 p-6 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-white">
                        Attendee {index + 1}
                      </h3>
                      {formData.attendees.length > 1 && (
                        <button
                          onClick={() => removeAttendee(index)}
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={attendee.name}
                          onChange={(e) =>
                            handleAttendeeChange(index, 'name', e.target.value)
                          }
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={attendee.email}
                          onChange={(e) =>
                            handleAttendeeChange(index, 'email', e.target.value)
                          }
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Phone *
                        </label>
                        <input
                          type="tel"
                          value={attendee.phone}
                          onChange={(e) =>
                            handleAttendeeChange(index, 'phone', e.target.value)
                          }
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {formData.attendees.length < quantity && (
                  <button
                    onClick={addAttendee}
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center"
                  >
                    <span className="mr-1">+</span> Add another attendee
                  </button>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <button
                onClick={() => setStep('tickets')}
                className="text-gray-400 hover:text-white"
              >
                Back
              </button>
              <button
                onClick={() => setStep('payment')}
                disabled={formData.attendees.some(a => !a.name || !a.email || !a.phone)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Payment
              </button>
            </div>
          </div>
        );

      case 'payment':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Payment Information</h2>
              <div className="bg-gray-800/50 p-6 rounded-lg space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">{selectedTicketType} x {quantity}</span>
                      <span className="text-white">${(getSelectedTicketInfo()?.price * quantity).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Service Fee</span>
                      <span className="text-white">$5.99</span>
                    </div>
                    <div className="border-t border-gray-700 my-2"></div>
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>${(parseFloat(getTotalPrice()) + 5.99).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Payment Method</h3>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`px-4 py-2 rounded-md border ${paymentMethod==='card' ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-800 border-gray-700 text-gray-200'}`}
                    >Card</button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`px-4 py-2 rounded-md border ${paymentMethod==='upi' ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-800 border-gray-700 text-gray-200'}`}
                    >UPI</button>
                  </div>

                  {paymentMethod === 'card' ? (
                    <div className="bg-gray-700 p-4 rounded-lg space-y-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <CreditCard className="h-5 w-5 text-blue-400" />
                        <span className="text-white">Credit/Debit Card</span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Card Number *</label>
                        <input type="text" value={formData.cardNumber} onChange={(e)=>setFormData({...formData, cardNumber:e.target.value})} placeholder="1234 5678 9012 3456" className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">Expiry Date *</label>
                          <input type="text" value={formData.expiryDate} onChange={(e)=>setFormData({...formData, expiryDate:e.target.value})} placeholder="MM/YY" className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">CVV *</label>
                          <input type="text" value={formData.cvv} onChange={(e)=>setFormData({...formData, cvv:e.target.value})} placeholder="123" className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Name on Card *</label>
                        <input type="text" value={formData.cardName} onChange={(e)=>setFormData({...formData, cardName:e.target.value})} placeholder="John Doe" className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none" />
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-700 p-4 rounded-lg space-y-4">
                      <div className="text-white font-medium">UPI Payment</div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Enter UPI ID *</label>
                        <input type="text" value={formData.upiId} onChange={(e)=>setFormData({...formData, upiId:e.target.value})} placeholder="name@bank" className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none" />
                      </div>
                      <p className="text-gray-300 text-sm">You will see a collect request on your UPI app. Click Pay to authorize.</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center pt-4">
                  <button
                    onClick={() => setStep('details')}
                    className="text-gray-400 hover:text-white"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleBooking}
                    disabled={paymentMethod==='card' ? (!formData.cardNumber || !formData.expiryDate || !formData.cvv || !formData.cardName) : (!formData.upiId)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {bookingStatus === 'loading' ? (
                      <>
                        <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                        Processing...
                      </>
                    ) : 'Complete Booking'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'confirmation':
        return (
          <div className="text-center py-12">
            <div className="flex justify-center mb-6">
              <div className="bg-green-500/20 p-4 rounded-full">
                <CheckCircle className="h-12 w-12 text-green-400" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Booking Successful</h2>
            <p className="text-gray-300 mb-8">Your tickets have been booked successfully.</p>

            <div className="bg-gray-800/50 p-6 rounded-lg max-w-md mx-auto mb-8">
              <div className="flex justify-between mb-4">
                <span className="text-gray-400">Booking ID:</span>
                <span className="text-white font-mono">{bookingId}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="text-gray-400">Event:</span>
                <span className="text-white">{event?.title}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="text-gray-400">Date:</span>
                <span className="text-white">{event?.date} at {event?.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tickets:</span>
                <span className="text-white">{quantity} x {selectedTicketType}</span>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-700">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Paid:</span>
                  <span className="text-blue-400">${(parseFloat(getTotalPrice()) + 5.99).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={generateReceiptPDF}
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium"
              >
                Download Receipt (PDF)
              </button>
              <button
                onClick={() => navigate('/')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium"
              >
                Back to Home
              </button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-400 text-sm">
                A confirmation has been sent to your email. Please check your inbox.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
=======
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
>>>>>>> 7df5785370399dba91a4613466a0805dde142abf
  };

  if (loading) {
    return (
<<<<<<< HEAD
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
=======
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
>>>>>>> 7df5785370399dba91a4613466a0805dde142abf
      </div>
    );
  }

  if (!event) {
    return (
<<<<<<< HEAD
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>Event not found</p>
=======
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Event not found</h2>
          <Link to="/" className="btn-primary">
            Back to Home
          </Link>
        </div>
>>>>>>> 7df5785370399dba91a4613466a0805dde142abf
      </div>
    );
  }

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero */}
      <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30" />
        <div className="absolute inset-0 flex items-end md:items-center">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-8 md:pb-0">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-5xl font-extrabold mb-3">{event.title}</h1>
              <div className="flex flex-wrap items-center gap-3 text-gray-200">
                <span className="inline-flex items-center text-sm">
                  <span className="mr-2">📅</span>{event.date} • {event.time}
                </span>
                <span className="inline-flex items-center text-sm">
                  <span className="mr-2">📍</span>{event.venue?.name || event.venue}, {event.venue?.city || event.city}
                </span>
              </div>
              <p className="text-gray-300 mt-4 line-clamp-3">{event.description}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                {(event.lineup || []).map((name) => (
                  <span key={name} className="bg-white/10 border border-white/20 text-white text-sm px-3 py-1 rounded-full">{name}</span>
                ))}
              </div>
              <div className="mt-8">
                <button onClick={scrollToTickets} className="btn-primary text-base px-6 py-3">Book Now</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Event Info: Venue Map */}
      <section className="bg-gray-900 py-10 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-3">Lineup</h2>
              <ul className="space-y-2 text-gray-300">
                {(event.lineup || []).map((name) => (
                  <li key={name} className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-primary-500 mr-3"></span>
                    {name}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-3">Venue</h2>
              <p className="text-gray-300 mb-4">{event.venue?.name || event.venue}, {event.venue?.city || event.city}</p>
              <div className="rounded-xl overflow-hidden border border-gray-800">
                <iframe
                  title="Venue Map"
                  width="100%"
                  height="280"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(`${event.venue} ${event.city}`)}&output=embed`}
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Header */}
      <header className="bg-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-300 hover:text-white"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Events
            </button>
            <h1 className="text-2xl font-bold">Event Booking</h1>
            <div className="w-24"></div> {/* For alignment */}
          </div>
          
          {/* Progress Steps */}
          <div className="mt-8">
            <div className="flex justify-between items-center">
              {['tickets', 'details', 'payment', 'confirmation'].map((s, index) => (
                <React.Fragment key={s}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        step === s
                          ? 'bg-blue-500 text-white'
                          : step === 'confirmation' && s === 'confirmation' && bookingStatus === 'success'
                          ? 'bg-green-500 text-white'
                          : ['tickets', 'details', 'payment', 'confirmation'].indexOf(step) >= index
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-gray-700 text-gray-400'
                      }`}
                    >
                      {step === s || (step === 'confirmation' && s === 'confirmation' && bookingStatus === 'success') ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span className="text-xs mt-2 text-gray-200">
                      {`Step ${index + 1}`}
                    </span>
                  </div>
                  {index < 3 && (
                    <div className={`h-1 flex-1 mx-2 ${['tickets', 'details', 'payment'].indexOf(step) >= index ? 'bg-blue-500' : 'bg-gray-700'}`}></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="tickets" className="max-w-4xl mx-auto px-4 py-12">
        {renderStep()}
      </main>
=======
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
>>>>>>> 7df5785370399dba91a4613466a0805dde142abf
    </div>
  );
};

export default EventDetails;
