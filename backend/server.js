require('dotenv').config();
const express = require('express');
const cors = require('cors');
const webhookRoutes = require('./routes/webhook');
const apiRoutes = require('./routes/api');

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'LiveAHome Facebook Leads Round-Robin' });
});

// Facebook webhook
app.use('/webhook', webhookRoutes);

// Admin API
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
