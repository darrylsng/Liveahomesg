import { useState } from 'react';
import ExpenseTable from './ExpenseTable';
import { useExpense } from '../context/ExpenseContext';

export default function ChildSection({ clientId, section }) {
  const { dispatch } = useExpense();
  const [newChildName, setNewChildName] = useState('');
  const [addingChild, setAddingChild] = useState(false);
  const [split, setSplit] = useState(section.splitPercentage ?? 100);

  function handleAddChild() {
    if (!newChildName.trim()) return;
    dispatch({ type: 'ADD_CHILD', clientId, name: newChildName.trim() });
    setNewChildName('');
    setAddingChild(false);
  }

  function handleSplitBlur() {
    dispatch({ type: 'UPDATE_SECTION_SPLIT', clientId, sectionId: section.id, value: parseFloat(split) || 100 });
  }

  const totalBothKids = section.children.reduce(
    (sum, ch) => sum + ch.items.reduce((s, i) => s + (parseFloat(i.amount) || 0), 0),
    0
  );
  const myShare = (totalBothKids * (section.splitPercentage ?? 100)) / 100;

  const fmtSGD = (n) =>
    `$${n.toLocaleString('en-SG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-gray-800">{section.label}</h2>
          <div className="flex items-center gap-1.5 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-1">
            <span className="text-xs text-gray-500">My share:</span>
            <input
              type="number"
              min="0"
              max="100"
              className="w-14 text-sm font-semibold text-yellow-700 bg-transparent border-none outline-none text-center"
              value={split}
              onChange={e => setSplit(e.target.value)}
              onBlur={handleSplitBlur}
            />
            <span className="text-xs text-yellow-600 font-medium">%</span>
          </div>
        </div>
        <button
          onClick={() => setAddingChild(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors"
        >
          <span>+ Add Child</span>
        </button>
      </div>

      {addingChild && (
        <div className="mb-4 flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
          <input
            autoFocus
            className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
            placeholder="Child's name"
            value={newChildName}
            onChange={e => setNewChildName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleAddChild(); if (e.key === 'Escape') setAddingChild(false); }}
          />
          <button onClick={handleAddChild} className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">Add</button>
          <button onClick={() => setAddingChild(false)} className="px-3 py-1.5 bg-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-300">Cancel</button>
        </div>
      )}

      {section.children.map(child => (
        <div key={child.id} className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-purple-400"></div>
            <h3 className="font-semibold text-gray-700">{child.name}</h3>
            <button
              onClick={() => dispatch({ type: 'DELETE_CHILD', clientId, childId: child.id })}
              className="ml-auto text-xs text-red-400 hover:text-red-600"
            >Remove</button>
          </div>
          <ExpenseTable
            clientId={clientId}
            sectionId={section.id}
            childId={child.id}
            items={child.items}
          />
        </div>
      ))}

      {section.children.length === 0 && !addingChild && (
        <div className="text-center py-8 text-gray-400 text-sm italic border border-dashed border-gray-200 rounded-lg">
          No children added yet. Click "+ Add Child" to begin.
        </div>
      )}

      {section.children.length > 0 && (
        <div className="mt-2 p-4 bg-purple-50 rounded-xl border border-purple-200">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Total Both Kids</span>
            <span className="font-bold text-gray-900">{fmtSGD(totalBothKids)}</span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-sm text-purple-600">My Share ({section.splitPercentage ?? 100}%)</span>
            <span className="font-bold text-purple-700">{fmtSGD(myShare)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
