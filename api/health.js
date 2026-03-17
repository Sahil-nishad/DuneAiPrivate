const { json, methodNotAllowed } = require('./_lib/common');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);

  return json(res, 200, {
    success: true,
    status: 'DuneAI Vercel API is operational',
    time: new Date().toISOString(),
  });
};
