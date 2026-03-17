const { json, isValidEmail, methodNotAllowed, sanitise } = require('./_lib/common');
const { sendNewsletterSignup } = require('./_lib/mailer');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);

  try {
    const email = sanitise(req.body.email);
    if (!isValidEmail(email)) return json(res, 400, { success: false, message: 'Valid email required.' });

    await sendNewsletterSignup(email);

    return json(res, 200, {
      success: true,
      message: 'Subscribed! Welcome to the DuneAI network.',
    });
  } catch (error) {
    return json(res, 500, {
      success: false,
      message: error.message || 'Failed. Please try again.',
    });
  }
};
