import { jsPDF } from 'jspdf';

/**
 * Generate professional PDF tickets at Kenyan National ID size (85.6mm x 54mm)
 * Each ticket gets its own page
 */
export async function generateTicketPDF(tickets, event) {
  // ID card size in mm (landscape)
  const width = 85.6;
  const height = 54;
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [width, height] });

  for (let i = 0; i < tickets.length; i++) {
    const ticket = tickets[i];
    if (i > 0) doc.addPage([width, height], 'landscape');

    const headerColor = event?.ticketTemplate?.headerColor || '#ff5f00';
    const r = parseInt(headerColor.slice(1, 3), 16);
    const g = parseInt(headerColor.slice(3, 5), 16);
    const b = parseInt(headerColor.slice(5, 7), 16);

    // Background
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, width, height, 'F');

    // Header bar
    doc.setFillColor(r, g, b);
    doc.rect(0, 0, width, 12, 'F');

    // Event title in header
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    const titleText = (event?.title || ticket.eventTitle || 'Event').substring(0, 45);
    doc.text(titleText, 3, 5);

    // Ticket type
    doc.setFontSize(5.5);
    doc.setFont('helvetica', 'normal');
    doc.text(ticket.typeName || 'General', 3, 9);

    // Body content
    doc.setTextColor(26, 26, 26);

    // Attendee name - prominent
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    const displayName = (ticket.ownerName || ticket.attendeeData?.['Full Name'] || ticket.attendeeData?.['Name'] || 'Attendee').toUpperCase();
    doc.text(displayName, 3, 18);

    // Details
    doc.setFontSize(5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(85, 85, 85);

    let yPos = 22;

    // Show date if available
    if (event?.date?.start) {
      const date = new Date(event.date.start);
      const dateStr = date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
      const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
      doc.text(`Date: ${dateStr} at ${timeStr}`, 3, yPos);
      yPos += 3.5;
    }

    // Show venue
    if (event?.venue?.name) {
      doc.text(`Venue: ${event.venue.name}, ${event.venue.city || ''}`, 3, yPos);
      yPos += 3.5;
    }

    // Show organizer-selected fields from attendee data
    const showFields = event?.ticketTemplate?.showFields || [];
    const attendeeData = ticket.attendeeData || {};

    if (showFields.length > 0) {
      showFields.forEach((fieldName) => {
        if (attendeeData[fieldName] && yPos < 38) {
          doc.text(`${fieldName}: ${attendeeData[fieldName]}`, 3, yPos);
          yPos += 3.5;
        }
      });
    } else {
      // Show all attendee data if no specific fields selected
      Object.entries(attendeeData).forEach(([key, value]) => {
        if (value && yPos < 38 && key !== 'Full Name' && key !== 'Name') {
          doc.text(`${key}: ${value}`, 3, yPos);
          yPos += 3.5;
        }
      });
    }

    // Custom message
    if (event?.ticketTemplate?.customMessage) {
      doc.setFontSize(4.5);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(r, g, b);
      doc.text(`"${event.ticketTemplate.customMessage}"`, 3, Math.min(yPos + 1, 39));
    }

    // QR Code area (right side)
    const qrX = width - 22;
    const qrY = 14;
    const qrSize = 18;

    // QR code placeholder border
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.rect(qrX, qrY, qrSize, qrSize);

    // Generate QR code as data URL and embed
    try {
      const QRCode = await import('qrcode');
      const validationUrl = `${window.location.origin}/api/tickets/validate/qr/${ticket.ticketCode}`;
      const qrDataUrl = await QRCode.default.toDataURL(validationUrl, {
        width: 200,
        margin: 1,
        errorCorrectionLevel: 'H',
      });
      doc.addImage(qrDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);
    } catch (e) {
      // If QR generation fails, show placeholder text
      doc.setFontSize(4);
      doc.setTextColor(150, 150, 150);
      doc.text('QR CODE', qrX + 5, qrY + 10);
    }

    // Ticket number below QR
    doc.setFontSize(5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(26, 26, 26);
    doc.text(ticket.ticketNumber || 'DOM-XXXX', qrX, qrY + qrSize + 3);

    // Bottom bar - Dominion branding
    const bottomY = height - 7;
    doc.setFillColor(245, 245, 245);
    doc.rect(0, bottomY, width, 7, 'F');

    doc.setDrawColor(r, g, b);
    doc.setLineWidth(0.5);
    doc.line(0, bottomY, width, bottomY);

    doc.setFontSize(5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(26, 26, 26);
    doc.text('DOMINION TICKETS', 3, bottomY + 3);

    doc.setFontSize(4);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('Dominion Softwares Ltd | Tel: 0740 881 485', 3, bottomY + 5.5);
  }

  // Save
  const eventSlug = event?.slug || event?.title?.toLowerCase().replace(/\s+/g, '-') || 'ticket';
  doc.save(`dominion-tickets-${eventSlug}.pdf`);
}
