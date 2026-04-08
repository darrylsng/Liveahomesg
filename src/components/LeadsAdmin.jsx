import { useState, useEffect, useCallback } from 'react';

const API_BASE = import.meta.env.VITE_LEADS_API_URL || 'http://localhost:3001';
const API_KEY = import.meta.env.VITE_LEADS_API_KEY || '';

function apiFetch(path, options = {}) {
  return fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  }).then(r => r.json());
}

export default function LeadsAdmin({ onClose }) {
  const [tab, setTab] = useState('recipients');
  const [recipients, setRecipients] = useState([]);
  const [leads, setLeads] = useState([]);
  const [leadsTotal, setLeadsTotal] = useState(0);
  const [rrStatus, setRrStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  // Add recipient form
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');

  // Bulk add
  const [bulkText, setBulkText] = useState('');

  // Test email
  const [testEmail, setTestEmail] = useState('');

  const flash = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 3500);
  };

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [recData, leadsData, rrData] = await Promise.all([
        apiFetch('/api/recipients'),
        apiFetch('/api/leads?limit=50'),
        apiFetch('/api/round-robin/status'),
      ]);
      setRecipients(recData.recipients || []);
      setLeads(leadsData.leads || []);
      setLeadsTotal(leadsData.total || 0);
      setRrStatus(rrData);
    } catch {
      flash('Could not connect to the backend server.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  async function addRecipient(e) {
    e.preventDefault();
    if (!newEmail) return;
    const res = await apiFetch('/api/recipients', { method: 'POST', body: { email: newEmail, name: newName } });
    if (res.error) { flash(res.error, 'error'); return; }
    setNewEmail(''); setNewName('');
    flash(`Added ${res.email}`);
    loadAll();
  }

  async function bulkAdd(e) {
    e.preventDefault();
    const lines = bulkText.split('\n').map(l => l.trim()).filter(Boolean);
    const items = lines.map(l => {
      const [email, name] = l.split(',').map(s => s.trim());
      return { email, name: name || '' };
    });
    const res = await apiFetch('/api/recipients/bulk', { method: 'POST', body: { recipients: items } });
    if (res.error) { flash(res.error, 'error'); return; }
    flash(`Added ${res.added.length} recipients${res.errors.length ? `, ${res.errors.length} skipped` : ''}`);
    setBulkText('');
    loadAll();
  }

  async function toggleActive(r) {
    await apiFetch(`/api/recipients/${r.id}`, { method: 'PATCH', body: { active: !r.active } });
    loadAll();
  }

  async function deleteRecipient(r) {
    if (!confirm(`Remove ${r.email}?`)) return;
    await apiFetch(`/api/recipients/${r.id}`, { method: 'DELETE' });
    flash(`Removed ${r.email}`);
    loadAll();
  }

  async function resetRoundRobin() {
    if (!confirm('Reset round-robin index to 0?')) return;
    await apiFetch('/api/round-robin/reset', { method: 'POST' });
    flash('Round-robin reset');
    loadAll();
  }

  async function sendTest(e) {
    e.preventDefault();
    if (!testEmail) return;
    const res = await apiFetch('/api/test-email', { method: 'POST', body: { email: testEmail } });
    if (res.error) { flash(res.error, 'error'); return; }
    flash(`Test email sent to ${testEmail}`);
  }

  const active = recipients.filter(r => r.active !== false);
  const inactive = recipients.filter(r => r.active === false);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center overflow-y-auto py-8">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-blue-600 rounded-t-xl">
          <div>
            <h2 className="text-xl font-bold text-white">Facebook Leads – Round-Robin</h2>
            <p className="text-blue-100 text-sm mt-0.5">Manage lead distribution recipients</p>
          </div>
          <button onClick={onClose} className="text-white hover:text-blue-200 text-2xl leading-none">&times;</button>
        </div>

        {/* Flash */}
        {msg && (
          <div className={`mx-6 mt-4 px-4 py-3 rounded-lg text-sm font-medium ${msg.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
            {msg.text}
          </div>
        )}

        {/* Status bar */}
        {rrStatus && (
          <div className="mx-6 mt-4 grid grid-cols-3 gap-3">
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-700">{active.length}</div>
              <div className="text-xs text-blue-500 mt-0.5">Active Recipients</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-700">{leadsTotal}</div>
              <div className="text-xs text-green-500 mt-0.5">Total Leads</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 text-center">
              <div className="text-sm font-semibold text-purple-700 truncate">{rrStatus.currentRecipient?.email || '—'}</div>
              <div className="text-xs text-purple-500 mt-0.5">Next Recipient</div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b mx-6 mt-4 gap-4">
          {['recipients', 'leads', 'settings'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pb-2 text-sm font-medium capitalize border-b-2 transition-colors ${tab === t ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              {t}{t === 'recipients' ? ` (${recipients.length})` : t === 'leads' ? ` (${leadsTotal})` : ''}
            </button>
          ))}
        </div>

        <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">

          {/* RECIPIENTS TAB */}
          {tab === 'recipients' && (
            <div className="space-y-5">
              {/* Add single */}
              <form onSubmit={addRecipient} className="flex gap-2 items-end flex-wrap">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Email *</label>
                  <input value={newEmail} onChange={e => setNewEmail(e.target.value)} type="email" required placeholder="agent@example.com"
                    className="border rounded-lg px-3 py-2 text-sm w-52 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Name (optional)</label>
                  <input value={newName} onChange={e => setNewName(e.target.value)} type="text" placeholder="Agent Name"
                    className="border rounded-lg px-3 py-2 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                </div>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                  Add Recipient
                </button>
              </form>

              {/* Bulk add */}
              <details className="border rounded-lg">
                <summary className="px-4 py-3 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50">
                  Bulk Add (paste list)
                </summary>
                <form onSubmit={bulkAdd} className="p-4 space-y-2">
                  <p className="text-xs text-gray-500">One per line. Format: <code>email, Name</code> (name is optional)</p>
                  <textarea value={bulkText} onChange={e => setBulkText(e.target.value)} rows={5} placeholder={"agent1@example.com, Alice\nagent2@example.com, Bob\nagent3@example.com"}
                    className="w-full border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-400" />
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                    Bulk Add
                  </button>
                </form>
              </details>

              {/* Recipient list */}
              {loading ? (
                <p className="text-sm text-gray-400">Loading...</p>
              ) : recipients.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6">No recipients added yet.</p>
              ) : (
                <div>
                  <p className="text-xs text-gray-400 mb-2">{active.length} active · {inactive.length} paused</p>
                  <div className="space-y-2">
                    {recipients.map((r, i) => (
                      <div key={r.id} className={`flex items-center justify-between px-4 py-3 rounded-lg border ${r.active !== false ? 'bg-white' : 'bg-gray-50 opacity-60'}`}>
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-xs text-gray-400 w-6 text-right shrink-0">{i + 1}</span>
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-gray-800 truncate">{r.email}</div>
                            {r.name && <div className="text-xs text-gray-500">{r.name}</div>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 ml-3">
                          {rrStatus?.currentRecipient?.id === r.id && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Next</span>
                          )}
                          <button onClick={() => toggleActive(r)}
                            className={`text-xs px-3 py-1 rounded-full border font-medium transition-colors ${r.active !== false ? 'text-gray-600 border-gray-300 hover:bg-gray-50' : 'text-green-600 border-green-300 hover:bg-green-50'}`}>
                            {r.active !== false ? 'Pause' : 'Resume'}
                          </button>
                          <button onClick={() => deleteRecipient(r)} className="text-xs text-red-500 hover:text-red-700 px-1">✕</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* LEADS TAB */}
          {tab === 'leads' && (
            <div>
              {leads.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">No leads received yet.</p>
              ) : (
                <div className="space-y-3">
                  {leads.map(lead => (
                    <div key={lead.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                          <span className="font-semibold text-gray-800">{lead.name}</span>
                          {lead.phone && <span className="ml-2 text-sm text-gray-500">{lead.phone}</span>}
                          {lead.email && <span className="ml-2 text-sm text-blue-600">{lead.email}</span>}
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-xs text-gray-400">{new Date(lead.receivedAt).toLocaleString()}</div>
                          <div className={`text-xs mt-0.5 ${lead.assignedTo === 'error' ? 'text-red-500' : lead.assignedTo === 'unassigned' ? 'text-yellow-600' : 'text-green-600'}`}>
                            {lead.assignedTo === 'error' ? `Error: ${lead.error}` : lead.assignedTo === 'unassigned' ? 'Unassigned' : `→ ${lead.assignedTo}`}
                          </div>
                        </div>
                      </div>
                      {lead.fields?.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {lead.fields.map(f => (
                            <span key={f.name} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                              {f.name.replace(/_/g, ' ')}: {f.values?.join(', ')}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SETTINGS TAB */}
          {tab === 'settings' && (
            <div className="space-y-6">
              {/* Round-robin controls */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Round-Robin Controls</h3>
                <div className="flex items-center gap-4">
                  <button onClick={resetRoundRobin} className="px-4 py-2 bg-yellow-50 border border-yellow-300 text-yellow-700 rounded-lg text-sm font-medium hover:bg-yellow-100">
                    Reset to First Recipient
                  </button>
                  {rrStatus && (
                    <span className="text-sm text-gray-500">
                      Total leads sent: <strong>{rrStatus.totalLeadsSent}</strong>
                    </span>
                  )}
                </div>
              </div>

              {/* Test email */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Send Test Email</h3>
                <form onSubmit={sendTest} className="flex gap-2 items-end flex-wrap">
                  <div>
                    <input value={testEmail} onChange={e => setTestEmail(e.target.value)} type="email" required placeholder="you@example.com"
                      className="border rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                  </div>
                  <button type="submit" className="bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800">
                    Send Test
                  </button>
                </form>
                <p className="text-xs text-gray-400 mt-1">Verifies your SMTP configuration is working.</p>
              </div>

              {/* Config info */}
              <div className="bg-gray-50 rounded-lg p-4 text-xs text-gray-500 space-y-1">
                <p className="font-medium text-gray-700 mb-2">Backend Setup Checklist</p>
                <p>✓ Set <code>FB_VERIFY_TOKEN</code> – any secret string, used when registering the webhook</p>
                <p>✓ Set <code>FB_PAGE_ACCESS_TOKEN</code> – from Facebook Developer App (leads_retrieval permission)</p>
                <p>✓ Set <code>SMTP_HOST</code>, <code>SMTP_PORT</code>, <code>SMTP_USER</code>, <code>SMTP_PASS</code></p>
                <p>✓ Register webhook URL: <code>https://your-domain.com/webhook/facebook</code></p>
                <p>✓ Subscribe page via POST <code>/api/setup/subscribe-page</code></p>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t flex justify-between items-center">
          <button onClick={loadAll} className="text-sm text-gray-500 hover:text-gray-700">Refresh</button>
          <button onClick={onClose} className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">Close</button>
        </div>
      </div>
    </div>
  );
}
