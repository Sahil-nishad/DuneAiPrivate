const { Resend } = require('resend');
const { adminEmailHTML, clientEmailHTML } = require('../../backend/emailTemplates');
const { buildAdminPlainText, buildClientPlainText, escHtml } = require('./common');

function getResendClient() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not configured.');
  }
  return new Resend(process.env.RESEND_API_KEY);
}

function getSender() {
  return process.env.DUNEAI_FROM || 'DuneAI <onboarding@resend.dev>';
}

function getInbox() {
  return process.env.DUNEAI_EMAIL || 'hello@duneai.in';
}

async function sendAdminContact(payload) {
  const resend = getResendClient();
  const result = await resend.emails.send({
    from: getSender(),
    to: [getInbox()],
    replyTo: payload.email,
    subject: `New DuneAI Enquiry - ${payload.service} | ${payload.name}`,
    html: adminEmailHTML(payload),
    text: buildAdminPlainText(payload),
  });

  if (result.error) throw new Error(result.error.message || 'Failed to send admin contact email.');
  return result;
}

async function sendClientConfirmation(name, email) {
  const resend = getResendClient();
  const result = await resend.emails.send({
    from: getSender(),
    to: [email],
    subject: "You're Now Duning With Us - DuneAI",
    html: clientEmailHTML({ name }),
    text: buildClientPlainText(name),
  });

  if (result.error) throw new Error(result.error.message || 'Failed to send client confirmation email.');
  return result;
}

async function sendAdminEnquiry({ name, email, message, type, typeLabel }) {
  const resend = getResendClient();
  const result = await resend.emails.send({
    from: getSender(),
    to: [getInbox()],
    replyTo: email,
    subject: `DuneAI Enquiry - ${typeLabel} | ${name}`,
    html: `
      <div style="background:#050508;font-family:Arial,sans-serif;color:#f0ede6;padding:32px;border-radius:8px;max-width:560px;margin:0 auto;border:1px solid rgba(201,168,106,.2);">
        <div style="font-size:1.3rem;font-weight:700;letter-spacing:.14em;color:#C9A86A;margin-bottom:20px;">DUNEAI</div>
        <div style="background:rgba(201,168,106,.07);border:1px solid rgba(201,168,106,.2);border-radius:4px;padding:14px;margin-bottom:20px;font-size:.82rem;color:#C9A86A;letter-spacing:.08em;">${typeLabel}</div>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px 0;color:#6b6870;font-size:.78rem;width:110px;">Name</td><td style="padding:8px 0;font-size:.88rem;color:#C9A86A;font-weight:600;">${escHtml(name)}</td></tr>
          <tr><td style="padding:8px 0;color:#6b6870;font-size:.78rem;">Email</td><td style="padding:8px 0;font-size:.88rem;"><a href="mailto:${escHtml(email)}" style="color:#5BE7FF;">${escHtml(email)}</a></td></tr>
          ${message ? `<tr><td style="padding:8px 0;color:#6b6870;font-size:.78rem;vertical-align:top;">Message</td><td style="padding:8px 0;font-size:.85rem;color:#f0ede6;line-height:1.6;">${escHtml(message)}</td></tr>` : ''}
        </table>
      </div>
    `,
    text: `DuneAI Enquiry\n\nType: ${typeLabel}\nName: ${name}\nEmail: ${email}\nMessage: ${message || '-'}`,
  });

  if (result.error) throw new Error(result.error.message || 'Failed to send enquiry email.');
  return result;
}

async function sendNewsletterSignup(email) {
  const resend = getResendClient();
  const result = await resend.emails.send({
    from: getSender(),
    to: [getInbox()],
    subject: `DuneAI Newsletter Signup - ${email}`,
    html: `<div style="background:#050508;font-family:Arial,sans-serif;color:#f0ede6;padding:32px;border-radius:8px;max-width:480px;margin:0 auto;border:1px solid rgba(201,168,106,.2);"><div style="font-size:1.2rem;font-weight:700;letter-spacing:.14em;color:#C9A86A;margin-bottom:16px;">DUNEAI</div><p style="color:#6b6870;font-size:.88rem;margin-bottom:12px;">New newsletter subscriber:</p><p style="font-size:1rem;color:#5BE7FF;"><a href="mailto:${escHtml(email)}" style="color:#5BE7FF;">${escHtml(email)}</a></p></div>`,
    text: `New DuneAI newsletter subscriber: ${email}`,
  });

  if (result.error) throw new Error(result.error.message || 'Failed to send newsletter email.');
  return result;
}

module.exports = {
  sendAdminContact,
  sendAdminEnquiry,
  sendClientConfirmation,
  sendNewsletterSignup,
};
