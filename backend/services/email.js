const nodemailer = require('nodemailer');

function buildTransporter() {
  const host = (process.env.SMTP_HOST || 'smtp.gmail.com').trim();
  const useGmailService = /gmail\.com$/i.test(host);
  const secure = String(process.env.SMTP_SECURE || 'false') === 'true';
  const port = Number(process.env.SMTP_PORT || (secure ? 465 : 587));

  const user = (process.env.SMTP_USER || '').trim();
  const pass = (process.env.SMTP_PASS || '').trim();

  if (!user || !pass) {
    console.error('SMTP config error: SMTP_USER/SMTP_PASS are missing or empty.');
    console.error(`SMTP_USER present: ${Boolean(user)} | SMTP_PASS present: ${Boolean(pass)}`);
  }

  const common = {
    auth: {
      user,
      pass,
    },
    // Helps in some corporate networks; safe for development
    tls: { rejectUnauthorized: false },
  };

  if (useGmailService) {
    return nodemailer.createTransport({
      service: 'gmail',
      ...common,
    });
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    ...common,
  });
}

const transporter = buildTransporter();

async function verifyTransporter() {
  try {
    await transporter.verify();
    console.log('SMTP: transporter verified and ready.');
  } catch (err) {
    console.error('SMTP verification failed:', err?.message || err);
  }
}

async function sendOTPEmail(to, code) {
  const from = process.env.EMAIL_FROM || `ConcertHub <${process.env.SMTP_USER || 'no-reply@concerthub.local'}>`;
  const mail = {
    from,
    to,
    subject: 'Your ConcertHub OTP Code',
    text: `Your ConcertHub OTP is ${code}. It expires in 5-10 minutes.`,
    html: `
      <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:auto;padding:24px;border:1px solid #eee;border-radius:12px;">
        <h2 style="margin:0 0 12px;color:#7c3aed;">ConcertHub</h2>
        <p style="margin:0 0 12px;color:#333;">Use the following OTP to continue:</p>
        <div style="font-size:28px;letter-spacing:6px;font-weight:700;background:#f6f3ff;color:#4c1d95;padding:16px 20px;border-radius:10px;display:inline-block;">${code}</div>
        <p style="margin:12px 0 0;color:#666;font-size:12px;">This code expires in 5 minutes.</p>
      </div>
    `,
  };
  return transporter.sendMail(mail);
}

async function sendPasswordResetSuccess(to) {
  const from = process.env.EMAIL_FROM || `ConcertHub <${process.env.SMTP_USER || 'no-reply@concerthub.local'}>`;
  const mail = {
    from,
    to,
    subject: 'Your ConcertHub password was changed',
    text: 'Your ConcertHub account password was changed successfully.',
    html: `
      <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:auto;padding:24px;border:1px solid #eee;border-radius:12px;">
        <h2 style="margin:0 0 12px;color:#16a34a;">Password updated</h2>
        <p style="margin:0;color:#333;">Your ConcertHub account password was changed successfully.</p>
      </div>
    `,
  };
  return transporter.sendMail(mail);
}

async function sendBookingConfirmation(to, booking) {
  const from = process.env.EMAIL_FROM || `ConcertHub <${process.env.SMTP_USER || 'no-reply@concerthub.local'}>`;
  const { eventTitle, date, time, venue, city, ticketType, quantity, total, bookingId } = booking || {};
  const mail = {
    from,
    to,
    subject: `Your ConcertHub Tickets: ${eventTitle}`,
    text: `Booking Confirmed (ID: ${bookingId})\nEvent: ${eventTitle}\nWhen: ${date} ${time}\nWhere: ${venue}, ${city}\nTickets: ${quantity} x ${ticketType}\nTotal: $${total}`,
    html: `
      <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:auto;padding:24px;border:1px solid #eee;border-radius:12px;">
        <h2 style="margin:0 0 12px;color:#16a34a;">Booking Confirmed</h2>
        <p style="margin:0 0 8px;color:#333;">Your tickets are confirmed. Here are your details:</p>
        <div style="margin-top:12px;padding:16px;background:#0b1220;color:#fff;border-radius:10px;">
          <div><strong>Booking ID:</strong> ${bookingId}</div>
          <div><strong>Event:</strong> ${eventTitle}</div>
          <div><strong>Date:</strong> ${date} ${time}</div>
          <div><strong>Venue:</strong> ${venue}, ${city}</div>
          <div><strong>Tickets:</strong> ${quantity} x ${ticketType}</div>
          <div style="margin-top:8px;font-size:18px;"><strong>Total:</strong> $${total}</div>
        </div>
        <p style="margin:12px 0 0;color:#666;font-size:12px;">Thank you for choosing ConcertHub.</p>
      </div>
    `,
  };
  return transporter.sendMail(mail);
}

async function sendAnnouncementEmail(to, subject, message) {
  const from = process.env.EMAIL_FROM || `ConcertHub <${process.env.SMTP_USER || 'no-reply@concerthub.local'}>`;
  const mail = {
    from,
    to,
    subject: subject || 'ConcertHub Announcement',
    text: message || 'New update from ConcertHub',
    html: `
      <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:auto;padding:24px;border:1px solid #eee;border-radius:12px;">
        <h2 style="margin:0 0 12px;color:#7c3aed;">${subject || 'ConcertHub Announcement'}</h2>
        <p style="margin:0;color:#333;white-space:pre-line;">${(message || '').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</p>
      </div>
    `,
  };
  return transporter.sendMail(mail);
}

module.exports = { transporter, verifyTransporter, sendOTPEmail, sendPasswordResetSuccess, sendBookingConfirmation, sendAnnouncementEmail };
