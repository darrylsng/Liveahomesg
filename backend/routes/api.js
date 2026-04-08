const express = require('express');
const router = express.Router();
const dataStore = require('../services/dataStore');
const roundRobinService = require('../services/roundRobinService');
const emailService = require('../services/emailService');
const facebookService = require('../services/facebookService');

// Simple API key guard for admin endpoints
function requireApiKey(req, res, next) {
  const key = req.headers['x-api-key'];
  if (!process.env.ADMIN_API_KEY || key === process.env.ADMIN_API_KEY) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized' });
}

router.use(requireApiKey);

// ---- Recipients ----

// GET /api/recipients
router.get('/recipients', (req, res) => {
  try {
    res.json(dataStore.getRecipients());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/recipients
router.post('/recipients', (req, res) => {
  try {
    const { email, name } = req.body;
    if (!email) return res.status(400).json({ error: 'email is required' });
    const recipient = dataStore.addRecipient({ email, name });
    res.status(201).json(recipient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/recipients/bulk - add multiple at once
router.post('/recipients/bulk', (req, res) => {
  try {
    const { recipients } = req.body;
    if (!Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({ error: 'recipients array is required' });
    }
    const added = [];
    const errors = [];
    for (const r of recipients) {
      try {
        added.push(dataStore.addRecipient({ email: r.email, name: r.name }));
      } catch (e) {
        errors.push({ email: r.email, error: e.message });
      }
    }
    res.status(201).json({ added, errors });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/recipients/:id
router.patch('/recipients/:id', (req, res) => {
  try {
    const updated = dataStore.updateRecipient(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// DELETE /api/recipients/:id
router.delete('/recipients/:id', (req, res) => {
  try {
    dataStore.deleteRecipient(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// ---- Round-Robin ----

// GET /api/round-robin/status
router.get('/round-robin/status', (req, res) => {
  try {
    res.json(roundRobinService.getStatus());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/round-robin/reset
router.post('/round-robin/reset', (req, res) => {
  try {
    roundRobinService.reset();
    res.json({ success: true, message: 'Round-robin index reset to 0' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---- Leads ----

// GET /api/leads?page=1&limit=50
router.get('/leads', (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    res.json(dataStore.getLeads({ page, limit }));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---- Utilities ----

// POST /api/test-email - send a test email
router.post('/test-email', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'email is required' });
    await emailService.sendTestEmail(email);
    res.json({ success: true, message: `Test email sent to ${email}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/setup/subscribe-page - subscribe a Facebook page to leadgen events
router.post('/setup/subscribe-page', async (req, res) => {
  try {
    const { pageId } = req.body;
    if (!pageId) return res.status(400).json({ error: 'pageId is required' });
    const result = await facebookService.subscribePage(pageId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
