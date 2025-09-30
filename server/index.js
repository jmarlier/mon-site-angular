#!/usr/bin/env node
'use strict';

// Minimal Express + Nodemailer API for contact form
// Works locally (npm run api) and in production behind a reverse proxy.

const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 5500;

app.use(express.json({ limit: '100kb' }));
app.use(cors({ origin: true })); // Adjust in prod if needed

// Simple in-memory rate limit per IP
const rate = new Map();
function limited(ip) {
  const now = Date.now();
  const windowMs = 60_000; // 1min
  const limit = 10; // 10 req/min
  const entry = rate.get(ip) || { n: 0, t: now };
  if (now - entry.t > windowMs) { entry.n = 0; entry.t = now; }
  entry.n += 1; rate.set(ip, entry);
  return entry.n > limit;
}

function isNonEmptyString(v, max = 500) {
  return typeof v === 'string' && v.trim().length > 0 && v.length <= max;
}

function isValidEmail(v) {
  if (typeof v !== 'string') return false;
  const s = v.trim();
  // Simple but robust email regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

// Reusable SMTP transporter with pooling to avoid reconnect cost on each request
let pooledTransporter = null;
function getTransporter() {
  if (pooledTransporter) return pooledTransporter;
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = String(process.env.SMTP_SECURE || '').toLowerCase() === 'true' || port === 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;
  pooledTransporter = nodemailer.createTransport({
    pool: true,
    host,
    port,
    secure,
    auth: { user, pass },
    maxConnections: Number(process.env.SMTP_POOL_CONN || 2),
    maxMessages: Number(process.env.SMTP_POOL_MSG || 50),
    rateDelta: 60_000,
    rateLimit: Number(process.env.SMTP_RATE_LIMIT || 20),
    connectionTimeout: Number(process.env.SMTP_CONN_TIMEOUT || 10_000),
    greetingTimeout: Number(process.env.SMTP_GREET_TIMEOUT || 10_000),
    socketTimeout: Number(process.env.SMTP_SOCKET_TIMEOUT || 15_000),
    tls: {
      // Allow disabling cert validation in dev if needed: SMTP_TLS_REJECT_UNAUTH=false
      rejectUnauthorized: String(process.env.SMTP_TLS_REJECT_UNAUTH || 'true').toLowerCase() === 'true'
    }
  });
  return pooledTransporter;
}

app.post('/api/contact', async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
  if (limited(String(ip))) return res.status(429).json({ error: 'Too many requests' });

  const { name, user_email, email, subject, message, company } = req.body || {};
  // Honeypot: reject if bot filled
  if (typeof company === 'string' && company.trim().length) {
    return res.status(204).end();
  }

  if (!isNonEmptyString(name, 100) || !isNonEmptyString(subject, 200) || !isNonEmptyString(message, 5000)) {
    return res.status(400).json({ error: 'Invalid payload' });
  }
  const fromEmail = isNonEmptyString(user_email, 320) ? user_email : (isNonEmptyString(email, 320) ? email : '');
  if (!isValidEmail(fromEmail)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  if (!fromEmail) return res.status(400).json({ error: 'Invalid email' });

  // Build transporter from env
  const to = process.env.CONTACT_TO || process.env.SMTP_USER;
  const from = process.env.CONTACT_FROM || user;
  const transporter = getTransporter();
  if (!transporter || !to || !from) {
    return res.status(500).json({ error: 'SMTP not configured' });
  }

  const text = [
    `Nom: ${name}`,
    `Email: ${fromEmail}`,
    `Sujet: ${subject}`,
    '',
    message,
  ].join('\n');

  const html = `
    <div>
      <p><strong>Nom:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(fromEmail)}</p>
      <p><strong>Sujet:</strong> ${escapeHtml(subject)}</p>
      <hr>
      <pre style="white-space:pre-wrap;font-family:ui-monospace,monospace">${escapeHtml(message)}</pre>
    </div>
  `;

  // Respond quickly, send mail in background for faster UX in dev
  res.status(202).json({ ok: true });
  transporter.sendMail({
    to,
    from,
    replyTo: fromEmail,
    subject: `[Contact] ${subject}`,
    text,
    html,
  }).then(() => {
    // noop
  }).catch((err) => {
    console.error('mail error (background):', err);
  });
});

app.get('/healthz', (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
