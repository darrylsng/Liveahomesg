const dataStore = require('./dataStore');

/**
 * Returns the next recipient in the round-robin rotation and advances the index.
 * Returns null if no recipients are configured.
 */
function getNextRecipient() {
  const { recipients } = dataStore.getRecipients();
  const active = recipients.filter(r => r.active !== false);

  if (active.length === 0) return null;

  const state = dataStore.getState();
  const index = state.currentIndex % active.length;
  const recipient = active[index];

  // Advance index and persist
  dataStore.saveState({
    currentIndex: (index + 1) % active.length,
    totalLeadsSent: (state.totalLeadsSent || 0) + 1,
    lastUpdated: new Date().toISOString(),
  });

  return recipient;
}

/**
 * Returns current round-robin status without advancing the index.
 */
function getStatus() {
  const { recipients } = dataStore.getRecipients();
  const active = recipients.filter(r => r.active !== false);
  const state = dataStore.getState();

  if (active.length === 0) {
    return { currentRecipient: null, nextIndex: 0, totalActive: 0, totalLeadsSent: 0 };
  }

  const index = state.currentIndex % active.length;

  return {
    currentRecipient: active[index],
    nextIndex: index,
    totalActive: active.length,
    totalLeadsSent: state.totalLeadsSent || 0,
    lastUpdated: state.lastUpdated,
  };
}

/**
 * Reset the round-robin index back to 0.
 */
function reset() {
  const state = dataStore.getState();
  dataStore.saveState({ ...state, currentIndex: 0, lastUpdated: new Date().toISOString() });
}

module.exports = { getNextRecipient, getStatus, reset };
