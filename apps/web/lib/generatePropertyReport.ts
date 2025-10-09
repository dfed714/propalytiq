"use client";

import { jsPDF } from "jspdf";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import { Analysis, Property } from "@dtos";

interface PropertyReportInput {
  propertyData: Property;
  analysisData: Analysis;
}

export default async function generatePropertyReport(
  input: PropertyReportInput
) {
  // ---------- helpers ----------
  const num = (v: unknown, d = 0): number =>
    typeof v === "number" && Number.isFinite(v)
      ? v
      : typeof v === "string" && Number.isFinite(Number(v))
      ? Number(v)
      : d;

  const str = (v: unknown, d = "—"): string =>
    typeof v === "string" && v.trim().length > 0 ? v : d;

  // ---------- normalized data ----------
  const { propertyData, analysisData } = input;

  // ---------- PDF generation ----------
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const primaryColor = "#3B82F6";
  const textColor = "#334155";
  const maxTextWidth = 160; // Max width for text to prevent overflow
  const pageWidth = 210; // A4 width in mm
  const pageHeight = 297; // A4 height in mm
  const margin = 25; // Side margins

  const splitText = (text: string, maxWidth: number) =>
    doc.splitTextToSize(text, maxWidth);

  // Calculate text height for dynamic y positioning
  const getTextHeight = (
    text: string | string[],
    fontSize: number,
    maxWidth: number
  ) => {
    doc.setFontSize(fontSize);
    const lines = Array.isArray(text) ? text : splitText(text, maxWidth);
    return lines.length * (fontSize * 0.3528 + 2); // Approx mm per line
  };

  // Cover
  // Add Propalytiq logo
  const logoWidth = 20; // Max width for cover logo
  let logoHeight = 20; // Placeholder height, adjusted below
  const logoAspectRatio = 412 / 1706; // height / width
  try {
    // Assume logo is 200x80 pixels (adjust if known)
    logoHeight = logoWidth * logoAspectRatio;
    doc.addImage(
      "/images/propalytiq-logo.png",
      "PNG",
      margin,
      10,
      logoWidth,
      logoHeight
    );
  } catch (error) {
    console.error("Failed to load logo:", error);
    doc.setFontSize(30).setTextColor(textColor).text("PROPALYTIQ", margin, 30);
  }
  // Center-align title
  doc.setFontSize(24).setTextColor(textColor);
  const titleText = "Property Investment Analysis";
  doc.text(titleText, pageWidth / 2, 30, { align: "center" });
  // Address
  doc.setFontSize(18).setTextColor(textColor);
  const addressLines = splitText(str(propertyData.address), maxTextWidth);
  let y = 50;
  addressLines.forEach((line: string | string[]) => {
    doc.text(line, margin, y);
    y += 6;
  });

  const today = new Date();
  doc.setFontSize(12).setTextColor(textColor);
  doc.text(
    `Report generated on: ${today.toLocaleDateString("en-GB")}`,
    margin,
    y
  );
  y += 10;

  doc
    .setDrawColor(primaryColor)
    .setLineWidth(0.5)
    .line(margin, y, pageWidth - margin, y);
  y += 10;

  // Property details
  doc
    .setFontSize(16)
    .setTextColor(primaryColor)
    .text("Property Details", margin, y);
  y += 10;
  doc.setFontSize(12).setTextColor(textColor);
  const propertyFields = [
    `Type: ${str(propertyData.property_type, "Property")}`,
    `Price: ${str(propertyData.price, "£0")}`,
    `Bedrooms: ${num(propertyData.bedrooms, 0)}`,
    `Bathrooms: ${num(propertyData.bathrooms, 0)}`,
    `Description: ${str(propertyData.description, "N/A")}`,
  ];
  propertyFields.forEach((field) => {
    const lines = splitText(field, maxTextWidth);
    lines.forEach((line: string | string[]) => {
      if (y > pageHeight - 30) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, margin + 5, y);
      y += 7;
    });
  });

  // Investment metrics
  y += 10;
  if (y > pageHeight - 30) {
    doc.addPage();
    y = 20;
  }
  doc
    .setFontSize(16)
    .setTextColor(primaryColor)
    .text("Investment Metrics", margin, y);
  y += 10;
  doc.setFontSize(12).setTextColor(textColor);
  doc.text(
    splitText(
      `Investment Strategy: ${str(
        analysisData.investment_strategy,
        "Buy-to-Let"
      )}`,
      maxTextWidth
    ),
    margin + 5,
    y
  );
  y += getTextHeight(
    `Investment Strategy: ${str(
      analysisData.investment_strategy,
      "Buy-to-Let"
    )}`,
    12,
    maxTextWidth
  );
  Object.entries(analysisData.top_stats).forEach(([key, value]) => {
    const formattedValue = key.includes("(%)")
      ? `${value}%`
      : `£${Math.abs(Number(value)).toLocaleString()}`;
    const text = `${key}: ${formattedValue}`;
    const lines = splitText(text, maxTextWidth);
    lines.forEach((line: string | string[]) => {
      if (y > pageHeight - 30) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, margin + 5, y);
      y += 7;
    });
  });

  // Page 2
  doc.addPage();
  y = 30;
  // Header with logo and text
  try {
    const headerLogoWidth = 20;
    const headerLogoHeight = headerLogoWidth * logoAspectRatio;
    doc.addImage(
      "/images/propalytiq-logo.png",
      "PNG",
      margin,
      10,
      headerLogoWidth,
      headerLogoHeight
    );
  } catch (error) {
    console.error("Failed to load logo:", error);
    doc.setFontSize(12).setTextColor(textColor).text("PROPALYTIQ", margin, 14);
  }
  doc.setFontSize(12).setTextColor(textColor);

  // Strengths and Weaknesses
  doc
    .setFontSize(16)
    .setTextColor(primaryColor)
    .text("Strengths and Weaknesses", margin, y);
  y += 10;
  doc.setFontSize(12).setTextColor(textColor);
  doc.text("Strengths:", margin + 5, y);
  y += 7;
  analysisData.strengths.forEach((s) => {
    const lines = splitText(`• ${s}`, maxTextWidth);
    lines.forEach((line: string | string[]) => {
      if (y > pageHeight - 30) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, margin + 10, y);
      y += 7;
    });
  });

  y += 10;
  if (y > pageHeight - 30) {
    doc.addPage();
    y = 20;
  }
  doc.setFontSize(12).setTextColor(textColor);
  doc.text("Weaknesses:", margin + 5, y);
  y += 7;
  analysisData.weaknesses.forEach((w) => {
    const lines = splitText(`• ${w}`, maxTextWidth);
    lines.forEach((line: string | string[]) => {
      if (y > pageHeight - 30) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, margin + 10, y);
      y += 7;
    });
  });

  // Recommendations
  y += 20;

  doc
    .setFontSize(16)
    .setTextColor(primaryColor)
    .text("Recommendations", margin, y);
  y += 10;
  doc.setFontSize(12).setTextColor(textColor);
  analysisData.recommendations.forEach((rec) => {
    const lines = splitText(`• ${rec}`, maxTextWidth);
    lines.forEach((line: string | string[]) => {
      if (y > pageHeight - 30) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, margin + 10, y);
      y += 7;
    });
  });

  // Cashflow Projection
  doc.addPage();
  y = 30;
  try {
    const headerLogoWidth = 20;
    const headerLogoHeight = headerLogoWidth * logoAspectRatio;
    doc.addImage(
      "/images/propalytiq-logo.png",
      "PNG",
      margin,
      10,
      headerLogoWidth,
      headerLogoHeight
    );
  } catch (error) {
    console.error("Failed to load logo:", error);
    doc.setFontSize(12).setTextColor(textColor).text("PROPALYTIQ", margin, 14);
  }
  doc.setFontSize(12).setTextColor(textColor);

  doc
    .setFontSize(16)
    .setTextColor(primaryColor)
    .text("Cashflow Projection", margin, y);
  y += 10;
  doc.setFontSize(12).setTextColor(textColor);
  const projectionLabel = str(
    analysisData.projection.x_label,
    "Cashflow Projection"
  );
  doc.text(splitText(projectionLabel, maxTextWidth), margin + 5, y);
  y += getTextHeight(projectionLabel, 12, maxTextWidth);
  const projectionDesc = `Projection based on the provided cashflow data for ${str(
    propertyData.address
  )}`;
  doc.text(splitText(projectionDesc, maxTextWidth), margin + 5, y);
  y += getTextHeight(projectionDesc, 12, maxTextWidth);

  // Capture chart as image
  const chartElement = document.getElementById("cashflow-chart-hidden");
  if (chartElement) {
    try {
      const canvas = await html2canvas(chartElement, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 160; // Width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio
      if (y + imgHeight > pageHeight - 30) {
        doc.addPage();
        y = 20;
      }
      doc.addImage(imgData, "PNG", margin, y, imgWidth, imgHeight);
      y += imgHeight + 10;
    } catch (error) {
      console.error("Failed to capture chart:", error);
      doc.setFontSize(12).setTextColor(textColor);
      doc.text("Chart unavailable", margin + 5, y);
      y += 10;
    }
  } else {
    doc.setFontSize(12).setTextColor(textColor);
    doc.text("Chart unavailable", margin + 5, y);
    y += 10;
  }

  // Disclaimer
  y = pageHeight - 65;

  doc.setFontSize(10).setTextColor(textColor).text("DISCLAIMER:", margin, y);
  y += 6;
  const disclaimer =
    "This report is provided for informational purposes only. Propalytiq does not accept any responsibility for decisions made based on this information. The analysis provided is not financial advice and should not be interpreted as such. Property investments carry risk, and values can go down as well as up. All data presented is based on current market conditions and estimates, which may change. Always consult with qualified financial and legal advisors before making investment decisions.";
  const disclaimerLines = splitText(disclaimer, maxTextWidth);
  disclaimerLines.forEach((line: string | string[]) => {
    if (y > pageHeight - 30) {
      doc.addPage();
      y = 20;
    }
    doc.text(line, margin, y);
    y += 5;
  });

  // Page numbers
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i).setFontSize(10).setTextColor(textColor);
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth - margin - 20,
      pageHeight - 10,
      { align: "right" }
    );
  }

  // Save
  const pdfBlob = doc.output("blob");
  saveAs(pdfBlob, `Propalytiq_Report_${today.toISOString().split("T")[0]}.pdf`);
}
