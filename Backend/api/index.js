// Vercel serverless function wrapper (Backend-only deploy)
// When Vercel Root Directory is set to `Backend/`, this file maps to `/api`.
const app = require('../server');

module.exports = app;


