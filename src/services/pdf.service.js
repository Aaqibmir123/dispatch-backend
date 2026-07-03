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
      <td style="padding: 14px 12px; font-size: 12px; text-align: center;">${index + 1}</td>
      <td style="padding: 14px 12px; font-size: 12px; white-space: nowrap;">${formatDate(trip.tripDate)}</td>
      <td style="padding: 14px 12px; font-size: 12px; font-weight: bold; color: #1e293b;">${trip.vrid || "N/A"}</td>
      <td style="padding: 14px 12px; font-size: 12px;">${trip.route || "N/A"}</td>
      <td style="padding: 14px 12px; font-size: 12px;">${trip.pickup || "N/A"} to ${trip.drop || "N/A"}</td>
      <td style="padding: 14px 12px; font-size: 12px; text-align: right;">${formatCurrency(trip.totalCharges)}</td>
      <td style="padding: 14px 12px; font-size: 12px; text-align: center; color: #475569;">${trip.dispatchPercent}%</td>
      <td style="padding: 14px 12px; font-size: 12px; text-align: right; font-weight: 600; color: #b91c1c;">${formatCurrency(trip.dispatchAmount)}</td>
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
            color: #1e293b;
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact;
            position: relative;
          }
          .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 48px;
            font-weight: 900;
            color: rgba(226, 232, 240, 0.25);
            letter-spacing: 4px;
            white-space: nowrap;
            z-index: -1000;
            pointer-events: none;
          }
          .header-table,
          .details-table,
          .items-table,
          .totals-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 16px;
          }
          .invoice-title {
            font-size: 24px;
            font-weight: 800;
            letter-spacing: 1px;
            color: #102a63;
            margin: 0;
          }
          .badge {
            padding: 10px 14px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            border-radius: 999px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }
          .badge-approved { background-color: #ecfdf5; border: 1px solid #bbf7d0; color: #166534; }
          .badge-rejected { background-color: #fee2e2; border: 1px solid #fecaca; color: #991b1b; }
          .badge-paid { background-color: #eff6ff; border: 1px solid #bfdbfe; color: #1d4ed8; }
          .badge-pending { background-color: #fef3c7; border: 1px solid #fde68a; color: #92400e; }
          .badge-draft { background-color: #f1f5f9; border: 1px solid #e2e8f0; color: #475569; }
          th { font-weight: 700; }
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
              <h3 style="font-size: 11px; text-transform: uppercase; color: #475569; margin: 0 0 6px 0; letter-spacing: 0.5px; font-weight: 700;">EXTREME LOGISTIC INVOICE FROM:</h3>
              <strong style="font-size: 13px; color: #dc2626;">${invoice.payee?.companyName || invoice.payee?.customerName || "N/A"}</strong>
              <p style="font-size: 11px; line-height: 1.4; color: #475569; margin: 4px 0;">
                ${invoice.payee?.address1 || invoice.payee?.address || "N/A"}<br/>
                <b>Driver Name:</b> ${invoice.payee?.contactPerson || invoice.payee?.driverName || "N/A"}<br/>
                <b>Phone:</b> ${invoice.payee?.phone || "N/A"}<br/>
                <b>Email:</b> ${invoice.payee?.email || "N/A"}<br/>
                <b>GST/HST:</b> ${invoice.payee?.gstNumber || "N/A"}
              </p>
            </td>
            <td style="vertical-align: top; width: 50%; padding-left: 10px;">
              <h3 style="font-size: 11px; text-transform: uppercase; color: #475569; margin: 0 0 6px 0; letter-spacing: 0.5px; font-weight: 700;">INVOICE TO:</h3>
              <strong style="font-size: 13px; color: #2563eb;">${invoice.customer?.companyName || invoice.customer?.customerName || "N/A"}</strong>
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
              <th style="padding: 8px 4px; font-size: 11px; text-align: center; width: 8%;">Dispatch%</th>
              <th style="padding: 8px 6px; font-size: 11px; border-top-right-radius: 4px; text-align: right; width: 12%;">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            ${tripRows}
          </tbody>
        </table>

        <table class="totals-table" style="margin-left: auto; width: 35%; margin-top: 10px;">
          <tr>
            <td style="padding: 10px 12px; font-size: 12px; color: #475569;">Subtotal:</td>
            <td style="padding: 10px 12px; font-size: 12px; text-align: right; color: #0f172a; font-weight: 500;">${formatCurrency(invoice.subtotal)}</td>
          </tr>
          <tr style="border-top: 1px solid #e2e8f0;">
            <td style="padding: 16px 12px 12px 12px; font-size: 13px; font-weight: bold; color: #1e3a8a;">Grand Total:</td>
            <td style="padding: 16px 12px 12px 12px; font-size: 15px; font-weight: bold; text-align: right; color: #2563eb;">${formatCurrency(invoice.grandTotal)}</td>
          </tr>
        </table>

        ${
          invoice.accountNumber || invoice.payee?.eTransferAddress
            ? `
          <div style="margin-top: 24px; border-top: 1px dashed #cbd5e1; padding-top: 12px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                ${invoice.accountNumber ? `
                  <td style="width: ${invoice.payee?.eTransferAddress ? '50%' : '100%'}; padding-right: ${invoice.payee?.eTransferAddress ? '10px' : '0'}; vertical-align: top;">
                    <h4 style="font-size: 10px; text-transform: uppercase; color: #64748b; margin: 0 0 4px 0; letter-spacing: 0.5px;">Direct Deposit Details</h4>
                    <p style="font-size: 10px; color: #475569; margin: 0; line-height: 1.6; white-space: nowrap;">
                      Institution Number: ${invoice.institutionNumber || "N/A"} | Transit Number: ${invoice.transitNumber || "N/A"} | Account Number: ${invoice.accountNumber}
                    </p>
                  </td>
                ` : ''}
                ${invoice.payee?.eTransferAddress ? `
                  <td style="width: ${invoice.accountNumber ? '50%' : '100%'}; padding-left: ${invoice.accountNumber ? '10px' : '0'}; vertical-align: top; ${invoice.accountNumber ? 'border-left: 1px dashed #cbd5e1;' : ''}">
                    <h4 style="font-size: 10px; text-transform: uppercase; color: #2563eb; margin: 0 0 4px 0; letter-spacing: 0.5px; font-weight: 700;">💥 E-Transfer Details</h4>
                    <p style="font-size: 10px; color: #1e293b; margin: 0; line-height: 1.4; font-weight: 600;">
                      <b>E-Transfer Email:</b> ${invoice.payee?.eTransferAddress}
                    </p>
                  </td>
                ` : ''}
              </tr>
            </table>
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