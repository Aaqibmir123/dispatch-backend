const pdf = require("html-pdf-node");
const fs = require("fs");
const path = require("path");

const generateInvoicePDF = async (invoice) => {
  const dir = path.join(process.cwd(), "uploads/invoices");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const filePath = path.join(dir, `invoice-${invoice.invoiceNumber}.pdf`);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: invoice.currency || "CAD",
    }).format(amount || 0);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-CA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // 🔄 Dynamic Multi/Single Header Tracker Engine Rule
  const tripsCount = invoice.trips?.length || 0;
  const dynamicInvoiceTitle = tripsCount > 1 ? "INVOICE - T" : "INVOICE - 1";

  const tripRows = (invoice.trips || [])
    .map(
      (trip, index) => `
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 8px 6px; font-size: 11px; text-align: center;">${index + 1}</td>
      <td style="padding: 8px 6px; font-size: 11px; white-space: nowrap;">${formatDate(trip.tripDate)}</td>
      <td style="padding: 8px 6px; font-size: 11px; font-weight: bold; color: #1e293b;">${trip.vrid || "N/A"}</td>
      <td style="padding: 8px 6px; font-size: 11px;">${trip.route || "N/A"}</td>
      <td style="padding: 8px 6px; font-size: 11px;">${trip.pickup || "N/A"} to ${trip.drop || "N/A"}</td>
      <td style="padding: 8px 6px; font-size: 11px; text-align: right;">${formatCurrency(trip.totalCharges)}</td>
      <td style="padding: 8px 6px; font-size: 11px; text-align: center; color: #475569;">${trip.dispatchPercent}%</td>
      <td style="padding: 8px 6px; font-size: 11px; text-align: right; font-weight: 600; color: #b91c1c;">${formatCurrency(trip.dispatchAmount)}</td>
    </tr>
  `
    )
    .join("");

  const html = `
    <html>
      <head>
        <style>
          @page { size: A4; margin: 8mm 10mm; }
          body { 
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; 
            color: #334155; 
            margin: 0; 
            padding: 0; 
            -webkit-print-color-adjust: exact;
            position: relative;
          }
          /* 🛡️ Diagonal Transparent Watermark Layout */
          .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 48px;
            font-weight: 900;
            color: rgba(226, 232, 240, 0.45);
            text-transform: uppercase;
            letter-spacing: 4px;
            white-space: nowrap;
            z-index: -1000;
            pointer-events: none;
          }
          .header-table, .details-table, .items-table, .totals-table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
          .invoice-title { font-size: 24px; font-weight: 800; letter-spacing: 0.5px; color: #1e3a8a; margin: 0; }
          .badge { padding: 4px 8px; font-size: 10px; font-weight: bold; text-transform: uppercase; border-radius: 4px; display: inline-block; }
          .badge-paid { background-color: #dcfce7; color: #15803d; }
          .badge-pending { background-color: #fef9c3; color: #a16207; }
          .badge-draft { background-color: #f1f5f9; color: #475569; }
          th { font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="watermark">EXTREME LOGISTICS</div>

        <table class="header-table">
          <tr>
            <td>
              <h1 class="invoice-title">${dynamicInvoiceTitle}</h1>
              <span style="font-size: 12px; color: #64748b;">Num: <b>#${invoice.invoiceNumber}</b></span>
            </td>
            <td style="text-align: right; vertical-align: top;">
              <div class="badge badge-${(invoice.invoiceStatus || "draft").toLowerCase()}">${invoice.invoiceStatus || "Draft"}</div>
              <p style="font-size: 11px; color: #64748b; margin: 4px 0 0 0;">Date: ${formatDate(invoice.invoiceDate || invoice.createdAt)}</p>
            </td>
          </tr>
        </table>

        <hr style="border: 0; border-top: 2px solid #f1f5f9; margin-bottom: 16px;" />

        <table class="details-table" style="table-layout: fixed;">
          <tr>
            <td style="vertical-align: top; width: 50%; padding-right: 10px;">
              <h3 style="font-size: 11px; text-transform: uppercase; color: #475569; margin: 0 0 6px 0; letter-spacing: 0.5px; font-weight: 700;">Extreme Logistic Invoice From:</h3>
              <strong style="font-size: 13px; color: #0f172a;">${invoice.payee?.companyName || "N/A"}</strong>
              <p style="font-size: 11px; line-height: 1.4; color: #475569; margin: 4px 0;">
                ${invoice.payee?.address1 || invoice.payee?.address || "N/A"}<br/>
                <b>Driver Name:</b> ${invoice.payee?.contactPerson || invoice.payee?.driverName || "N/A"}<br/>
                <b>Phone:</b> ${invoice.payee?.phone || "N/A"}<br/>
                <b>Email:</b> ${invoice.payee?.email || "N/A"}<br/>
                <b>GST/HST:</b> ${invoice.payee?.gstNumber || "N/A"}
              </p>
            </td>
            <td style="vertical-align: top; width: 50%; padding-left: 10px;">
              <h3 style="font-size: 11px; text-transform: uppercase; color: #475569; margin: 0 0 6px 0; letter-spacing: 0.5px; font-weight: 700;">Invoice To:</h3>
              <strong style="font-size: 13px; color: #0f172a;">${invoice.customer?.companyName || "N/A"}</strong>
              <p style="font-size: 11px; line-height: 1.4; color: #475569; margin: 4px 0;">
                ${invoice.customer?.address1 || invoice.customer?.address || "N/A"}<br/>
                <b>Attention:</b> ${invoice.customer?.contactPerson || "N/A"}<br/>
                <b>Phone:</b> ${invoice.customer?.phone || "N/A"}<br/>
                <b>Email:</b> ${invoice.customer?.email || "N/A"}<br/>
                <b>GST/HST:</b> ${invoice.customer?.gstNumber || "N/A"}
              </p>
            </td>
          </tr>
        </table>

        ${
          invoice.invoicePeriod?.startDate
            ? `
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 8px 10px; border-radius: 4px; font-size: 11px; margin-bottom: 16px; color: #334155;">
            📅 <b>Billing Period:</b> ${formatDate(invoice.invoicePeriod.startDate)} — ${formatDate(invoice.invoicePeriod.endDate)}
          </div>
        `
            : ""
        }

        <table class="items-table">
          <thead>
            <tr style="background-color: #1e3a8a; color: #ffffff;">
              <th style="padding: 8px 4px; font-size: 11px; border-top-left-radius: 4px; text-align: center; width: 4%;">#</th>
              <th style="padding: 8px 6px; font-size: 11px; text-align: left; width: 12%;">Date</th>
              <th style="padding: 8px 6px; font-size: 11px; text-align: left; width: 15%;">VRID</th>
              <th style="padding: 8px 6px; font-size: 11px; text-align: left; width: 10%;">Route</th>
              <th style="padding: 8px 6px; font-size: 11px; text-align: left; width: 27%;">Description</th>
              <th style="padding: 8px 6px; font-size: 11px; text-align: right; width: 12%;">Charges</th>
              <th style="padding: 8px 4px; font-size: 11px; text-align: center; width: 8%;">Disp%</th>
              <th style="padding: 8px 6px; font-size: 11px; border-top-right-radius: 4px; text-align: right; width: 12%;">Disp. Amt</th>
            </tr>
          </thead>
          <tbody>
            ${tripRows}
          </tbody>
        </table>

        <table class="totals-table" style="margin-left: auto; width: 35%; margin-top: 10px;">
          <tr>
            <td style="padding: 4px 6px; font-size: 11px; color: #475569;">Subtotal:</td>
            <td style="padding: 4px 6px; font-size: 11px; text-align: right; color: #0f172a; font-weight: 500;">${formatCurrency(invoice.subtotal)}</td>
          </tr>
          <tr style="border-top: 1.5px solid #cbd5e1;">
            <td style="padding: 6px; font-size: 12px; font-weight: bold; color: #1e3a8a;">Grand Total:</td>
            <td style="padding: 6px; font-size: 13px; font-weight: bold; text-align: right; color: #1e3a8a;">${formatCurrency(invoice.grandTotal)}</td>
          </tr>
        </table>

        ${
          invoice.accountNumber
            ? `
          <div style="margin-top: 24px; border-top: 1px dashed #cbd5e1; padding-top: 12px;">
            <h4 style="font-size: 10px; text-transform: uppercase; color: #64748b; margin: 0 0 4px 0; letter-spacing: 0.5px;">Direct Deposit Details</h4>
            <p style="font-size: 10px; color: #475569; margin: 0; line-height: 1.4;">
              <b>Institution Number:</b> ${invoice.institutionNumber || "N/A"} | 
              <b>Transit Number:</b> ${invoice.transitNumber || "N/A"} | 
              <b>Account Number:</b> ${invoice.accountNumber}
            </p>
          </div>
        `
            : ""
        }

        ${
          invoice.notes
            ? `
          <div style="margin-top: 12px; font-size: 10px; color: #64748b; font-style: italic;">
            <b>Notes:</b> ${invoice.notes}
          </div>
        `
            : ""
        }
      </body>
    </html>
  `;

  const file = { content: html };
  const options = { format: "A4", printBackground: true };

  console.log("🚀 Rendering Professional Layout Template with Watermark...");
  const pdfBuffer = await pdf.generatePdf(file, options);
  fs.writeFileSync(filePath, pdfBuffer);
  console.log("✅ PROFESSIONAL PDF COPIED TO STORAGE:", filePath);

  return filePath;
};

module.exports = generateInvoicePDF;