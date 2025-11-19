<<<<<<< HEAD
# 🎵 ConcertHub - Music/Concert Event Management System

A modern, full-stack MERN application for discovering and booking tickets to live music events, concerts, and festivals.

## ✨ Features

### 🏠 Homepage (Event Showcase)
- **Stunning Hero Section** with animated elements and gradient backgrounds
- **Featured Events** showcase with large, attractive cards
- **All Events Grid** with hover effects and smooth animations
- **Responsive Design** that works perfectly on all devices
- **Modern UI/UX** with glassmorphism effects and smooth transitions

### 🎫 Event Details Page
- **Comprehensive Event Information** including artist lineup, venue details, and descriptions
- **Interactive Ticket Booking** with multiple ticket types (Regular, VIP, Backstage Pass)
- **Real-time Ticket Availability** showing remaining tickets with color-coded status
- **Dynamic Pricing Display** and quantity selection
- **Venue Information** with capacity and location details
- **Booking Confirmation** with success/error feedback

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **Tailwind CSS** for modern, responsive styling
- **Framer Motion** for smooth animations and transitions
- **React Router DOM** for navigation
- **Axios** for API communication
- **Lucide React** for beautiful icons
- **date-fns** for date formatting

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **CORS** for cross-origin requests
- **dotenv** for environment configuration
- **RESTful API** design

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd full-stack
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

5. **Set up environment variables**
   
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/concert-events
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

6. **Seed the database with sample data**
   ```bash
   cd backend
   node seedData.js
   ```

7. **Start the application**
   
   From the root directory:
   ```bash
   npm run dev
   ```
   
   Or start services individually:
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev
   
   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

## 📱 Application Structure

```
full-stack/
├── backend/
│   ├── models/
│   │   └── Event.js          # Event schema with ticket types
│   ├── routes/
│   │   └── events.js         # Event API endpoints
│   ├── .env                  # Environment variables
│   ├── server.js             # Express server setup
│   ├── seedData.js           # Sample data for testing
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx    # Navigation component
│   │   │   └── Footer.jsx    # Footer component
│   │   ├── pages/
│   │   │   ├── Homepage.jsx  # Main event showcase
│   │   │   └── EventDetails.jsx # Event details & booking
│   │   ├── App.jsx           # Main app component
│   │   ├── main.jsx          # React entry point
│   │   └── index.css         # Global styles with Tailwind
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
└── package.json              # Root package.json
```

## 🎨 Design Features

### Visual Design
- **Dark Theme** with purple/pink gradient accents
- **Glassmorphism Effects** for modern UI elements
- **Smooth Animations** using Framer Motion
- **Responsive Grid Layouts** for all screen sizes
- **High-Quality Images** from Unsplash for event posters

### User Experience
- **Intuitive Navigation** with sticky header
- **Loading States** for better user feedback
- **Interactive Elements** with hover effects
- **Form Validation** for ticket booking
- **Real-time Updates** for ticket availability

## 🔧 API Endpoints

### Events
- `GET /api/events` - Get all upcoming events
- `GET /api/events/featured` - Get featured events
- `GET /api/events/:id` - Get single event details
- `POST /api/events` - Create new event (admin)
- `PATCH /api/events/:id/book-tickets` - Book tickets

## 🎯 Key Features Implemented

### Homepage
✅ **Event Showcase** with attractive poster displays  
✅ **Featured Artists/Bands** highlighting  
✅ **Ticket Booking CTA** ("Book Now" buttons)  
✅ **Responsive Design** for all devices  
✅ **Smooth Animations** and transitions  

### Event Details Page
✅ **Event Description** with artist lineup and timings  
✅ **Ticket Pricing** (Regular, VIP, Backstage Pass)  
✅ **Remaining Ticket Count** with visual indicators  
✅ **Book Tickets** functionality with quantity selection  
✅ **Venue Information** with capacity and location  

## 🌟 Sample Events Included

1. **Neon Nights Festival** - Electronic music with Calvin Harris
2. **Rock Revolution** - Rock concert featuring Foo Fighters
3. **Jazz Under Stars** - Intimate jazz evening with Kamasi Washington
4. **Hip-Hop Legends** - Hip-hop showcase with Kendrick Lamar
5. **Indie Vibes Festival** - Indie music festival with Tame Impala

## 🚀 Deployment

The application is ready for deployment on platforms like:
- **Frontend**: Vercel, Netlify, or GitHub Pages
- **Backend**: Heroku, Railway, or DigitalOcean
- **Database**: MongoDB Atlas for cloud database

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ using the MERN Stack**
=======
# ConcertHub

A professional, aesthetic, and responsive concert/music event management system built with React + Vite.

## Tech
- React 18, React Router 6
- Vite 5
- Recharts (admin analytics)
- qrcode.react (QR codes for tickets)

## Run locally
```bash
# from the project root
npm install
npm run dev
```
App will open on http://localhost:5173

## Build
```bash
npm run build
npm run preview
```

## Notes
- Mock data is stored in `src/data/mock.js` and persisted in `localStorage` via `src/context/AppContext.jsx`.
- Admin can add/edit/delete events in `Admin Dashboard`.
- Booking flow reduces live seat availability and generates a booking ID + QR code visible in `User Dashboard`.
>>>>>>> 424a72e4310214fb9ec7ef934ad0594429015dd4
