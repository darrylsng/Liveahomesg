import { useState, useRef, useEffect } from 'react';
import { FREQUENCIES } from '../data/sampleData';

const COMMON_MODES = [
  'OCBC Savings', 'OCBC CC', 'DBS Giro', 'GIRO', 'Paynow',
  'Cash', 'CREDIT CARD', 'AXS', 'TT', '-'
];

function EditableCell({ value, onChange, onBlur, type = 'text', className = '', children }) {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  if (editing) {
    return (
      <div className="w-full">
        {children ? (
          children({ ref: inputRef, onBlur: () => { setEditing(false); onBlur?.(); } })
        ) : (
          <input
            ref={inputRef}
            type={type}
            value={value}
            onChange={e => onChange(e.target.value)}
            onBlur={() => { setEditing(false); onBlur?.(); }}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === 'Escape') { setEditing(false); onBlur?.(); } }}
            className={`w-full border border-blue-400 rounded px-1 py-0.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 ${className}`}
          />
        )}
      </div>
    );
  }

  return (
    <div
      onClick={() => setEditing(true)}
      className="w-full min-h-[1.5rem] cursor-text hover:bg-blue-50 rounded px-1 -mx-1 transition-colors"
      title="Click to edit"
    >
      {value || <span className="text-gray-300 italic text-xs">click to edit</span>}
    </div>
  );
}

const fmtAmount = (n) =>
  typeof n === 'number'
    ? `$${n.toLocaleString('en-SG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : `$${parseFloat(n || 0).toLocaleString('en-SG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function ExpenseRow({ item, onUpdate, onDelete }) {
  const [draft, setDraft] = useState(item);

  useEffect(() => {
    setDraft(item);
  }, [item]);

  function save(updates) {
    const updated = { ...draft, ...updates };
    if (updates.amount !== undefined) updated.amount = parseFloat(updates.amount) || 0;
    setDraft(updated);
    onUpdate(updated);
  }

  return (
    <tr className="hover:bg-gray-50 group border-b border-gray-100">
      <td className="border border-gray-200 px-2 py-1.5 text-sm text-gray-500 text-center">
        <EditableCell value={draft.no} onChange={v => setDraft({ ...draft, no: v })} onBlur={() => save({ no: draft.no })} />
      </td>
      <td className="border border-gray-200 px-2 py-1.5 text-sm font-medium text-gray-800">
        <EditableCell value={draft.item} onChange={v => setDraft({ ...draft, item: v })} onBlur={() => save({ item: draft.item })} />
      </td>
      <td className="border border-gray-200 px-2 py-1.5 text-sm font-semibold text-gray-800 text-right">
        <EditableCell
          value={draft.amount}
          type="number"
          onChange={v => setDraft({ ...draft, amount: v })}
          onBlur={() => save({ amount: draft.amount })}
        >
          {({ ref, onBlur }) => (
            <input
              ref={ref}
              type="number"
              value={draft.amount}
              onChange={e => setDraft({ ...draft, amount: e.target.value })}
              onBlur={onBlur}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === 'Escape') onBlur(); }}
              className="w-full border border-blue-400 rounded px-1 py-0.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          )}
        </EditableCell>
        {!String(draft.amount).includes('.') && <span className="hidden">{fmtAmount(draft.amount)}</span>}
      </td>
      <td className="border border-gray-200 px-2 py-1.5 text-sm text-gray-600">
        <EditableCell value={draft.description} onChange={v => setDraft({ ...draft, description: v })} onBlur={() => save({ description: draft.description })} />
      </td>
      <td className="border border-gray-200 px-2 py-1.5 text-sm text-center text-gray-600">
        <EditableCell value={draft.frequency} onChange={v => setDraft({ ...draft, frequency: v })} onBlur={() => save({ frequency: draft.frequency })}>
          {({ ref, onBlur }) => (
            <select
              ref={ref}
              value={draft.frequency}
              onChange={e => { setDraft({ ...draft, frequency: e.target.value }); save({ frequency: e.target.value }); }}
              onBlur={onBlur}
              className="w-full border border-blue-400 rounded px-1 py-0.5 text-sm focus:outline-none"
            >
              {FREQUENCIES.map(f => <option key={f}>{f}</option>)}
            </select>
          )}
        </EditableCell>
      </td>
      <td className="border border-gray-200 px-2 py-1.5 text-sm text-center text-gray-600">
        <EditableCell value={draft.date} onChange={v => setDraft({ ...draft, date: v })} onBlur={() => save({ date: draft.date })} />
      </td>
      <td className="border border-gray-200 px-2 py-1.5 text-sm text-gray-600">
        <EditableCell value={draft.mode} onChange={v => setDraft({ ...draft, mode: v })} onBlur={() => save({ mode: draft.mode })}>
          {({ ref, onBlur }) => (
            <>
              <input
                ref={ref}
                list="modes-list"
                value={draft.mode}
                onChange={e => setDraft({ ...draft, mode: e.target.value })}
                onBlur={onBlur}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === 'Escape') onBlur(); }}
                className="w-full border border-blue-400 rounded px-1 py-0.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <datalist id="modes-list">
                {COMMON_MODES.map(m => <option key={m} value={m} />)}
              </datalist>
            </>
          )}
        </EditableCell>
      </td>
      <td className="border border-gray-200 px-2 py-1.5 text-center">
        <button
          onClick={() => onDelete(item.id)}
          className="opacity-0 group-hover:opacity-100 px-2 py-0.5 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200 transition-opacity"
        >Del</button>
      </td>
    </tr>
  );
}
