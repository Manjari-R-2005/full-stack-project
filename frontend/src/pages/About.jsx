import React from 'react';
import { Music, Calendar, Users, MapPin, Award } from 'lucide-react';
import teamMembers from '../data/team';

const About = () => {
  const stats = [
    { id: 1, name: 'Events Hosted', value: '250+', icon: Calendar },
    { id: 2, name: 'Artists Featured', value: '500+', icon: Music },
    { id: 3, name: 'Happy Attendees', value: '100K+', icon: Users },
    { id: 4, name: 'Cities Covered', value: '25+', icon: MapPin },
  ];

  const features = [
    {
      name: 'Curated Experiences',
      description: 'We carefully select the best venues and artists to create unforgettable experiences for music lovers.',
      icon: Award,
    },
    {
      name: 'Seamless Booking',
      description: 'Our platform makes it easy to discover and book tickets to your favorite events in just a few clicks.',
      icon: 'M12 15l8-8m0 0l-8-8m8 8H4',
    },
    {
      name: 'Community Focused',
      description: 'We believe in building a community of music lovers and supporting emerging artists.',
      icon: Users,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 to-dark-800 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto text-center mb-20">
        <h1 className="text-5xl font-bold text-white mb-6">Our Story</h1>
        <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-12">
          Connecting music lovers with unforgettable live experiences since 2015. We're passionate about bringing people together through the power of music.
        </p>
        
        <div className="bg-dark-700 rounded-2xl p-8 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.id} className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary-500/20 text-primary-400 mx-auto mb-4">
                  <stat.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-gray-400">{stat.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto mb-20">
        <div className="lg:text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Our Mission</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            To create meaningful connections between artists and audiences through exceptional live music experiences.
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div key={index} className="bg-dark-700 p-6 rounded-xl hover:bg-dark-600 transition-colors">
                <div className="flex items-center mb-4">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500/20 text-primary-400">
                    {typeof feature.icon === 'function' ? (
                      <feature.icon className="h-6 w-6" aria-hidden="true" />
                    ) : (
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={feature.icon}
                        />
                      </svg>
                    )}
                  </div>
                  <h3 className="text-lg font-medium text-white ml-4">{feature.name}</h3>
                </div>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Meet the Team</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Passionate individuals dedicated to creating amazing experiences for our community.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {teamMembers.map((member) => (
            <div key={member.id} className="bg-dark-700 rounded-xl overflow-hidden shadow-lg">
              <img 
                className="w-full h-64 object-cover" 
                src={member.image} 
                alt={member.name} 
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-white">{member.name}</h3>
                <p className="text-primary-400 mb-4">{member.role}</p>
                <p className="text-gray-300">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-20 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Join Our Community</h2>
        <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto">
          Be the first to know about upcoming events, exclusive pre-sales, and special offers.
        </p>
        <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <button className="bg-white text-primary-600 font-medium px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;
