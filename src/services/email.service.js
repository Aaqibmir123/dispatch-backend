const nodemailer = require("nodemailer");

// Change: Ab 'email' string ya array dono format accept karega
const sendInvoiceEmail = async (emailsList, pdfPath, invoiceNumber) => {

  try {

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Aapka dynamic 16-digit App Password
      },
    });

    const finalRecipients = Array.isArray(emailsList) ? emailsList.join(", ") : emailsList;

    const result = await transporter.sendMail({
      from: `"Dispatch Group Billing" <${process.env.EMAIL_USER}>`,
      to: finalRecipients, 
      subject: `Invoice #${invoiceNumber} Generated — Dispatch Group`,
      text: `Hello,\n\nPlease find attached your professional copy of Invoice #${invoiceNumber}.\n\nThank you for business!`,
      attachments: [
        {
          filename: `invoice-${invoiceNumber}.pdf`,
          path: pdfPath,
        },
      ],
    });

    return result;
  } catch (error) {
    console.log("❌ EMAIL UTILITY FUNCTION CRASHED:");
    console.error(error);
    throw error;
  }
};

module.exports = sendInvoiceEmail;