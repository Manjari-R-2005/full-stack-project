import React from 'react';
import { Link } from 'react-router-dom';
import { Music, Instagram, Twitter, Youtube } from 'lucide-react';

const artists = [
  {
    id: 1,
    name: 'The Midnight Echo',
    genre: 'Indie Rock',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQbR0zMpaaVGbj0-J27gtLY7hDiKG1OJ-JlA&s',
    description: 'An indie rock band known for their ethereal sound and captivating live performances.',
    social: {
      instagram: 'themidnightecho',
      twitter: 'midnightecho',
      youtube: 'themidnightecho'
    },
    upcomingEvents: 5
  },
  {
    id: 2,
    name: 'Neon Dreams',
    genre: 'Electronic',
    image: 'https://yt3.googleusercontent.com/NbXkS2QeeANfEOXOvWzIakzPT3fikvq6b51rWfKMbFRChKaXVNnrbKHzpLLSq3f94QFVw16YzA=s900-c-k-c0x00ffffff-no-rj',
    description: 'Electronic music duo creating dreamy soundscapes that transport you to another dimension.',
    social: {
      instagram: 'neondreams',
      twitter: 'neondreams',
      youtube: 'neondreams'
    },
    upcomingEvents: 3
  },
  {
    id: 3,
    name: 'Soul Revival',
    genre: 'R&B/Soul',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWrKTvOew9iSmsqG2IOFZYJGipTmhYfYl0Aw&s',
    description: 'Bringing back the golden era of soul with smooth vocals and rich instrumentals.',
    social: {
      instagram: 'soulrevival',
      twitter: 'soulrevival',
      youtube: 'soulrevival'
    },
    upcomingEvents: 7
  },
  {
    id: 4,
    name: 'The High Notes',
    genre: 'Jazz',
    image: 'https://m.media-amazon.com/images/I/714yvBkcXbL._AC_UF1000,1000_QL80_.jpg',
    description: 'Contemporary jazz ensemble pushing the boundaries of traditional jazz music.',
    social: {
      instagram: 'thehighnotes',
      twitter: 'highnotesjazz',
      youtube: 'thehighnotes'
    },
    upcomingEvents: 4
  }
];

const Artists = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 to-dark-800 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Featured Artists</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover talented artists from around the world. Click on an artist to learn more about their music and upcoming shows.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {artists.map((artist) => (
            <div key={artist.id} className="bg-dark-700 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="relative">
                <img 
                  src={artist.image} 
                  alt={artist.name} 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4 w-full">
                  <h2 className="text-2xl font-bold text-white">{artist.name}</h2>
                  <div className="flex items-center text-primary-400">
                    <Music className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">{artist.genre}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-gray-300 mb-4 line-clamp-3">{artist.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-block bg-dark-600 text-primary-400 text-xs px-3 py-1 rounded-full">
                    {artist.upcomingEvents} {artist.upcomingEvents === 1 ? 'Upcoming Show' : 'Upcoming Shows'}
                  </span>
                  
                  <div className="flex space-x-3">
                    <a 
                      href={`https://instagram.com/${artist.social.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-pink-500 transition-colors"
                      aria-label={`${artist.name} on Instagram`}
                    >
                      <Instagram className="h-5 w-5" />
                    </a>
                    <a 
                      href={`https://twitter.com/${artist.social.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                      aria-label={`${artist.name} on Twitter`}
                    >
                      <Twitter className="h-5 w-5" />
                    </a>
                    <a 
                      href={`https://youtube.com/${artist.social.youtube}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      aria-label={`${artist.name} on YouTube`}
                    >
                      <Youtube className="h-5 w-5" />
                    </a>
                  </div>
                </div>
                
                <Link
                  to={`/artists/${artist.id}`}
                  className="block w-full text-center bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Want to perform at our events?</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            We're always looking for talented artists to join our events. Apply now to be considered for future shows.
          </p>
          <button className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-medium py-3 px-8 rounded-full hover:from-primary-600 hover:to-secondary-600 transition-all">
            Apply as an Artist
          </button>
        </div>
      </div>
    </div>
  );
};

export default Artists;
