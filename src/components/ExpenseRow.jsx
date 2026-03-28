import { useState } from 'react';
import { FREQUENCIES } from '../data/sampleData';

const COMMON_MODES = [
  'OCBC Savings', 'OCBC CC', 'DBS Giro', 'GIRO', 'Paynow',
  'Cash', 'CREDIT CARD', 'AXS', 'TT', '-'
];

export default function ExpenseRow({ item, clientId, sectionId, childId, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(item);

  function handleSave() {
    onUpdate({ ...draft, amount: parseFloat(draft.amount) || 0 });
    setEditing(false);
  }

  function handleCancel() {
    setDraft(item);
    setEditing(false);
  }

  const fmtAmount = (n) =>
    typeof n === 'number'
      ? `$${n.toLocaleString('en-SG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : n;

  if (editing) {
    return (
      <tr className="bg-blue-50">
        <td className="border border-gray-200 px-2 py-1">
          <input
            className="w-12 border rounded px-1 text-sm"
            value={draft.no}
            onChange={e => setDraft({ ...draft, no: e.target.value })}
          />
        </td>
        <td className="border border-gray-200 px-2 py-1">
          <input
            className="w-full border rounded px-1 text-sm"
            value={draft.item}
            onChange={e => setDraft({ ...draft, item: e.target.value })}
          />
        </td>
        <td className="border border-gray-200 px-2 py-1">
          <input
            type="number"
            className="w-28 border rounded px-1 text-sm"
            value={draft.amount}
            onChange={e => setDraft({ ...draft, amount: e.target.value })}
          />
        </td>
        <td className="border border-gray-200 px-2 py-1">
          <input
            className="w-full border rounded px-1 text-sm"
            value={draft.description}
            onChange={e => setDraft({ ...draft, description: e.target.value })}
          />
        </td>
        <td className="border border-gray-200 px-2 py-1">
          <select
            className="w-full border rounded px-1 text-sm"
            value={draft.frequency}
            onChange={e => setDraft({ ...draft, frequency: e.target.value })}
          >
            {FREQUENCIES.map(f => <option key={f}>{f}</option>)}
          </select>
        </td>
        <td className="border border-gray-200 px-2 py-1">
          <input
            className="w-20 border rounded px-1 text-sm"
            value={draft.date}
            onChange={e => setDraft({ ...draft, date: e.target.value })}
          />
        </td>
        <td className="border border-gray-200 px-2 py-1">
          <input
            className="w-full border rounded px-1 text-sm"
            value={draft.mode}
            onChange={e => setDraft({ ...draft, mode: e.target.value })}
            list="modes-list"
          />
          <datalist id="modes-list">
            {COMMON_MODES.map(m => <option key={m} value={m} />)}
          </datalist>
        </td>
        <td className="border border-gray-200 px-2 py-1 text-center">
          <button onClick={handleSave} className="text-green-600 hover:text-green-800 font-medium text-sm mr-2">Save</button>
          <button onClick={handleCancel} className="text-gray-500 hover:text-gray-700 text-sm">Cancel</button>
        </td>
      </tr>
    );
  }

  return (
    <tr className="hover:bg-gray-50 group">
      <td className="border border-gray-200 px-3 py-2 text-sm text-gray-500 text-center">{item.no}</td>
      <td className="border border-gray-200 px-3 py-2 text-sm font-medium text-gray-800">{item.item || <span className="text-gray-300 italic">Untitled</span>}</td>
      <td className="border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-800 text-right">
        {fmtAmount(item.amount)}
      </td>
      <td className="border border-gray-200 px-3 py-2 text-sm text-gray-600 max-w-xs truncate" title={item.description}>{item.description || '-'}</td>
      <td className="border border-gray-200 px-3 py-2 text-sm text-center text-gray-600">{item.frequency || '-'}</td>
      <td className="border border-gray-200 px-3 py-2 text-sm text-center text-gray-600">{item.date || '-'}</td>
      <td className="border border-gray-200 px-3 py-2 text-sm text-gray-600">{item.mode || '-'}</td>
      <td className="border border-gray-200 px-2 py-2 text-center">
        <div className="flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setEditing(true)}
            className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
          >Edit</button>
          <button
            onClick={() => onDelete(item.id)}
            className="px-2 py-0.5 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200"
          >Del</button>
        </div>
      </td>
    </tr>
  );
}
