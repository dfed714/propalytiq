
import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  amount: string;
  plan: string;
  paymentMethod: string;
  customerName: string;
  customerEmail: string;
  paymentStatus: string;
}

export const generateInvoicePDF = (invoiceData: InvoiceData) => {
  // Create a new PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  // Define colours
  const primaryColor = '#1E3A8A'; // propalytiq blue
  const secondaryColor = '#14B8A6'; // propalytiq teal
  const textColor = '#334155'; // Slate
  
  // Helper function for wrapping text
  const splitText = (text: string, maxWidth: number) => {
    return doc.splitTextToSize(text, maxWidth);
  };
  
  // Add invoice header
  doc.setFillColor(primaryColor);
  doc.rect(0, 0, 210, 40, 'F');
  
  // Add logo
  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('PROPALYTIQ', 20, 20);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Property Investment Intelligence', 20, 28);
  
  // Invoice title
  doc.setFontSize(24);
  doc.setTextColor(textColor);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', 20, 60);
  
  // Invoice details
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Invoice Number: ${invoiceData.invoiceNumber}`, 20, 70);
  doc.text(`Date: ${invoiceData.date}`, 20, 77);
  
  // Customer details
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Bill To:', 20, 95);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(invoiceData.customerName, 20, 102);
  doc.text(invoiceData.customerEmail, 20, 109);
  
  // Line items header
  doc.setFillColor(240, 240, 240);
  doc.rect(20, 125, 170, 10, 'F');
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(textColor);
  doc.text('Description', 25, 132);
  doc.text('Amount', 160, 132, { align: 'right' });
  
  // Line item
  doc.setFont('helvetica', 'normal');
  doc.text(`Propalytiq ${invoiceData.plan} Plan`, 25, 145);
  doc.text(invoiceData.amount, 160, 145, { align: 'right' });
  
  // Total
  doc.setFillColor(245, 245, 245);
  doc.rect(20, 155, 170, 10, 'F');
  doc.setFont('helvetica', 'bold');
  doc.text('Total', 25, 162);
  doc.text(invoiceData.amount, 160, 162, { align: 'right' });
  
  // Payment information
  doc.setFontSize(12);
  doc.text('Payment Information:', 20, 182);
  doc.setFont('helvetica', 'normal');
  doc.text(`Payment Method: ${invoiceData.paymentMethod}`, 20, 189);
  doc.text(`Payment Status: ${invoiceData.paymentStatus}`, 20, 196);
  
  // Thank you message
  doc.setFillColor(secondaryColor);
  doc.setTextColor(255, 255, 255);
  doc.roundedRect(20, 220, 170, 20, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.text('Thank you for choosing Propalytiq!', 105, 232, { align: 'center' });
  
  // Footer
  doc.setTextColor(textColor);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Propalytiq Ltd', 20, 270);
  doc.text('123 Investment Street, London, UK', 20, 276);
  doc.text('VAT Number: GB123456789', 20, 282);
  
  // Add page numbers
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(textColor);
    doc.text(`Page ${i} of ${pageCount}`, 170, 290);
  }
  
  // Save the PDF
  const pdfBlob = doc.output('blob');
  saveAs(pdfBlob, `Propalytiq_Invoice_${invoiceData.invoiceNumber}.pdf`);
  
  return pdfBlob;
};

export default generateInvoicePDF;
