import { useState } from 'react';
import { useExpense } from '../context/ExpenseContext';

export default function Sidebar({ open, onClose }) {
  const { state, dispatch } = useExpense();
  const [newName, setNewName] = useState('');
  const [addingClient, setAddingClient] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  function handleAddClient() {
    if (!newName.trim()) return;
    dispatch({ type: 'ADD_CLIENT', name: newName.trim() });
    setNewName('');
    setAddingClient(false);
  }

  function handleDelete(clientId) {
    dispatch({ type: 'DELETE_CLIENT', clientId });
    setConfirmDelete(null);
  }

  function handleSelectClient(clientId) {
    dispatch({ type: 'SET_ACTIVE_CLIENT', clientId });
    onClose?.();
  }

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-30 w-56 bg-gray-900 flex flex-col
        transform transition-transform duration-200
        lg:relative lg:translate-x-0 lg:z-auto
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="px-5 py-5 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <div>
              <p className="text-white text-sm font-bold leading-tight">LiveAHome</p>
              <p className="text-gray-400 text-xs">Expense Tracker</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Clients list */}
        <div className="flex-1 overflow-y-auto py-3">
          <div className="px-4 py-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Clients</p>
          </div>
          <nav className="space-y-0.5 px-2">
            {state.clients.map(client => (
              <div
                key={client.id}
                className={`group flex items-center justify-between rounded-lg px-3 py-2.5 cursor-pointer transition-colors ${
                  state.activeClientId === client.id
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
                onClick={() => handleSelectClient(client.id)}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    state.activeClientId === client.id ? 'bg-indigo-400 text-white' : 'bg-gray-700 text-gray-300'
                  }`}>
                    {client.name[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-medium truncate">{client.name}</span>
                </div>
                {confirmDelete === client.id ? (
                  <div className="flex gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                    <button onClick={() => handleDelete(client.id)} className="text-red-400 hover:text-red-300 text-xs font-medium">Yes</button>
                    <button onClick={() => setConfirmDelete(null)} className="text-gray-400 hover:text-gray-200 text-xs">No</button>
                  </div>
                ) : (
                  <button
                    onClick={e => { e.stopPropagation(); setConfirmDelete(client.id); }}
                    className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-opacity text-sm leading-none shrink-0"
                  >✕</button>
                )}
              </div>
            ))}
          </nav>

          {addingClient ? (
            <div className="px-2 mt-2">
              <input
                autoFocus
                className="w-full bg-gray-800 text-white text-sm border border-gray-600 rounded-lg px-3 py-2 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                placeholder="Client name"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleAddClient(); if (e.key === 'Escape') setAddingClient(false); }}
              />
              <div className="flex gap-2 mt-2">
                <button onClick={handleAddClient} className="flex-1 py-1.5 bg-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-700">Add</button>
                <button onClick={() => setAddingClient(false)} className="flex-1 py-1.5 bg-gray-700 text-gray-300 text-xs rounded-lg hover:bg-gray-600">Cancel</button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setAddingClient(true)}
              className="w-full mt-2 px-5 py-2.5 text-left text-sm text-gray-400 hover:text-gray-200 flex items-center gap-2"
            >
              <span className="text-base">+</span>
              <span>New Client</span>
            </button>
          )}
        </div>

        <div className="px-5 py-4 border-t border-gray-700">
          <p className="text-xs text-gray-500">Data saved locally</p>
        </div>
      </aside>
    </>
  );
}
