import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const handleBookNow = (eventId) => {
    if (!isAuthenticated) {
      // Redirect to login with a return URL
      navigate(`/login?returnTo=/event/${eventId}`);
    } else {
      // Navigate to event details page
      navigate(`/event/${eventId}`);
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get('/api/events');
        setEvents(res.data || []);
        setLoading(false);
      } catch (err) {
        setError('Failed to load events. Please try again later.');
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const isNew = (e) => {
    try {
      const created = e?.createdAt ? new Date(e.createdAt).getTime() : (e?.date ? new Date(e.date).getTime() : 0);
      const days7 = 7 * 24 * 60 * 60 * 1000;
      return created && (Date.now() - created) < days7;
    } catch (_) {
      return false;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-dark-900 to-dark-800 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Upcoming Events</h1>
          <div className="animate-pulse space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-dark-700 rounded-lg p-6 shadow-lg">
                <div className="h-6 bg-dark-600 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-dark-600 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-dark-600 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-dark-900 to-dark-800 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Something went wrong</h1>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-6 rounded-md transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 to-dark-800 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Upcoming Events</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div key={event._id} className="card overflow-hidden flex flex-col">
              <div className="relative">
                <img
                  src={event.poster}
                  alt={event.title}
                  className="w-full h-52 object-cover"
                />
                {isNew(event) && (
                  <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce">
                    NEW
                  </span>
                )}
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h2 className="text-xl font-bold text-white mb-1 line-clamp-1">{event.title}</h2>
                <div className="flex items-center text-gray-300 text-sm mb-1">
                  <Calendar className="h-4 w-4 mr-2 text-primary-500" />
                  <span>{new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center text-gray-300 text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-primary-500" />
                  <span>{event?.venue?.name}, {event?.venue?.city}</span>
                </div>

                <div className="mt-auto flex items-center justify-between pt-4">
                  <div className="text-lg font-bold text-white">${Math.min(...(event.ticketTypes || []).map(t => t.price))}</div>
                  <Link
                    to={`/event/${event._id}`}
                    className="btn-secondary text-sm px-4 py-2"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events;
