import { createContext, useContext, useReducer, useEffect } from 'react';
import { initialClients, nextId } from '../data/sampleData';

const ExpenseContext = createContext(null);

function loadState() {
  try {
    const saved = localStorage.getItem('expense_tracker_v1');
    return saved ? JSON.parse(saved) : { clients: initialClients, activeClientId: 'kelly' };
  } catch {
    return { clients: initialClients, activeClientId: 'kelly' };
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_ACTIVE_CLIENT':
      return { ...state, activeClientId: action.clientId };

    case 'ADD_CLIENT': {
      const newClient = {
        id: nextId(),
        name: action.name,
        sections: [
          { id: 'personal', label: 'Personal Expenses', splitPercentage: null, items: [] },
          { id: 'household', label: 'Household', splitPercentage: 100, items: [] },
          { id: 'children', label: 'Children Expenses', splitPercentage: 100, children: [] },
        ],
      };
      return {
        ...state,
        clients: [...state.clients, newClient],
        activeClientId: newClient.id,
      };
    }

    case 'DELETE_CLIENT':
      return {
        ...state,
        clients: state.clients.filter(c => c.id !== action.clientId),
        activeClientId: state.clients.find(c => c.id !== action.clientId)?.id || null,
      };

    case 'UPDATE_SECTION_SPLIT': {
      return updateClient(state, action.clientId, client => ({
        ...client,
        sections: client.sections.map(s =>
          s.id === action.sectionId ? { ...s, splitPercentage: action.value } : s
        ),
      }));
    }

    case 'ADD_ITEM': {
      const newItem = { id: nextId(), no: action.no, item: '', amount: 0, description: '', frequency: '-', date: '-', mode: '-' };
      return updateClient(state, action.clientId, client => ({
        ...client,
        sections: client.sections.map(s => {
          if (s.id !== action.sectionId) return s;
          if (s.children) {
            return {
              ...s,
              children: s.children.map(ch =>
                ch.id === action.childId ? { ...ch, items: [...ch.items, newItem] } : ch
              ),
            };
          }
          return { ...s, items: [...s.items, newItem] };
        }),
      }));
    }

    case 'UPDATE_ITEM': {
      return updateClient(state, action.clientId, client => ({
        ...client,
        sections: client.sections.map(s => {
          if (s.id !== action.sectionId) return s;
          if (s.children) {
            return {
              ...s,
              children: s.children.map(ch =>
                ch.id === action.childId
                  ? { ...ch, items: ch.items.map(i => i.id === action.item.id ? action.item : i) }
                  : ch
              ),
            };
          }
          return { ...s, items: s.items.map(i => i.id === action.item.id ? action.item : i) };
        }),
      }));
    }

    case 'DELETE_ITEM': {
      return updateClient(state, action.clientId, client => ({
        ...client,
        sections: client.sections.map(s => {
          if (s.id !== action.sectionId) return s;
          if (s.children) {
            return {
              ...s,
              children: s.children.map(ch =>
                ch.id === action.childId
                  ? { ...ch, items: ch.items.filter(i => i.id !== action.itemId) }
                  : ch
              ),
            };
          }
          return { ...s, items: s.items.filter(i => i.id !== action.itemId) };
        }),
      }));
    }

    case 'ADD_CHILD': {
      const newChild = { id: nextId(), name: action.name, items: [] };
      return updateClient(state, action.clientId, client => ({
        ...client,
        sections: client.sections.map(s =>
          s.id === 'children' ? { ...s, children: [...s.children, newChild] } : s
        ),
      }));
    }

    case 'DELETE_CHILD': {
      return updateClient(state, action.clientId, client => ({
        ...client,
        sections: client.sections.map(s =>
          s.id === 'children'
            ? { ...s, children: s.children.filter(ch => ch.id !== action.childId) }
            : s
        ),
      }));
    }

    case 'ADD_SECTION': {
      const newSection = { id: nextId(), label: action.label, splitPercentage: 100, items: [] };
      return updateClient(state, action.clientId, client => ({
        ...client,
        sections: [...client.sections, newSection],
      }));
    }

    default:
      return state;
  }
}

function updateClient(state, clientId, updater) {
  return {
    ...state,
    clients: state.clients.map(c => c.id === clientId ? updater(c) : c),
  };
}

export function ExpenseProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, loadState);

  useEffect(() => {
    localStorage.setItem('expense_tracker_v1', JSON.stringify(state));
  }, [state]);

  return (
    <ExpenseContext.Provider value={{ state, dispatch }}>
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpense() {
  return useContext(ExpenseContext);
}
