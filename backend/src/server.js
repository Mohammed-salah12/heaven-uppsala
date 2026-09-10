require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { connectDB } = require('./config/db');
const routes = require('./routes');

const app = express();

// Security + parsing
app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

// CORS — allow the configured frontend origin(s)
const origins = (process.env.CORS_ORIGIN || 'http://localhost:3000')
  .split(',')
  .map((s) => s.trim());
app.use(
  cors({
    origin: (origin, cb) => {
      // allow same-origin / server-to-server (no origin) and any listed origin
      if (!origin || origins.includes('*') || origins.includes(origin)) return cb(null, true);
      return cb(null, true); // permissive by default for easy local dev; tighten for prod
    },
  })
);

app.get('/', (req, res) =>
  res.json({ name: 'Restaurang Heaven API', docs: '/api/health, /api/languages, /api/site?lang=sv' })
);
app.use('/api', routes);

// 404 + error handlers
app.use((req, res) => res.status(404).json({ error: 'Not found' }));
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;

// Only auto-connect + listen when run directly (`node src/server.js`),
// so the app can be imported in tests without side effects.
if (require.main === module) {
  connectDB()
    .then(() => {
      app.listen(PORT, () => console.log(`🚀  API listening on http://localhost:${PORT}`));
    })
    .catch((err) => {
      console.error('❌  Failed to connect to MongoDB:', err.message);
      process.exit(1);
    });
}

module.exports = app;
