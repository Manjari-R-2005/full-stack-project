import jsPDF from 'jspdf'

export function generateReceipt({ bookingId, event, user, type, qty, amount }){
  const doc = new jsPDF()
  const line = (y)=> doc.line(20, y, 190, y)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.setTextColor(40, 40, 60)
  doc.text('ConcertHub Receipt', 20, 20)

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(60, 60, 80)
  doc.text(`Booking ID: ${bookingId}`, 20, 30)
  doc.text(`Date: ${new Date().toLocaleString()}`, 20, 36)
  line(40)

  doc.setFont('helvetica', 'bold')
  doc.setTextColor(40, 40, 60)
  doc.text('Event Details', 20, 50)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(60, 60, 80)
  doc.text(`Name: ${event.name}`, 20, 58)
  doc.text(`Venue: ${event.venue}`, 20, 64)
  doc.text(`Date: ${event.date}`, 20, 70)

  doc.setFont('helvetica', 'bold')
  doc.setTextColor(40, 40, 60)
  doc.text('Booking', 20, 84)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(60, 60, 80)
  doc.text(`Seat Type: ${String(type).toUpperCase()}`, 20, 92)
  doc.text(`Quantity: ${qty}`, 20, 98)
  doc.text(`Amount Paid: ₹ ${amount}`, 20, 104)

  line(112)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(40, 40, 60)
  doc.text('Billed To', 20, 122)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(60, 60, 80)
  doc.text(`${user.name}`, 20, 130)
  doc.text(`${user.email}`, 20, 136)
  doc.text(`${user.phone || ''}`, 20, 142)

  doc.save(`ConcertHub_Receipt_${bookingId}.pdf`)
}
