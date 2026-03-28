import { useState } from 'react';
import ExpenseTable from './ExpenseTable';
import { useExpense } from '../context/ExpenseContext';

export default function RegularSection({ clientId, section }) {
  const { dispatch } = useExpense();
  const [split, setSplit] = useState(section.splitPercentage ?? '');
  const hasSplit = section.splitPercentage != null;

  function handleSplitChange(e) {
    const val = e.target.value;
    setSplit(val);
    if (val === '') {
      dispatch({ type: 'UPDATE_SECTION_SPLIT', clientId, sectionId: section.id, value: null });
    } else {
      dispatch({ type: 'UPDATE_SECTION_SPLIT', clientId, sectionId: section.id, value: parseFloat(val) || 100 });
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">{section.label}</h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">My share %:</span>
          <input
            type="number"
            min="0"
            max="100"
            placeholder="100"
            className="w-16 text-sm border border-gray-300 rounded-lg px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-indigo-300"
            value={split}
            onChange={handleSplitChange}
          />
          <span className="text-xs text-gray-500">%</span>
          {hasSplit && (
            <button
              onClick={() => {
                setSplit('');
                dispatch({ type: 'UPDATE_SECTION_SPLIT', clientId, sectionId: section.id, value: null });
              }}
              className="text-xs text-gray-400 hover:text-red-500"
              title="Remove split"
            >✕</button>
          )}
        </div>
      </div>
      <ExpenseTable
        clientId={clientId}
        sectionId={section.id}
        items={section.items}
        splitPercentage={section.splitPercentage}
      />
    </div>
  );
}
