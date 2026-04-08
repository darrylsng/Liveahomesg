const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const RECIPIENTS_FILE = path.join(DATA_DIR, 'recipients.json');
const STATE_FILE = path.join(DATA_DIR, 'state.json');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');

function readJSON(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

// ---- Recipients ----

function getRecipients() {
  return readJSON(RECIPIENTS_FILE);
}

function saveRecipients(data) {
  writeJSON(RECIPIENTS_FILE, data);
}

function addRecipient(recipient) {
  const data = getRecipients();
  const existing = data.recipients.find(r => r.email === recipient.email);
  if (existing) throw new Error(`Recipient ${recipient.email} already exists`);
  data.recipients.push({
    id: Date.now().toString(),
    email: recipient.email,
    name: recipient.name || '',
    active: true,
    addedAt: new Date().toISOString(),
  });
  writeJSON(RECIPIENTS_FILE, data);
  return data.recipients[data.recipients.length - 1];
}

function updateRecipient(id, updates) {
  const data = getRecipients();
  const idx = data.recipients.findIndex(r => r.id === id);
  if (idx === -1) throw new Error(`Recipient ${id} not found`);
  data.recipients[idx] = { ...data.recipients[idx], ...updates };
  writeJSON(RECIPIENTS_FILE, data);
  return data.recipients[idx];
}

function deleteRecipient(id) {
  const data = getRecipients();
  const idx = data.recipients.findIndex(r => r.id === id);
  if (idx === -1) throw new Error(`Recipient ${id} not found`);
  data.recipients.splice(idx, 1);
  writeJSON(RECIPIENTS_FILE, data);
}

// ---- Round-Robin State ----

function getState() {
  return readJSON(STATE_FILE);
}

function saveState(state) {
  writeJSON(STATE_FILE, state);
}

// ---- Leads ----

function getLeads({ page = 1, limit = 50 } = {}) {
  const data = readJSON(LEADS_FILE);
  const sorted = [...data.leads].reverse(); // newest first
  const start = (page - 1) * limit;
  return {
    leads: sorted.slice(start, start + limit),
    total: data.leads.length,
    page,
    limit,
  };
}

function saveLead(lead) {
  const data = readJSON(LEADS_FILE);
  data.leads.push(lead);
  writeJSON(LEADS_FILE, data);
}

module.exports = {
  getRecipients,
  saveRecipients,
  addRecipient,
  updateRecipient,
  deleteRecipient,
  getState,
  saveState,
  getLeads,
  saveLead,
};
