import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, CreditCard, Loader2, ArrowLeft } from 'lucide-react';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState('tickets'); // 'tickets', 'details', 'payment', 'confirmation'
  const [formData, setFormData] = useState({
    ticketType: '',
    quantity: 1,
    attendees: [{ name: '', email: '', phone: '' }],
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });
  const [bookingId, setBookingId] = useState('');
  const [bookingStatus, setBookingStatus] = useState('');
  const [selectedTicketType, setSelectedTicketType] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Sample event data - replace with API call
  const sampleEvent = {
    id: '1',
    title: 'Summer Music Festival',
    date: '2023-12-15',
    time: '19:00',
    venue: 'Concert Hall',
    city: 'New York',
    description: 'An amazing concert experience with top artists.',
    image: 'https://via.placeholder.com/800x400',
    ticketTypes: [
      { type: 'General Admission', price: 50, remainingTickets: 100 },
      { type: 'VIP', price: 120, remainingTickets: 50 },
      { type: 'Premium', price: 200, remainingTickets: 20 },
    ],
  };

  useEffect(() => {
    // Simulate API call
    const fetchEvent = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        setEvent(sampleEvent);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching event:', error);
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleBooking = async () => {
    try {
      setBookingStatus('loading');
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setBookingId(`BK-${Math.random().toString(36).substr(2, 8).toUpperCase()}`);
      setBookingStatus('success');
      setStep('confirmation');
    } catch (error) {
      console.error('Booking failed:', error);
      setBookingStatus('error');
    }
  };

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
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-4">
                      <CreditCard className="h-5 w-5 text-blue-400" />
                      <span className="text-white">Credit/Debit Card</span>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Card Number *
                        </label>
                        <input
                          type="text"
                          value={formData.cardNumber}
                          onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
                          placeholder="1234 5678 9012 3456"
                          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">
                            Expiry Date *
                          </label>
                          <input
                            type="text"
                            value={formData.expiryDate}
                            onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                            placeholder="MM/YY"
                            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">
                            CVV *
                          </label>
                          <input
                            type="text"
                            value={formData.cvv}
                            onChange={(e) => setFormData({...formData, cvv: e.target.value})}
                            placeholder="123"
                            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Name on Card *
                        </label>
                        <input
                          type="text"
                          value={formData.cardName}
                          onChange={(e) => setFormData({...formData, cardName: e.target.value})}
                          placeholder="John Doe"
                          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
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
                    disabled={!formData.cardNumber || !formData.expiryDate || !formData.cvv || !formData.cardName}
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
            <h2 className="text-3xl font-bold text-white mb-4">Booking Confirmed!</h2>
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
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  // Generate a URL for the ticket that can be shared
                  const ticketUrl = `${window.location.origin}/tickets/${bookingId}`;
                  navigator.clipboard.writeText(ticketUrl);
                  alert('Ticket link copied to clipboard!');
                }}
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium"
              >
                Share Tickets
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
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>Event not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
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
                    <span className="text-xs mt-2 text-gray-400 capitalize">
                      {s === 'confirmation' ? 'Complete' : s}
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
      <main className="max-w-4xl mx-auto px-4 py-12">
        {renderStep()}
      </main>
    </div>
  );
};

export default EventDetails;
