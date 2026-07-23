import { jsPDF } from 'jspdf';

/**
 * Generate a Software Requirements Specification (SRS) PDF document for an application
 */
export function generateSRSPDF(application) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  let y = 15;

  const checkPageBreak = (neededHeight = 15) => {
    if (y + neededHeight > pageHeight - 15) {
      doc.addPage();
      y = 15;
      // Header for sub pages
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(150, 150, 150);
      doc.text('DOMINION SOFTWARES LTD — SOFTWARE REQUIREMENTS SPECIFICATION (SRS)', margin, y);
      doc.setDrawColor(230, 230, 230);
      doc.line(margin, y + 2, pageWidth - margin, y + 2);
      y += 10;
    }
  };

  // Title Banner
  doc.setFillColor(249, 115, 22); // Orange #F97316
  doc.rect(margin, y, contentWidth, 22, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('SOFTWARE REQUIREMENTS SPECIFICATION (SRS)', margin + 6, y + 10);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Dominion Softwares Ltd • Requirements Engineering & System Design', margin + 6, y + 17);

  y += 28;

  // Metadata Card
  doc.setFillColor(248, 246, 240);
  doc.setDrawColor(230, 220, 200);
  doc.rect(margin, y, contentWidth, 32, 'FD');

  doc.setTextColor(30, 30, 30);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Organization / Client: ${application.organizationName || 'Client Project'}`, margin + 5, y + 7);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);

  doc.text(`Org Type: ${application.organizationType === 'Other' ? application.organizationTypeOther : (application.organizationType || 'Not specified')}`, margin + 5, y + 13);
  doc.text(`Client Category: ${application.clientType === 'ministry' ? 'Faith-Based / Ministry' : 'Commercial Business'}`, margin + 5, y + 18);
  doc.text(`Contact Person: ${application.contactPerson} (${application.email})`, margin + 5, y + 23);
  doc.text(`Phone Number: ${application.phone || 'N/A'}`, margin + 5, y + 28);

  const rightColX = margin + contentWidth / 2 + 5;
  doc.text(`Document Ref: SRS-${(application._id || 'DRAFT').substring(0, 8).toUpperCase()}`, rightColX, y + 13);
  doc.text(`SRS Status: ${(application.status || 'pending').toUpperCase()}`, rightColX, y + 18);
  doc.text(`Generated Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}`, rightColX, y + 23);
  doc.text(`Agreed Timeline: ${application.timeline || 'TBD'}`, rightColX, y + 28);

  y += 38;

  // Section 1: Executive Summary & Vision Statement
  checkPageBreak(30);
  doc.setFillColor(254, 237, 222);
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setTextColor(194, 65, 12);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('1. EXECUTIVE SUMMARY & PROJECT VISION', margin + 4, y + 5);
  y += 10;

  doc.setTextColor(40, 40, 40);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text('Primary Business / Ministry Goal:', margin, y);
  y += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  const goalLines = doc.splitTextToSize(application.primaryGoal || 'Not specified', contentWidth);
  doc.text(goalLines, margin, y);
  y += goalLines.length * 4 + 4;

  checkPageBreak(25);
  doc.setTextColor(40, 40, 40);
  doc.setFont('helvetica', 'bold');
  doc.text('Target Audience:', margin, y);
  y += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  const audienceLines = doc.splitTextToSize(application.targetAudience || 'Not specified', contentWidth);
  doc.text(audienceLines, margin, y);
  y += audienceLines.length * 4 + 4;

  checkPageBreak(30);
  doc.setTextColor(40, 40, 40);
  doc.setFont('helvetica', 'bold');
  doc.text('Detailed Requirements & Problem Description:', margin, y);
  y += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  const descLines = doc.splitTextToSize(application.projectDescription || 'Not specified', contentWidth);
  doc.text(descLines, margin, y);
  y += descLines.length * 4 + 6;

  // Section 2: Technical Specifications & System Architecture
  checkPageBreak(30);
  doc.setFillColor(254, 237, 222);
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setTextColor(194, 65, 12);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('2. TECHNICAL & FUNCTIONAL REQUIREMENTS', margin + 4, y + 5);
  y += 10;

  const techDetails = [
    ['Content Management Model', application.contentManagement === 'dynamic' ? 'Dynamic Admin CMS Dashboard (User updates content without code)' : 'Static Content Page'],
    ['User Authentication & Accounts', application.needAccounts === 'no' ? 'None (Public Access)' : application.needAccounts === 'members' ? 'Member/User Accounts' : 'Multi-Role Accounts (Members & Leadership/Admin)'],
    ['Specific Account Roles Needed', (application.accountTypes && application.accountTypes.length > 0) ? application.accountTypes.join(', ') : 'Default Role Access'],
    ['Payment Gateway Integration', application.paymentIntegration === 'mobile' ? 'M-Pesa Mobile Money (STK Push)' : application.paymentIntegration === 'global' ? 'Mobile Money + Credit/Debit Cards' : 'No Online Payments'],
    ['Additional System Integrations', application.specificFeatures || 'Standard Web Solution'],
    ['Budgetary Range', application.budget || 'Not specified'],
    ['Target Timeline', application.timeline || 'Not specified'],
  ];

  techDetails.forEach(([label, value]) => {
    checkPageBreak(12);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(40, 40, 40);
    doc.text(`${label}:`, margin, y);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(70, 70, 70);
    const valLines = doc.splitTextToSize(value, contentWidth - 55);
    doc.text(valLines, margin + 55, y);
    y += Math.max(valLines.length * 4, 5) + 1.5;
  });

  y += 4;

  // Section 3: Requirements Engineering & Attached Media Artifacts
  checkPageBreak(30);
  doc.setFillColor(254, 237, 222);
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setTextColor(194, 65, 12);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('3. ATTACHED REQUIREMENTS ARTIFACTS & BRAND ASSETS', margin + 4, y + 5);
  y += 10;

  if (application.attachedFiles && application.attachedFiles.length > 0) {
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text(`The client submitted ${application.attachedFiles.length} media artifact(s) for Requirements Engineering analysis:`, margin, y);
    y += 6;

    application.attachedFiles.forEach((file, idx) => {
      checkPageBreak(10);
      doc.setFillColor(250, 250, 250);
      doc.rect(margin, y, contentWidth, 7, 'F');
      doc.setDrawColor(240, 240, 240);
      doc.rect(margin, y, contentWidth, 7, 'D');

      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 30, 30);
      doc.text(`${idx + 1}. ${file.name}`, margin + 3, y + 4.5);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text(`Category: ${file.category || 'General'} | Size: ${(file.size ? (file.size / 1024 / 1024).toFixed(2) + ' MB' : 'N/A')}`, margin + 90, y + 4.5);

      y += 9;
    });
  } else {
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(120, 120, 120);
    doc.text('No initial media files attached. Client will provide assets during portal onboarding negotiations.', margin, y);
    y += 8;
  }

  y += 6;

  // Section 4: Sign-off & Approval Record
  checkPageBreak(40);
  doc.setFillColor(254, 237, 222);
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setTextColor(194, 65, 12);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('4. SIGN-OFF & APPROVAL RECORD', margin + 4, y + 5);
  y += 12;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text('By signing below, both parties acknowledge and agree to the requirements specified in this document.', margin, y);
  y += 14;

  const colW = (contentWidth - 10) / 2;

  // Dominion Sign block
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y, margin + colW, y);
  doc.setFont('helvetica', 'bold');
  doc.text('Dominion Softwares Ltd Representative', margin, y + 4);
  doc.setFont('helvetica', 'normal');
  doc.text('Date: ________________________', margin, y + 9);

  // Client Sign block
  const clientX = margin + colW + 10;
  doc.line(clientX, y, clientX + colW, y);
  doc.setFont('helvetica', 'bold');
  doc.text(`${application.contactPerson} (${application.organizationName})`, clientX, y + 4);
  doc.setFont('helvetica', 'normal');
  doc.text('Date: ________________________', clientX, y + 9);

  // Download PDF
  const filename = `SRS-${(application.organizationName || 'Client').replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
  doc.save(filename);
}
