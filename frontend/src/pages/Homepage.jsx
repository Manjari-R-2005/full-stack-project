import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import axios from 'axios';

const Homepage = () => {
  const [events, setEvents] = useState([]);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
    fetchFeaturedEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/events');
      setEvents(response.data.events || response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchFeaturedEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/events/featured/list');
      setFeaturedEvents(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching featured events:', error);
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900/20"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1920&h=1080&fit=crop')] bg-cover bg-center opacity-20"></div>
        
        <motion.div 
          className="relative z-10 text-center max-w-4xl mx-auto px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-6">
            <span className="gradient-text">Live Music</span>
            <br />
            <span className="text-white">Experiences</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Discover amazing concerts, festivals, and live performances. Book your tickets to unforgettable musical experiences.
          </p>
          <motion.button
            className="btn-primary text-lg px-8 py-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore Events
          </motion.button>
        </motion.div>
        
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowRight className="h-6 w-6 text-primary-400 rotate-90" />
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Featured</span> Events
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Don't miss these incredible performances from world-renowned artists
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {featuredEvents.map((event, index) => (
              <motion.div
                key={event._id}
                variants={itemVariants}
                className={`card overflow-hidden ${index === 0 ? 'lg:col-span-2' : ''}`}
              >
                <div className={`flex ${index === 0 ? 'flex-col lg:flex-row' : 'flex-col'}`}>
                  <div className={`${index === 0 ? 'lg:w-1/2' : 'w-full'} relative`}>
                    <img
                      src={event.poster}
                      alt={event.title}
                      className={`w-full object-cover ${index === 0 ? 'h-64 lg:h-full' : 'h-48'}`}
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                        <Star className="h-4 w-4 mr-1" />
                        Featured
                      </span>
                    </div>
                  </div>
                  
                  <div className={`${index === 0 ? 'lg:w-1/2' : 'w-full'} p-6`}>
                    <div className="flex items-center text-primary-400 text-sm mb-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      {format(new Date(event.date), 'MMM dd, yyyy')} • {event.time}
                    </div>
                    
                    <h3 className={`font-bold text-white mb-2 ${index === 0 ? 'text-2xl lg:text-3xl' : 'text-xl'}`}>
                      {event.title}
                    </h3>
                    
                    <p className="text-primary-400 font-semibold mb-2">{event.artist}</p>
                    
                    <div className="flex items-center text-gray-400 text-sm mb-4">
                      <MapPin className="h-4 w-4 mr-2" />
                      {event.venue.name}, {event.venue.city}
                    </div>
                    
                    <p className="text-gray-300 mb-4 line-clamp-2">{event.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-400">
                        <Users className="h-4 w-4 mr-2" />
                        {event.venue.capacity.toLocaleString()} capacity
                      </div>
                      
                      <Link
                        to={`/event/${event._id}`}
                        className="btn-primary"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* All Events */}
      <section className="py-20 px-4 bg-dark-800/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Upcoming <span className="gradient-text">Events</span>
            </h2>
            <p className="text-gray-400 text-lg">
              Discover more amazing concerts and live performances
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {events.filter(event => !event.featured).map((event) => (
              <motion.div
                key={event._id}
                variants={itemVariants}
                className="card overflow-hidden group hover:scale-105 transition-transform duration-300"
              >
                <div className="relative">
                  <img
                    src={event.poster}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="bg-primary-500/90 text-white px-2 py-1 rounded text-xs font-semibold">
                      {event.genre}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center text-primary-400 text-sm mb-2">
                    <Calendar className="h-4 w-4 mr-2" />
                    {format(new Date(event.date), 'MMM dd')} • {event.time}
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">
                    {event.title}
                  </h3>
                  
                  <p className="text-primary-400 font-semibold mb-2">{event.artist}</p>
                  
                  <div className="flex items-center text-gray-400 text-sm mb-4">
                    <MapPin className="h-4 w-4 mr-2" />
                    {event.venue.city}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-white">
                      From ${Math.min(...event.ticketTypes.map(t => t.price))}
                    </span>
                    
                    <Link
                      to={`/event/${event._id}`}
                      className="btn-secondary text-sm px-4 py-2"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready for the <span className="gradient-text">Experience</span>?
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of music lovers and create unforgettable memories at the best live events in your city.
            </p>
            <button className="btn-primary text-lg px-8 py-4">
              Browse All Events
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
