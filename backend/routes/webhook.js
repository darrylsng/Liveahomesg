const express = require('express');
const router = express.Router();
const facebookService = require('../services/facebookService');
const roundRobinService = require('../services/roundRobinService');
const emailService = require('../services/emailService');
const dataStore = require('../services/dataStore');

// GET /webhook/facebook - Facebook webhook verification
router.get('/facebook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.FB_VERIFY_TOKEN) {
    console.log('[Webhook] Facebook verification successful');
    return res.status(200).send(challenge);
  }

  console.warn('[Webhook] Facebook verification failed');
  res.sendStatus(403);
});

// POST /webhook/facebook - Receive lead events
router.post('/facebook', async (req, res) => {
  const body = req.body;

  if (body.object !== 'page') {
    return res.sendStatus(404);
  }

  // Acknowledge immediately to avoid Facebook retrying
  res.sendStatus(200);

  for (const entry of body.entry || []) {
    for (const change of entry.changes || []) {
      if (change.field !== 'leadgen') continue;

      const { leadgen_id, page_id, form_id, created_time } = change.value;

      console.log(`[Webhook] New lead received: ${leadgen_id}`);

      try {
        // Fetch lead details from Facebook Graph API
        const leadData = await facebookService.getLeadDetails(leadgen_id);

        // Build lead record
        const lead = {
          id: leadgen_id,
          pageId: page_id,
          formId: form_id,
          receivedAt: new Date(created_time * 1000).toISOString(),
          fields: leadData.field_data || [],
          name: extractField(leadData.field_data, 'full_name') ||
                extractField(leadData.field_data, 'first_name') || 'Unknown',
          email: extractField(leadData.field_data, 'email') || '',
          phone: extractField(leadData.field_data, 'phone_number') || '',
          assignedTo: null,
          sentAt: null,
        };

        // Get next recipient via round-robin
        const recipient = roundRobinService.getNextRecipient();

        if (!recipient) {
          console.warn('[Webhook] No recipients configured. Lead stored but not sent.');
          lead.assignedTo = 'unassigned';
          dataStore.saveLead(lead);
          continue;
        }

        lead.assignedTo = recipient.email;

        // Send email notification
        await emailService.sendLeadNotification(recipient, lead);
        lead.sentAt = new Date().toISOString();

        // Persist lead
        dataStore.saveLead(lead);

        console.log(`[Webhook] Lead ${leadgen_id} sent to ${recipient.email}`);
      } catch (err) {
        console.error(`[Webhook] Error processing lead ${leadgen_id}:`, err.message);

        // Still store the lead even if email fails
        dataStore.saveLead({
          id: leadgen_id,
          pageId: page_id,
          formId: form_id,
          receivedAt: new Date(created_time * 1000).toISOString(),
          fields: [],
          name: 'Unknown',
          email: '',
          phone: '',
          assignedTo: 'error',
          error: err.message,
          sentAt: null,
        });
      }
    }
  }
});

function extractField(fieldData, fieldName) {
  if (!Array.isArray(fieldData)) return null;
  const field = fieldData.find(f => f.name === fieldName);
  return field ? field.values[0] : null;
}

module.exports = router;
