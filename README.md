# 🎵 ConcertHub - Music/Concert Event Management System

A comprehensive full-stack application built with the MERN stack (MongoDB, Express, React, Node.js) for managing music concerts and events. Features include event showcase, ticket booking, user management, admin panel, and QR code generation for tickets.

## ✨ Features

### 🏠 Homepage & Event Showcase
- **Featured Events Display**: Highlighted concerts with stunning visuals
- **Event Categories**: Filter by Concert, Festival, Live Show, DJ Night
- **Search Functionality**: Find events by artist, venue, or event name
- **Responsive Design**: Beautiful UI that works on all devices

### 🎫 Event Details & Booking
- **Comprehensive Event Info**: Artist lineup, venue details, pricing
- **Multiple Ticket Types**: Regular, VIP, Backstage Pass options
- **Real-time Availability**: Live ticket count updates
- **Interactive Booking Flow**: Smooth ticket selection and payment

### 👤 User Management
- **User Registration/Login**: JWT-based authentication
- **User Dashboard**: View bookings, download tickets, cancel reservations
- **Profile Management**: Update personal information
- **Booking History**: Complete transaction history

### 🛡️ Admin Panel
- **Event Management**: Create, edit, delete events
- **Booking Oversight**: View all bookings and manage status
- **User Administration**: Manage user accounts and roles
- **Analytics Dashboard**: Revenue tracking and booking statistics

### 📱 Advanced Features
- **QR Code Tickets**: Unique QR codes for each booking
- **Real-time Updates**: Live ticket availability
- **Email Confirmations**: Booking confirmations (simulated)
- **Responsive Design**: Mobile-first approach

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd concert-events-system
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd backend && npm install
   
   # Install frontend dependencies
   cd ../frontend && npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/concert-events
   JWT_SECRET=your-super-secret-jwt-key
   NODE_ENV=development
   ```

4. **Database Setup**
   ```bash
   # Start MongoDB (if running locally)
   mongod
   
   # Seed the database with sample data
   cd backend && node seedData.js
   ```

5. **Start the Application**
   
   **Option 1: Start both servers simultaneously**
   ```bash
   npm run dev
   ```
   
   **Option 2: Start servers individually**
   ```bash
   # Terminal 1 - Backend
   npm run server
   
   # Terminal 2 - Frontend
   npm run client
   ```

6. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 🎯 Sample Login Credentials

After running the seed data, you can use these credentials:

### Admin Account
- **Email**: admin@concerthub.com
- **Password**: admin123
- **Access**: Full admin panel with event management capabilities

### User Accounts
- **Email**: john@example.com
- **Password**: user123
- **Email**: jane@example.com
- **Password**: user123

## 📋 Sample Events Created

1. **AR Rahman Live in Chennai** (Featured)
   - Venue: Marina Arena, Chennai
   - Date: September 5, 2024
   - Ticket Types: Regular (₹2000), VIP (₹5000), Backstage Pass (₹10000)

2. **Coldplay World Tour** (Featured)
   - Venue: Wembley Stadium, London
   - Date: October 15, 2024
   - Ticket Types: Regular (£1500), VIP (£3500), Backstage Pass (£8000)

3. **Sunburn Electronic Festival** (Regular)
   - Venue: Vagator Beach, Goa
   - Date: November 20, 2024
   - Ticket Types: Regular (₹3000), VIP (₹6000), Backstage Pass (₹12000)

4. **Bollywood Night Live** (Featured)
   - Venue: NSCI Dome, Mumbai
   - Date: December 10, 2024
   - Ticket Types: Regular (₹2500), VIP (₹5000), Backstage Pass (₹10000)

## 🛠️ Technical Stack

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: Database
- **Mongoose**: ODM for MongoDB
- **JWT**: Authentication
- **bcryptjs**: Password hashing
- **QRCode**: QR code generation
- **CORS**: Cross-origin resource sharing

### Frontend
- **React**: UI library
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **Framer Motion**: Animations
- **Tailwind CSS**: Styling
- **Lucide React**: Icons
- **date-fns**: Date formatting

## 📁 Project Structure

```
concert-events-system/
├── backend/
│   ├── middleware/
│   │   └── auth.js          # JWT authentication middleware
│   ├── models/
│   │   ├── Event.js         # Event data model
│   │   ├── User.js          # User data model
│   │   └── Booking.js       # Booking data model
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   ├── events.js        # Event management routes
│   │   ├── bookings.js      # Booking routes
│   │   └── users.js         # User management routes
│   ├── seedData.js          # Database seeding script
│   ├── server.js            # Express server setup
│   └── package.json         # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx   # Navigation component
│   │   │   ├── Footer.jsx   # Footer component
│   │   │   └── ProtectedRoute.jsx # Route protection
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Authentication context
│   │   ├── pages/
│   │   │   ├── Homepage.jsx     # Landing page
│   │   │   ├── EventDetails.jsx # Event details page
│   │   │   ├── BookingPage.jsx  # Ticket booking
│   │   │   ├── Dashboard.jsx    # User dashboard
│   │   │   ├── AdminPanel.jsx   # Admin interface
│   │   │   ├── Login.jsx        # Login page
│   │   │   └── Signup.jsx       # Registration page
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # React entry point
│   └── package.json         # Frontend dependencies
└── package.json             # Root package.json
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Events
- `GET /api/events` - Get all events (with filtering)
- `GET /api/events/featured/list` - Get featured events
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create event (Admin only)
- `PUT /api/events/:id` - Update event (Admin only)
- `PATCH /api/events/:id/tickets` - Update ticket availability

### Bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/my-bookings` - Get user's bookings
- `GET /api/bookings/:id` - Get single booking
- `PATCH /api/bookings/:id/cancel` - Cancel booking
- `GET /api/bookings` - Get all bookings (Admin only)
- `GET /api/bookings/stats/overview` - Get booking statistics (Admin only)

### Users
- `GET /api/users/profile` - Get user profile
- `GET /api/users/dashboard` - Get dashboard data
- `GET /api/users` - Get all users (Admin only)
- `PATCH /api/users/:id/role` - Update user role (Admin only)

## 🎨 Key Features Implementation

### QR Code Generation
- Each booking generates a unique QR code containing booking details
- QR codes are stored as base64 images in the database
- Used for event entry verification

### Real-time Ticket Updates
- Ticket availability updates immediately after booking
- Prevents overselling with availability checks
- Shows remaining tickets with color-coded status

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Smooth animations with Framer Motion
- Glass-morphism effects for modern UI

### Security Features
- JWT-based authentication
- Password hashing with bcrypt
- Protected routes for admin functions
- Input validation and sanitization

## 🚀 Deployment

### Backend Deployment (Heroku)
1. Create a Heroku app
2. Set environment variables
3. Connect to MongoDB Atlas
4. Deploy using Git

### Frontend Deployment (Netlify/Vercel)
1. Build the React app: `npm run build`
2. Deploy the `dist` folder
3. Set environment variables for API URL

### Database (MongoDB Atlas)
1. Create a MongoDB Atlas cluster
2. Update the `MONGODB_URI` in environment variables
3. Whitelist your IP addresses

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🔧 Troubleshooting

### Common Issues

**1. QRCode Module Not Found Error**
```bash
Error: Cannot find module 'qrcode'
```
**Solution**: Make sure to install dependencies in the backend directory:
```bash
cd backend
npm install
```

**2. MongoDB Connection Issues**
- Ensure MongoDB is running locally or MongoDB Atlas connection is correct
- Check the `MONGODB_URI` in your `.env` file
- For local MongoDB: `mongodb://localhost:27017/concert-events`

**3. Frontend Not Loading**
- Ensure both backend and frontend are running
- Backend should be on port 5000, frontend on port 5173
- Check browser console for any CORS errors

**4. Authentication Issues**
- Clear browser localStorage if login problems persist
- Ensure JWT_SECRET is set in backend .env file

## 🆘 Support

For support or questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints
- Check the troubleshooting section above

## 🎉 Enjoy Your Music Event Management System!

This system provides a complete solution for managing music concerts and events. From event creation to ticket booking and QR code generation, everything is handled seamlessly. Start exploring the features and create amazing experiences for music lovers!

---

**Built with ❤️ using the MERN stack**