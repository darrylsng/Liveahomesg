const nodemailer = require('nodemailer');

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

/**
 * Send a lead notification email to the assigned recipient.
 */
async function sendLeadNotification(recipient, lead) {
  const transporter = createTransporter();

  const fieldRows = (lead.fields || [])
    .map(f => `<tr><td style="padding:6px 12px;border:1px solid #ddd;font-weight:600">${formatFieldName(f.name)}</td><td style="padding:6px 12px;border:1px solid #ddd">${(f.values || []).join(', ')}</td></tr>`)
    .join('');

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#333">
  <div style="background:#1877f2;padding:20px;border-radius:8px 8px 0 0">
    <h1 style="color:#fff;margin:0;font-size:22px">New Facebook Lead</h1>
    <p style="color:#d0e4ff;margin:4px 0 0">LiveAHome Real Estate</p>
  </div>
  <div style="background:#f9f9f9;padding:20px;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 8px 8px">
    <p style="margin:0 0 16px">Hi ${recipient.name || recipient.email},</p>
    <p style="margin:0 0 16px">A new lead has been assigned to you:</p>

    <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
      <thead>
        <tr style="background:#1877f2">
          <th style="padding:8px 12px;color:#fff;text-align:left;border:1px solid #1877f2">Field</th>
          <th style="padding:8px 12px;color:#fff;text-align:left;border:1px solid #1877f2">Value</th>
        </tr>
      </thead>
      <tbody>
        ${fieldRows || '<tr><td colspan="2" style="padding:8px 12px;border:1px solid #ddd;text-align:center;color:#999">No field data available</td></tr>'}
      </tbody>
    </table>

    <div style="background:#fff;border:1px solid #e0e0e0;border-radius:6px;padding:14px;font-size:13px;color:#666">
      <strong>Lead ID:</strong> ${lead.id}<br>
      <strong>Form ID:</strong> ${lead.formId || 'N/A'}<br>
      <strong>Received:</strong> ${lead.receivedAt}
    </div>

    <p style="margin:16px 0 0;font-size:12px;color:#999">
      This lead was automatically assigned to you via LiveAHome round-robin distribution.
    </p>
  </div>
</body>
</html>
`;

  const subject = `New Lead: ${lead.name}${lead.phone ? ` | ${lead.phone}` : ''}`;

  await transporter.sendMail({
    from: `"${process.env.EMAIL_FROM_NAME || 'LiveAHome Leads'}" <${process.env.SMTP_USER}>`,
    to: recipient.email,
    subject,
    html,
  });
}

/**
 * Send a test email to verify SMTP configuration.
 */
async function sendTestEmail(toEmail) {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"${process.env.EMAIL_FROM_NAME || 'LiveAHome Leads'}" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: 'LiveAHome – Email Test',
    html: `<p>Your SMTP configuration is working correctly. LiveAHome leads will be delivered to this address.</p>`,
  });
}

function formatFieldName(name) {
  return name
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

module.exports = { sendLeadNotification, sendTestEmail };
