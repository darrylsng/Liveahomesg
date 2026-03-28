import ExpenseRow from './ExpenseRow';
import { useExpense } from '../context/ExpenseContext';
import { nextId } from '../data/sampleData';

const fmtSGD = (n) =>
  `$${n.toLocaleString('en-SG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function ExpenseTable({ clientId, sectionId, childId, items, label, splitPercentage }) {
  const { dispatch } = useExpense();

  const total = items.reduce((sum, i) => sum + (parseFloat(i.amount) || 0), 0);
  const splitTotal = splitPercentage != null ? (total * splitPercentage) / 100 : null;

  function handleUpdate(item) {
    dispatch({ type: 'UPDATE_ITEM', clientId, sectionId, childId, item });
  }

  function handleDelete(itemId) {
    dispatch({ type: 'DELETE_ITEM', clientId, sectionId, childId, itemId });
  }

  function handleAddRow() {
    const nextNo = items.length > 0 ? Math.max(...items.map(i => parseInt(i.no) || 0)) + 1 : 1;
    dispatch({ type: 'ADD_ITEM', clientId, sectionId, childId, no: nextNo });
  }

  return (
    <div className="mb-6">
      {label && (
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{label}</h3>
          {splitPercentage != null && (
            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              {splitPercentage}% share applies
            </span>
          )}
        </div>
      )}
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm -mx-3 sm:mx-0">
        <table className="w-full text-sm border-collapse bg-white">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="border-r border-gray-200 px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase w-12">No.</th>
              <th className="border-r border-gray-200 px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase min-w-36">Item</th>
              <th className="border-r border-gray-200 px-3 py-2.5 text-right text-xs font-semibold text-gray-500 uppercase w-32">Amount</th>
              <th className="border-r border-gray-200 px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Description</th>
              <th className="border-r border-gray-200 px-3 py-2.5 text-center text-xs font-semibold text-gray-500 uppercase w-24">Frequency</th>
              <th className="border-r border-gray-200 px-3 py-2.5 text-center text-xs font-semibold text-gray-500 uppercase w-20">Date</th>
              <th className="border-r border-gray-200 px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase w-36">Mode</th>
              <th className="px-2 py-2.5 w-24"></th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <ExpenseRow
                key={item.id}
                item={item}
                clientId={clientId}
                sectionId={sectionId}
                childId={childId}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-6 text-gray-400 italic text-sm">
                  No items yet. Click "+ Add Row" to get started.
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50 border-t-2 border-gray-300 font-semibold">
              <td colSpan={2} className="border-r border-gray-200 px-3 py-2.5 text-sm text-gray-700">
                <button
                  onClick={handleAddRow}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs font-medium"
                >
                  <span className="text-base leading-none">+</span> Add Row
                </button>
              </td>
              <td className="border-r border-gray-200 px-3 py-2.5 text-right text-sm text-gray-800">
                {fmtSGD(total)}
              </td>
              <td colSpan={5} className="px-3 py-2.5 text-sm text-gray-500">
                {splitTotal != null && (
                  <span>My share ({splitPercentage}%): <strong className="text-indigo-700">{fmtSGD(splitTotal)}</strong></span>
                )}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
