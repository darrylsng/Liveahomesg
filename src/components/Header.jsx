import { useExpense } from '../context/ExpenseContext';

export default function Header({ onMenuClick, onLeadsClick }) {
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
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        {/* Hamburger menu - mobile only */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div>
          {client ? (
            <>
              <h1 className="text-base font-bold text-gray-900 leading-tight">{client.name}</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Expense Management</p>
            </>
          ) : (
            <h1 className="text-base font-bold text-gray-900">Expense Tracker</h1>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onLeadsClick}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Leads</span>
        </button>
        {client && (
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="hidden sm:inline">Export CSV</span>
            <span className="sm:hidden">Export</span>
          </button>
        )}
      </div>
    </header>
  );
}
