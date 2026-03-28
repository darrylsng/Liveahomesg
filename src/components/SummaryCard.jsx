const fmtSGD = (n) =>
  `$${n.toLocaleString('en-SG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function SummaryCard({ client }) {
  const summaries = [];
  let grandTotal = 0;
  let myShareTotal = 0;

  for (const section of client.sections) {
    if (section.children) {
      // Children section
      let childrenTotal = 0;
      for (const child of section.children) {
        const childTotal = child.items.reduce((s, i) => s + (parseFloat(i.amount) || 0), 0);
        childrenTotal += childTotal;
        summaries.push({
          label: `${section.label} – ${child.name}`,
          total: childTotal,
          splitPercentage: section.splitPercentage,
          myShare: section.splitPercentage != null ? (childTotal * section.splitPercentage) / 100 : childTotal,
          indent: true,
        });
      }
      grandTotal += childrenTotal;
      const myShare = section.splitPercentage != null ? (childrenTotal * section.splitPercentage) / 100 : childrenTotal;
      myShareTotal += myShare;
      summaries.push({
        label: `${section.label} (Total)`,
        total: childrenTotal,
        splitPercentage: section.splitPercentage,
        myShare,
        bold: true,
        isSubtotal: true,
      });
    } else {
      const total = section.items.reduce((s, i) => s + (parseFloat(i.amount) || 0), 0);
      const myShare = section.splitPercentage != null ? (total * section.splitPercentage) / 100 : total;
      grandTotal += total;
      myShareTotal += myShare;
      summaries.push({
        label: section.label,
        total,
        splitPercentage: section.splitPercentage,
        myShare,
      });
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-indigo-600 px-5 py-4">
        <h3 className="text-white font-semibold text-base">Expense Summary</h3>
        <p className="text-indigo-200 text-xs mt-0.5">Auto-calculated totals</p>
      </div>
      <div className="divide-y divide-gray-100">
        {summaries.map((s, i) => (
          <div
            key={i}
            className={`flex items-center justify-between px-5 py-3 ${s.isSubtotal ? 'bg-indigo-50' : s.indent ? 'pl-8 bg-gray-50' : ''}`}
          >
            <div className="flex-1 min-w-0">
              <p className={`text-sm truncate ${s.bold ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>{s.label}</p>
              {s.splitPercentage != null && (
                <p className="text-xs text-gray-400">{s.splitPercentage}% share</p>
              )}
            </div>
            <div className="text-right ml-4 shrink-0">
              <p className={`text-sm font-semibold ${s.bold ? 'text-indigo-700' : 'text-gray-800'}`}>{fmtSGD(s.total)}</p>
              {s.splitPercentage != null && (
                <p className="text-xs text-indigo-500">→ {fmtSGD(s.myShare)}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t-2 border-indigo-200 bg-indigo-50 px-5 py-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Grand Total</p>
            <p className="text-2xl font-bold text-gray-900 mt-0.5">{fmtSGD(grandTotal)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">My Share</p>
            <p className="text-2xl font-bold text-indigo-700 mt-0.5">{fmtSGD(myShareTotal)}</p>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2">Monthly output estimate</p>
      </div>
    </div>
  );
}
