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
