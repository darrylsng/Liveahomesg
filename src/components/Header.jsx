import { useExpense } from '../context/ExpenseContext';

export default function Header() {
  const { state } = useExpense();
  const client = state.clients.find(c => c.id === state.activeClientId);

  function handleExport() {
    if (!client) return;
    const rows = [['Section', 'No.', 'Item', 'Amount (SGD)', 'Description', 'Frequency', 'Date', 'Mode']];

    for (const section of client.sections) {
      if (section.children) {
        for (const child of section.children) {
          for (const item of child.items) {
            rows.push([
              `${section.label} – ${child.name}`,
              item.no, item.item, item.amount,
              item.description, item.frequency, item.date, item.mode
            ]);
          }
        }
      } else {
        for (const item of section.items) {
          rows.push([
            section.label, item.no, item.item, item.amount,
            item.description, item.frequency, item.date, item.mode
          ]);
        }
      }
    }

    const csv = rows.map(r =>
      r.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')
    ).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${client.name}_expenses.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div>
        {client ? (
          <>
            <h1 className="text-xl font-bold text-gray-900">{client.name}</h1>
            <p className="text-sm text-gray-500">Expense Management</p>
          </>
        ) : (
          <h1 className="text-xl font-bold text-gray-900">Expense Tracker</h1>
        )}
      </div>
      <div className="flex items-center gap-3">
        {client && (
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export CSV
          </button>
        )}
      </div>
    </header>
  );
}
