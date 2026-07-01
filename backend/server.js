const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const drawRouter = require('./api/draw');
// bracket and playoff API removed (legacy)

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/draw', drawRouter);
// bracket and playoff routes removed (legacy)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'İç sunucu hatası' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✓ Backend sunucusu çalışıyor: http://localhost:${PORT}`);
  console.log(`✓ Draw API (Swiss): POST http://localhost:${PORT}/api/draw/swiss`);
  // Bracket API removed (legacy 32-team bracket)
  // Playoff API removed
});
