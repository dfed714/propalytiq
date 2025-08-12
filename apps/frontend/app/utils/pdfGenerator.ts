
import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';

// Mock data for the demo reports
const mockReportData = {
  propertyAddress: "123 High Street, London, SW1A 1AA",
  propertyType: "Semi-detached house",
  propertyPrice: "£450,000",
  propertySize: "1,200 sq ft",
  propertyBedrooms: 3,
  propertyBathrooms: 2,
  propertyReceptionRooms: 1,
  propertyGarden: "Yes",
  propertyParkingSpaces: 1,
  propertyCentralHeating: "Gas",
  propertyEnergyRating: "C",
  propertyCouncilTax: "Band D",
  propertyTenure: "Freehold",
  propertyYearBuilt: 1990,
  
  // Investment metrics
  roi: "5.8%",
  netYield: "4.2%",
  grossYield: "5.4%",
  cashFlow: "£3,600 per year",
  capRate: "5.2%",
  breakEven: "93%",
  
  // Rental estimates
  rentalEstimate: "£1,650 per month",
  rentalDemand: "High",
  vacancyRate: "2.5%",
  
  // Market data
  areaGrowth: "4.2% per year",
  comparableProperties: [
    {
      address: "125 High Street",
      price: "£455,000",
      size: "1,180 sq ft",
      sold: "3 months ago"
    },
    {
      address: "130 High Street",
      price: "£470,000",
      size: "1,250 sq ft",
      sold: "1 month ago"
    }
  ],
  
  // Risk assessment
  riskScore: "Low-Medium",
  riskFactors: [
    "Property in established area with strong demand",
    "Good transport links",
    "Multiple schools nearby"
  ],
  
  // Recommendations
  recommendations: [
    "Potential for extension to increase value",
    "Consider upgrading energy efficiency to improve rating",
    "High rental demand makes this suitable for buy-to-let"
  ]
};

export const generatePropertyReport = () => {
  // Create a new PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  // Define colours
  const primaryColor = '#3B82F6'; // Blue
  const secondaryColor = '#1E293B'; // Dark blue/slate
  const textColor = '#334155'; // Slate
  
  // Helper function for wrapping text
  const splitText = (text: string, maxWidth: number) => {
    return doc.splitTextToSize(text, maxWidth);
  };
  
  // Cover page
  doc.setFillColor(primaryColor);
  doc.rect(0, 0, 210, 60, 'F');
  
  // Add logo
  // Note: In a real implementation, you would load an actual logo
  doc.setFillColor(255, 255, 255);
  doc.setFontSize(30);
  doc.setTextColor(255, 255, 255);
  doc.text('PROPALYTIQ', 20, 30);
  
  // Report title
  doc.setFontSize(24);
  doc.setTextColor(secondaryColor);
  doc.text('Property Investment Analysis', 20, 80);
  
  // Property address
  doc.setFontSize(18);
  doc.text(mockReportData.propertyAddress, 20, 90);
  
  // Date
  const today = new Date();
  doc.setFontSize(12);
  doc.setTextColor(textColor);
  doc.text(`Report generated on: ${today.toLocaleDateString('en-GB')}`, 20, 100);
  
  // Horizontal line
  doc.setDrawColor(primaryColor);
  doc.setLineWidth(0.5);
  doc.line(20, 110, 190, 110);
  
  // Property details section
  doc.setFontSize(16);
  doc.setTextColor(primaryColor);
  doc.text('Property Details', 20, 130);
  
  doc.setFontSize(12);
  doc.setTextColor(textColor);
  doc.text(`Type: ${mockReportData.propertyType}`, 25, 140);
  doc.text(`Price: ${mockReportData.propertyPrice}`, 25, 147);
  doc.text(`Size: ${mockReportData.propertySize}`, 25, 154);
  doc.text(`Bedrooms: ${mockReportData.propertyBedrooms}`, 25, 161);
  doc.text(`Bathrooms: ${mockReportData.propertyBathrooms}`, 25, 168);
  
  // Investment metrics section
  doc.setFontSize(16);
  doc.setTextColor(primaryColor);
  doc.text('Investment Metrics', 20, 185);
  
  doc.setFontSize(12);
  doc.setTextColor(textColor);
  doc.text(`Return on Investment: ${mockReportData.roi}`, 25, 195);
  doc.text(`Net Yield: ${mockReportData.netYield}`, 25, 202);
  doc.text(`Gross Yield: ${mockReportData.grossYield}`, 25, 209);
  doc.text(`Cash Flow: ${mockReportData.cashFlow}`, 25, 216);
  
  // Add new page
  doc.addPage();
  
  // Header for second page
  doc.setFillColor(primaryColor);
  doc.rect(0, 0, 210, 20, 'F');
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text('PROPALYTIQ - Property Investment Analysis', 20, 14);
  
  // Risk assessment
  doc.setFontSize(16);
  doc.setTextColor(primaryColor);
  doc.text('Risk Assessment', 20, 40);
  
  doc.setFontSize(12);
  doc.setTextColor(textColor);
  doc.text(`Risk Score: ${mockReportData.riskScore}`, 25, 50);
  doc.text('Risk Factors:', 25, 60);
  
  let yPosition = 67;
  mockReportData.riskFactors.forEach(factor => {
    doc.text(`• ${factor}`, 30, yPosition);
    yPosition += 7;
  });
  
  // Recommendations
  yPosition += 10;
  doc.setFontSize(16);
  doc.setTextColor(primaryColor);
  doc.text('Recommendations', 20, yPosition);
  
  yPosition += 10;
  doc.setFontSize(12);
  doc.setTextColor(textColor);
  mockReportData.recommendations.forEach(rec => {
    doc.text(`• ${rec}`, 30, yPosition);
    yPosition += 7;
  });
  
  // Disclaimer
  yPosition += 15;
  doc.setFontSize(10);
  doc.text('DISCLAIMER:', 20, yPosition);
  yPosition += 6;
  const disclaimer = 'This report is provided for informational purposes only. Propalytiq does not accept any responsibility for decisions made based on this information. The analysis provided is not financial advice and should not be interpreted as such. Property investments carry risk, and values can go down as well as up. All data presented is based on current market conditions and estimates, which may change. Always consult with qualified financial and legal advisors before making investment decisions.';
  
  const wrappedDisclaimer = splitText(disclaimer, 170);
  doc.text(wrappedDisclaimer, 20, yPosition);
  
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
  saveAs(pdfBlob, `Propalytiq_Report_${today.toISOString().split('T')[0]}.pdf`);
};

export default generatePropertyReport;
