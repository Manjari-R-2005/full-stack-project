// Simple email utility using EmailJS (optional). Configure service/template/user IDs to enable.
// For demo, we no-op and resolve immediately.
import emailjs from 'emailjs-com'

export async function sendBookingEmail({ toEmail, event, bookingId, type, qty, amount }){
  try{
    // Uncomment and configure to enable real emails
    // await emailjs.send(
    //   import.meta.env.VITE_EMAILJS_SERVICE_ID,
    //   import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
    //   {
    //     to_email: toEmail,
    //     event_name: event.name,
    //     event_date: event.date,
    //     event_venue: event.venue,
    //     booking_id: bookingId,
    //     seat_type: String(type).toUpperCase(),
    //     quantity: qty,
    //     amount: amount,
    //   },
    //   import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    // )
    return true
  }catch(err){
    console.warn('Email send skipped/error:', err)
    return false
  }
}
