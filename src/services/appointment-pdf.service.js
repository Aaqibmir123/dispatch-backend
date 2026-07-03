const pdf = require("html-pdf-node");
const fs = require("fs");
const path = require("path");

const generateAppointmentPDF = async (appointment) => {
  const dir = path.join(process.cwd(), "uploads/appointments");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const filePath = path.join(dir, `appointment-${appointment._id}.pdf`);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-CA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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
          /* 🛡️ Circular Logo Watermark */
          .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 400px;
            height: 400px;
            border-radius: 50%;
            overflow: hidden;
            z-index: -1000;
            pointer-events: none;
            opacity: 0.15;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .watermark img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
          .watermark-text {
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
          .header-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          .appointment-title { font-size: 24px; font-weight: 800; letter-spacing: 0.5px; color: #1e3a8a; margin: 0; }
          .badge { 
            padding: 4px 8px; 
            font-size: 10px; 
            font-weight: bold; 
            text-transform: uppercase; 
            border-radius: 4px; 
            display: inline-block; 
          }
          .badge-pending { background-color: #fef9c3; color: #a16207; }
          .badge-confirmed { background-color: #dcfce7; color: #15803d; }
          .badge-completed { background-color: #dbeafe; color: #1e40af; }
          .badge-cancelled { background-color: #fee2e2; color: #991b1b; }
          .details-table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
          .section-title { 
            font-size: 11px; 
            text-transform: uppercase; 
            color: #475569; 
            margin: 0 0 8px 0; 
            letter-spacing: 0.5px; 
            font-weight: 700; 
          }
          .company-name { 
            font-size: 14px; 
            font-weight: 600; 
            color: #1e3a8a; 
            margin: 0 0 8px 0; 
          }
          .info-text { 
            font-size: 11px; 
            line-height: 1.6; 
            color: #475569; 
            margin: 0; 
          }
          .divider { 
            border: 0; 
            border-top: 2px solid #f1f5f9; 
            margin-bottom: 16px; 
          }
          .footer-box {
            margin-top: 24px;
            padding: 12px;
            background-color: #f8fafc;
            border: 1px dashed #cbd5e1;
            border-radius: 4px;
          }
          .footer-title {
            font-size: 10px;
            text-transform: uppercase;
            color: #2563eb;
            margin: 0 0 6px 0;
            letter-spacing: 0.5px;
            font-weight: 700;
          }
          .footer-text {
            font-size: 10px;
            color: #1e293b;
            margin: 0;
            line-height: 1.5;
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        ${appointment.companyLogo ? `
        <div class="watermark">
          <img src="${appointment.companyLogo}" alt="Company Logo" />
        </div>
        ` : '<div class="watermark-text">EXTREME LOGISTICS</div>'}

        <table class="header-table">
          <tr>
            <td>
              <h1 class="appointment-title">APPOINTMENT DETAILS</h1>
              <span style="font-size: 12px; color: #64748b;">Appointment ID: <b>#${appointment._id}</b></span>
            </td>
            <td style="text-align: right; vertical-align: top;">
              <div class="badge badge-${appointment.status.toLowerCase()}">${appointment.status.toUpperCase()}</div>
              <p style="font-size: 11px; color: #64748b; margin: 4px 0 0 0;">Date: ${formatDate(appointment.appointmentDate)}</p>
            </td>
          </tr>
        </table>

        <hr class="divider" />

        <table class="details-table" style="table-layout: fixed;">
          <tr>
            <td style="vertical-align: top; width: 50%; padding-right: 10px;">
              <h3 class="section-title">Company Information:</h3>
              <p class="company-name">${appointment.companyName}</p>
              <p class="info-text">
                <b>Contact Person:</b> ${appointment.contactPerson || "N/A"}<br/>
                <b>Email:</b> ${appointment.email}<br/>
                <b>Phone:</b> ${appointment.phone}<br/>
                ${appointment.province ? `<b>Province:</b> ${appointment.province}<br/>` : ''}
                ${appointment.nsc ? `<b>NSC:</b> ${appointment.nsc}<br/>` : ''}
                ${appointment.ifta ? `<b>IFTA:</b> ${appointment.ifta}<br/>` : ''}
                ${appointment.gstHst ? `<b>GST/HST:</b> ${appointment.gstHst}<br/>` : ''}
                ${appointment.qst ? `<b>QST:</b> ${appointment.qst}<br/>` : ''}
              </p>
            </td>
            <td style="vertical-align: top; width: 50%; padding-left: 10px;">
              <h3 class="section-title">Appointment Details:</h3>
              <p class="info-text">
                <b>Service Type:</b> ${appointment.serviceType}<br/>
                <b>Date:</b> ${formatDate(appointment.appointmentDate)}<br/>
                <b>Time:</b> ${appointment.appointmentTime}<br/>
                <b>Status:</b> ${appointment.status.toUpperCase()}
              </p>
            </td>
          </tr>
        </table>

        ${appointment.addressLine1 || appointment.city ? `
        <table class="details-table" style="table-layout: fixed;">
          <tr>
            <td style="vertical-align: top; width: 100%;">
              <h3 class="section-title">Address:</h3>
              <p class="info-text">
                ${appointment.addressLine1 || "N/A"}<br/>
                ${appointment.addressLine2 || ""}<br/>
                ${appointment.city || ""}${appointment.state ? `, ${appointment.state}` : ""}<br/>
                ${appointment.postCode || ""}<br/>
                ${appointment.country || ""}
              </p>
            </td>
          </tr>
        </table>
        ` : ''}

        ${appointment.notes ? `
        <table class="details-table" style="table-layout: fixed;">
          <tr>
            <td style="vertical-align: top; width: 100%;">
              <h3 class="section-title">Notes:</h3>
              <p class="info-text" style="font-style: italic; color: #64748b;">
                ${appointment.notes}
              </p>
            </td>
          </tr>
        </table>
        ` : ''}

        ${appointment.eTransfer ? `
        <div class="footer-box">
          <h4 class="footer-title">💥 E-Transfer Payment Details</h4>
          <p class="footer-text">
            <b>E-Transfer Email:</b> ${appointment.eTransfer}
          </p>
        </div>
        ` : ''}
      </body>
    </html>
  `;

  const file = { content: html };
  const options = { format: "A4", printBackground: true };

  console.log("🚀 Rendering Appointment PDF with Circular Logo Watermark...");
  const pdfBuffer = await pdf.generatePdf(file, options);
  fs.writeFileSync(filePath, pdfBuffer);
  console.log("✅ APPOINTMENT PDF GENERATED:", filePath);

  return filePath;
};

module.exports = generateAppointmentPDF;