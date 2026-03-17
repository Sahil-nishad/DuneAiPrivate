const { json, isValidEmail, methodNotAllowed, sanitise } = require('./_lib/common');
const { sendAdminEnquiry, sendClientConfirmation } = require('./_lib/mailer');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);

  try {
    const name = sanitise(req.body.name);
    const email = sanitise(req.body.email);
    const message = sanitise(req.body.message);
    const type = sanitise(req.body.type) || 'general';

    if (!name) return json(res, 400, { success: false, message: 'Name is required.' });
    if (!isValidEmail(email)) return json(res, 400, { success: false, message: 'Valid email is required.' });

    const typeLabel = type === 'strategy_call'
      ? 'Book Strategy Call'
      : type === 'start_project'
        ? 'Start Your Project'
        : 'General Enquiry';

    await sendAdminEnquiry({ name, email, message, type, typeLabel });
    await sendClientConfirmation(name, email);

    return json(res, 200, {
      success: true,
      message: `Got it! We'll reach out to ${name.split(' ')[0]} within 24 hours.`,
    });
  } catch (error) {
    return json(res, 500, {
      success: false,
      message: error.message || 'Failed to send. Please email us directly at hello@duneai.in',
    });
  }
};
