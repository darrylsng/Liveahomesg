import { useState } from 'react';
import { useExpense } from '../context/ExpenseContext';
import RegularSection from './RegularSection';
import ChildSection from './ChildSection';
import SummaryCard from './SummaryCard';

export default function ClientDashboard() {
  const { state, dispatch } = useExpense();
  const client = state.clients.find(c => c.id === state.activeClientId);
  const [activeSection, setActiveSection] = useState(null);
  const [newSectionLabel, setNewSectionLabel] = useState('');
  const [addingSection, setAddingSection] = useState(false);

  if (!client) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 text-lg">
        Select or create a client to get started.
      </div>
    );
  }

  const currentSectionId = activeSection ?? client.sections[0]?.id;

  function handleAddSection() {
    if (!newSectionLabel.trim()) return;
    dispatch({ type: 'ADD_SECTION', clientId: client.id, label: newSectionLabel.trim() });
    setNewSectionLabel('');
    setAddingSection(false);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Section tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex items-center gap-1 overflow-x-auto">
          {client.sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                currentSectionId === section.id
                  ? 'border-indigo-600 text-indigo-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {section.label}
            </button>
          ))}
          <button
            onClick={() => setAddingSection(true)}
            className="px-3 py-3 text-sm text-gray-400 hover:text-indigo-600 whitespace-nowrap border-b-2 border-transparent"
          >
            + Section
          </button>
        </div>
      </div>

      {addingSection && (
        <div className="bg-indigo-50 border-b border-indigo-100 px-6 py-3 flex items-center gap-3">
          <input
            autoFocus
            className="flex-1 max-w-xs border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
            placeholder="Section name (e.g. Business Expenses)"
            value={newSectionLabel}
            onChange={e => setNewSectionLabel(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleAddSection(); if (e.key === 'Escape') setAddingSection(false); }}
          />
          <button onClick={handleAddSection} className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700">Add</button>
          <button onClick={() => setAddingSection(false)} className="px-3 py-1.5 bg-gray-200 text-gray-600 text-sm rounded-lg">Cancel</button>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6">
          {client.sections.map(section => {
            if (section.id !== currentSectionId) return null;
            if (section.children !== undefined) {
              return <ChildSection key={section.id} clientId={client.id} section={section} />;
            }
            return <RegularSection key={section.id} clientId={client.id} section={section} />;
          })}
        </div>

        {/* Summary sidebar */}
        <div className="w-80 shrink-0 overflow-y-auto p-4 border-l border-gray-200 bg-gray-50">
          <SummaryCard client={client} />
        </div>
      </div>
    </div>
  );
}
