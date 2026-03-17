function json(res, status, body) {
  res.status(status).json(body);
}

function methodNotAllowed(res, methods) {
  res.setHeader('Allow', methods.join(', '));
  return json(res, 405, { success: false, message: 'Method not allowed.' });
}

function isValidEmail(email) {
  return typeof email === 'string' &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function sanitise(val) {
  if (typeof val !== 'string') return '';
  return val.trim().replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
}

function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function buildAdminPlainText({ name, email, company, role, heard, service, budget, timeline, desc, data, whatsapp }) {
  return `
DuneAI - New Client Enquiry
===========================

CLIENT DETAILS
--------------
Name:      ${name}
Email:     ${email}
Company:   ${company || '-'}
Role:      ${role || '-'}
WhatsApp:  ${whatsapp || '-'}
Found Us:  ${heard || '-'}

PROJECT DETAILS
---------------
Service:   ${service}
Budget:    ${budget}
Timeline:  ${timeline || '-'}
Data/Sys:  ${data || '-'}

PROJECT DESCRIPTION
-------------------
${desc}

---
DuneAI - hello@duneai.in
`.trim();
}

function buildClientPlainText(name) {
  const firstName = name.split(' ')[0];
  return `
You're Now Duning With Us
=========================

The desert has received your signal, ${firstName}.
Our intelligence systems are already processing your brief.

WHAT HAPPENS NEXT
-----------------
1. A DuneAI strategist will contact you within 24 hours.
2. We'll review your project and prepare a tailored AI roadmap.
3. Free 45-minute strategy session.

Questions? Reach us: hello@duneai.in
`.trim();
}

module.exports = {
  buildAdminPlainText,
  buildClientPlainText,
  escHtml,
  isValidEmail,
  json,
  methodNotAllowed,
  sanitise,
};
