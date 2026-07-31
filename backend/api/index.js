/**
 * Vercel serverless entry — exports the Express app.
 * All routes (/health, /api/*) are handled by src/app.js
 */
import app from '../src/app.js';

export default app;
