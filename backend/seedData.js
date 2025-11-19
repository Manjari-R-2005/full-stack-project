const mongoose = require('mongoose');
const Event = require('./models/Event');
require('dotenv').config();

const sampleEvents = [
  {
    title: "Neon Nights Festival",
    description: "Experience the ultimate electronic music festival with world-renowned DJs and stunning visual effects. A night of pulsating beats and electrifying performances.",
    artist: "Calvin Harris",
    lineup: ["Calvin Harris", "David Guetta", "Tiësto", "Armin van Buuren"],
    date: new Date('2024-03-15'),
    time: "8:00 PM",
    venue: {
      name: "Electric Arena",
      address: "123 Music Boulevard",
      city: "Los Angeles",
      capacity: 15000
    },
    poster: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=1200&fit=crop",
    ticketTypes: [
      { type: "Regular", price: 89, totalTickets: 8000, soldTickets: 2500 },
      { type: "VIP", price: 199, totalTickets: 2000, soldTickets: 800 },
      { type: "Backstage Pass", price: 399, totalTickets: 200, soldTickets: 50 }
    ],
    featured: true,
    genre: "Electronic",
    duration: "6 hours"
  },
  {
    title: "Rock Revolution",
    description: "The biggest rock concert of the year featuring legendary bands and emerging rock stars. Get ready for an unforgettable night of pure rock energy.",
    artist: "Foo Fighters",
    lineup: ["Foo Fighters", "Green Day", "The Killers", "Arctic Monkeys"],
    date: new Date('2024-03-22'),
    time: "7:30 PM",
    venue: {
      name: "Thunder Stadium",
      address: "456 Rock Street",
      city: "Chicago",
      capacity: 25000
    },
    poster: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&h=1200&fit=crop",
    ticketTypes: [
      { type: "Regular", price: 75, totalTickets: 15000, soldTickets: 5000 },
      { type: "VIP", price: 150, totalTickets: 3000, soldTickets: 1200 },
      { type: "Backstage Pass", price: 300, totalTickets: 500, soldTickets: 150 }
    ],
    featured: true,
    genre: "Rock",
    duration: "5 hours"
  },
  {
    title: "Jazz Under Stars",
    description: "An intimate evening of smooth jazz under the starlit sky. Experience the finest jazz musicians in a sophisticated outdoor setting.",
    artist: "Kamasi Washington",
    lineup: ["Kamasi Washington", "Robert Glasper", "Esperanza Spalding", "Brad Mehldau"],
    date: new Date('2024-03-29'),
    time: "8:30 PM",
    venue: {
      name: "Moonlight Gardens",
      address: "789 Jazz Avenue",
      city: "New Orleans",
      capacity: 3000
    },
    poster: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=1200&fit=crop",
    ticketTypes: [
      { type: "Regular", price: 65, totalTickets: 2000, soldTickets: 800 },
      { type: "VIP", price: 120, totalTickets: 800, soldTickets: 300 },
      { type: "Backstage Pass", price: 250, totalTickets: 200, soldTickets: 80 }
    ],
    featured: false,
    genre: "Jazz",
    duration: "4 hours"
  },
  {
    title: "Hip-Hop Legends",
    description: "The greatest hip-hop artists come together for one epic night. Witness legendary performances and surprise collaborations.",
    artist: "Kendrick Lamar",
    lineup: ["Kendrick Lamar", "J. Cole", "Tyler, The Creator", "SZA"],
    date: new Date('2024-04-05'),
    time: "8:00 PM",
    venue: {
      name: "Urban Center",
      address: "321 Hip Hop Lane",
      city: "Atlanta",
      capacity: 12000
    },
    poster: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=1200&fit=crop",
    ticketTypes: [
      { type: "Regular", price: 95, totalTickets: 8000, soldTickets: 3500 },
      { type: "VIP", price: 180, totalTickets: 2500, soldTickets: 1000 },
      { type: "Backstage Pass", price: 350, totalTickets: 300, soldTickets: 120 }
    ],
    featured: true,
    genre: "Hip-Hop",
    duration: "4.5 hours"
  },
  {
    title: "Indie Vibes Festival",
    description: "Discover the best indie artists and bands in an intimate festival setting. Perfect for music lovers seeking fresh sounds.",
    artist: "Tame Impala",
    lineup: ["Tame Impala", "Mac DeMarco", "King Gizzard", "FKA twigs"],
    date: new Date('2024-04-12'),
    time: "6:00 PM",
    venue: {
      name: "Indie Park",
      address: "654 Alternative Road",
      city: "Portland",
      capacity: 8000
    },
    poster: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&h=1200&fit=crop",
    ticketTypes: [
      { type: "Regular", price: 70, totalTickets: 5000, soldTickets: 2000 },
      { type: "VIP", price: 130, totalTickets: 1500, soldTickets: 600 },
      { type: "Backstage Pass", price: 280, totalTickets: 250, soldTickets: 100 }
    ],
    featured: false,
    genre: "Indie",
    duration: "5 hours"
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/concert-events');
    console.log('Connected to MongoDB');
    
    // Clear existing events
    await Event.deleteMany({});
    console.log('Cleared existing events');
    
    // Insert sample events
    await Event.insertMany(sampleEvents);
    console.log('Sample events inserted successfully');
    
    mongoose.connection.close();
    console.log('Database seeded and connection closed');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

seedDatabase();
