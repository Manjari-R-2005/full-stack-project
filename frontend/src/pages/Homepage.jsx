import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Star, ArrowRight, Instagram, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import axios from 'axios';

const Homepage = () => {
  const [events, setEvents] = useState([]);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [galleryIndex, setGalleryIndex] = useState(0);

  useEffect(() => {
    fetchEvents();
    fetchFeaturedEvents();
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

  const fetchEvents = async () => {
    try {
      const response = await axios.get('/api/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const featuredArtists = [
    {
      id: 1,
      name: 'The Midnight Echo',
      genre: 'Indie Rock',
      image: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?q=80&w=1200&auto=format&fit=crop',
    },
    {
      id: 2,
      name: 'Neon Dreams',
      genre: 'Electronic',
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop',
    },
    {
      id: 3,
      name: 'Soul Revival',
      genre: 'R&B / Soul',
      image: 'https://images.unsplash.com/photo-1483411561395-353ae64e7d2a?q=80&w=1200&auto=format&fit=crop',
    },
    {
      id: 4,
      name: 'The High Notes',
      genre: 'Jazz',
      image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1200&auto=format&fit=crop',
    },
  ];

  const fetchFeaturedEvents = async () => {
    try {
      const response = await axios.get('/api/events/featured');
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
        {/* Background video with image fallback */}
        <div className="absolute inset-0">
          <video
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            poster="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1920&h=1080&fit=crop"
          >
            <source src="https://cdn.coverr.co/videos/coverr-crowd-at-concert-0812/1080p.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <motion.div 
          className="relative z-10 text-center max-w-4xl mx-auto px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            <span className="text-white">Feel the Beat.</span>
            <br />
            <span className="text-white">Live the Moment.</span>
            <br />
            <span className="gradient-text">Only at ConcertHub.</span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto">
            Book tickets to the most electrifying concerts and festivals around you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/events"
              className="btn-primary text-base md:text-lg px-8 py-3"
            >
              View Events
            </Link>
            <Link
              to="/events"
              className="btn-secondary text-base md:text-lg px-8 py-3"
            >
              Book Now
            </Link>
          </div>
        </motion.div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowRight className="h-6 w-6 text-primary-400 rotate-90" />
        </div>
      </section>

      {/* Upcoming Concerts - Horizontal Scroll */}
      <section className="py-16 px-4 bg-dark-800/40">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold">
                Upcoming <span className="gradient-text">Concerts</span>
              </h2>
              <p className="text-gray-400 mt-2">Swipe to explore what's coming up</p>
            </div>
            <Link to="/events" className="btn-secondary">View All</Link>
          </div>

          <div className="relative">
            <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory">
              {events.filter(e => !e.featured).map((event) => (
                <div key={event._id} className="min-w-[280px] md:min-w-[340px] snap-start">
                  <div className="card overflow-hidden">
                    <div className="relative">
                      <img src={event.poster} alt={event.title} className="w-full h-44 object-cover" />
                      {isNew(event) && (
                        <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce">NEW</span>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-3 left-3 right-3 flex items-center text-xs text-gray-300">
                        <Calendar className="h-4 w-4 mr-1" />
                        {format(new Date(event.date), 'MMM dd')} • {event.time}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-white font-semibold text-lg line-clamp-1">{event.title}</h3>
                      <div className="flex items-center text-gray-400 text-sm mt-1">
                        <MapPin className="h-4 w-4 mr-1" /> {event.venue.city}
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-white font-bold">
                          ${Math.min(...event.ticketTypes.map(t => t.price))}
                        </span>
                        <Link to={`/event/${event._id}`} className="btn-primary text-sm px-4 py-2">Book</Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
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

      {/* Featured Artists */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold">
              Featured <span className="gradient-text">Artists</span>
            </h2>
            <p className="text-gray-400 mt-3">Meet the stars lighting up our stages</p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {featuredArtists.map((artist) => (
              <motion.div key={artist.id} variants={itemVariants} className="group card overflow-hidden p-0">
                <div className="relative">
                  <img src={artist.image} alt={artist.name} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-white font-bold text-xl">{artist.name}</h3>
                    <p className="text-primary-300 text-sm">{artist.genre}</p>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-end gap-3">
                  <a href="#" className="text-gray-400 hover:text-pink-500"><Instagram className="h-5 w-5" /></a>
                  <a href="#" className="text-gray-400 hover:text-red-500"><Youtube className="h-5 w-5" /></a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Gallery Preview - Small Carousel */}
      <section className="py-16 px-4 bg-dark-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-3xl font-bold">Gallery <span className="gradient-text">Preview</span></h2>
            <div className="flex gap-3">
              <button
                onClick={() => setGalleryIndex((i) => Math.max(i - 1, 0))}
                className="btn-secondary text-sm px-3 py-2"
              >Prev</button>
              <button
                onClick={() => setGalleryIndex((i) => Math.min(i + 1, Math.max(0, (events?.length || 6) - 1)))}
                className="btn-primary text-sm px-3 py-2"
              >Next</button>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl">
            <motion.div
              className="flex gap-4"
              animate={{ x: `-${galleryIndex * 25}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            >
              {(events?.slice(0,8).map(e => e.poster) ?? []).concat(
                events.length === 0 ? [
                  'https://images.unsplash.com/photo-1472653431158-6364773b2a56?q=80&w=1200&auto=format&fit=crop',
                  'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1200&auto=format&fit=crop',
                  'https://images.unsplash.com/photo-1483411561395-353ae64e7d2a?q=80&w=1200&auto=format&fit=crop',
                  'https://images.unsplash.com/photo-1444827750121-0be3536b1cc0?q=80&w=1200&auto=format&fit=crop'
                ] : []
              ).map((src, idx) => (
                <img key={idx} src={src} alt="gallery" className="h-36 md:h-44 w-auto rounded-lg object-cover" />
              ))}
            </motion.div>
          </div>
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
