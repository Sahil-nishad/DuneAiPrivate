// ═══════════════════════════════════════════════════════
//  DuneAI — Frontend API Connector
//  File: api.js  (add to your frontend /js/ folder)
//
//  HOW TO USE:
//  1. Add <script src="/js/api.js"></script> in your index.html
//     (before ContactModal script)
//  2. Set DUNEAI_API_URL below to your backend URL
// ═══════════════════════════════════════════════════════

function normaliseBaseUrl(url) {
  return String(url || '').trim().replace(/\/+$/, '');
}

function resolveApiBaseUrl() {
  // Highest priority: explicit global set in HTML before this script loads.
  if (typeof window !== 'undefined' && window.DUNEAI_API_URL) {
    return normaliseBaseUrl(window.DUNEAI_API_URL);
  }

  const host = typeof window !== 'undefined' ? window.location.hostname : '';
  const isLocalHost = host === 'localhost' || host === '127.0.0.1';

  // Local dev uses local backend; production defaults to same-origin /api.
  return isLocalHost
    ? 'http://localhost:3001'
    : normaliseBaseUrl(window.location.origin);
}

const DUNEAI_API_BASE = resolveApiBaseUrl();

async function duneApiPost(path, payload) {
  const response = await fetch(`${DUNEAI_API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  let body = {};
  try {
    body = await response.json();
  } catch (_) {
    body = {};
  }

  if (!response.ok) {
    const message = body.message || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return body;
}

/**
 * Submit the full 3-step contact form
 * Called by the ContactModal on final submit
 */
async function duneSubmitContact(formData) {
  return duneApiPost('/api/contact', formData);
}

/**
 * Submit a quick enquiry (Book Strategy Call / Start Your Project buttons)
 * type: "strategy_call" | "start_project"
 */
async function duneSubmitEnquiry(formData) {
  return duneApiPost('/api/enquiry', formData);
}

/**
 * Subscribe to newsletter
 */
async function duneSubscribeNewsletter(email) {
  return duneApiPost('/api/newsletter', { email });
}
