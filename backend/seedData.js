const mongoose = require('mongoose');
const Event = require('./models/Event');
const User = require('./models/User');
require('dotenv').config();

const sampleEvents = [
  {
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
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/concert-events');
    console.log('Connected to MongoDB');
    
    // Clear existing data
    await Event.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data');
    
    // Insert sample users
    await User.insertMany(sampleUsers);
    console.log('Sample users inserted successfully');
    
    // Insert sample events
    await Event.insertMany(sampleEvents);
    console.log('Sample events inserted successfully');
    
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
  }
}

seedDatabase();
