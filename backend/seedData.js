const mongoose = require('mongoose');
const Event = require('./models/Event');
<<<<<<< HEAD
=======
const User = require('./models/User');
>>>>>>> 7df5785370399dba91a4613466a0805dde142abf
require('dotenv').config();

const sampleEvents = [
  {
<<<<<<< HEAD
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
=======
    title: "AR Rahman Live in Chennai",
    description: "Experience the maestro AR Rahman live in concert with his greatest hits and new compositions. A magical evening of music that transcends boundaries.",
    date: new Date('2024-09-05'),
    venue: {
      name: "Marina Arena",
      address: "Marina Beach Road, Chennai",
      capacity: 20000
    },
    artists: [
      { name: "AR Rahman", genre: "Classical/Film", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop" }
    ],
    ticketTypes: [
      { type: "Regular", price: 2000, total: 12000, available: 8000, features: ["General Seating", "Concert Access"] },
      { type: "VIP", price: 5000, total: 5000, available: 3000, features: ["Premium Seating", "Meet & Greet", "Exclusive Merchandise"] },
      { type: "Backstage Pass", price: 10000, total: 500, available: 200, features: ["Backstage Access", "Photo with Artist", "Signed Merchandise", "Premium Catering"] }
    ],
    poster: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=1200&fit=crop",
    featured: true,
    category: "Concert",
    duration: "3 hours",
    status: "upcoming"
  },
  {
    title: "Coldplay World Tour",
    description: "Experience Coldplay's spectacular world tour with stunning visuals, pyrotechnics, and their greatest hits spanning two decades.",
    date: new Date('2024-10-15'),
    venue: {
      name: "Wembley Stadium",
      address: "Wembley, London",
      capacity: 90000
    },
    artists: [
      { name: "Coldplay", genre: "Alternative Rock", image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&h=400&fit=crop" }
    ],
    ticketTypes: [
      { type: "Regular", price: 1500, total: 60000, available: 45000, features: ["Stadium Seating", "Concert Access"] },
      { type: "VIP", price: 3500, total: 20000, available: 15000, features: ["Premium Seating", "VIP Lounge Access", "Merchandise Package"] },
      { type: "Backstage Pass", price: 8000, total: 1000, available: 500, features: ["Backstage Access", "Meet & Greet", "Signed Merchandise", "Premium Hospitality"] }
    ],
    poster: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&h=1200&fit=crop",
    featured: true,
    category: "Concert",
    duration: "2.5 hours",
    status: "upcoming"
  },
  {
    title: "Sunburn Electronic Festival",
    description: "India's biggest electronic music festival featuring top international DJs and stunning production. Dance the night away under the stars.",
    date: new Date('2024-11-20'),
    venue: {
      name: "Vagator Beach",
      address: "Vagator, Goa",
      capacity: 50000
    },
    artists: [
      { name: "Martin Garrix", genre: "EDM", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop" },
      { name: "David Guetta", genre: "EDM", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop" }
    ],
    ticketTypes: [
      { type: "Regular", price: 3000, total: 30000, available: 20000, features: ["Festival Access", "Food Court Access"] },
      { type: "VIP", price: 6000, total: 15000, available: 10000, features: ["VIP Area", "Premium Bar", "Artist Meet Zone"] },
      { type: "Backstage Pass", price: 12000, total: 2000, available: 1200, features: ["Backstage Access", "Artist Interaction", "Premium Hospitality", "Exclusive Merchandise"] }
    ],
    poster: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=1200&fit=crop",
    featured: false,
    category: "Festival",
    duration: "8 hours",
    status: "upcoming"
  },
  {
    title: "Bollywood Night Live",
    description: "A spectacular evening of Bollywood music with live performances by top playback singers and dancers. Relive the magic of Hindi cinema.",
    date: new Date('2024-12-10'),
    venue: {
      name: "NSCI Dome",
      address: "Worli, Mumbai",
      capacity: 8000
    },
    artists: [
      { name: "Arijit Singh", genre: "Bollywood", image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop" },
      { name: "Shreya Ghoshal", genre: "Bollywood", image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=400&fit=crop" }
    ],
    ticketTypes: [
      { type: "Regular", price: 2500, total: 5000, available: 3500, features: ["Concert Access", "Souvenir Program"] },
      { type: "VIP", price: 5000, total: 2500, available: 1800, features: ["Premium Seating", "Meet & Greet", "Signed Poster"] },
      { type: "Backstage Pass", price: 10000, total: 500, available: 300, features: ["Backstage Access", "Photo Session", "Exclusive Merchandise", "VIP Dinner"] }
    ],
    poster: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&h=1200&fit=crop",
    featured: true,
    category: "Concert",
    duration: "4 hours",
    status: "upcoming"
  }
];

// Sample users for testing
const sampleUsers = [
  {
    name: "Admin User",
    email: "admin@concerthub.com",
    password: "admin123", // Will be hashed by the model
    phone: "+91-9876543210",
    role: "admin"
  },
  {
    name: "John Doe",
    email: "john@example.com",
    password: "user123", // Will be hashed by the model
    phone: "+91-9876543211",
    role: "user"
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    password: "user123", // Will be hashed by the model
    phone: "+91-9876543212",
    role: "user"
>>>>>>> 7df5785370399dba91a4613466a0805dde142abf
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/concert-events');
    console.log('Connected to MongoDB');
    
<<<<<<< HEAD
    // Clear existing events
    await Event.deleteMany({});
    console.log('Cleared existing events');
=======
    // Clear existing data
    await Event.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data');
    
    // Insert sample users
    await User.insertMany(sampleUsers);
    console.log('Sample users inserted successfully');
>>>>>>> 7df5785370399dba91a4613466a0805dde142abf
    
    // Insert sample events
    await Event.insertMany(sampleEvents);
    console.log('Sample events inserted successfully');
    
<<<<<<< HEAD
    mongoose.connection.close();
    console.log('Database seeded and connection closed');
  } catch (error) {
    console.error('Error seeding database:', error);
=======
    console.log('\n=== SEED DATA SUMMARY ===');
    console.log('✅ 3 Users created (1 admin, 2 regular users)');
    console.log('✅ 4 Events created (3 featured, 1 regular)');
    console.log('\n=== LOGIN CREDENTIALS ===');
    console.log('Admin: admin@concerthub.com / admin123');
    console.log('User 1: john@example.com / user123');
    console.log('User 2: jane@example.com / user123');
    console.log('\n=== EVENTS CREATED ===');
    sampleEvents.forEach((event, index) => {
      console.log(`${index + 1}. ${event.title} - ${event.venue.name} (${event.featured ? 'Featured' : 'Regular'})`);
    });
    
    mongoose.connection.close();
    console.log('\nDatabase seeded successfully and connection closed');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
>>>>>>> 7df5785370399dba91a4613466a0805dde142abf
  }
}

seedDatabase();
