import { useState } from 'react';
import { ExpenseProvider } from './context/ExpenseContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ClientDashboard from './components/ClientDashboard';
import LeadsAdmin from './components/LeadsAdmin';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [leadsOpen, setLeadsOpen] = useState(false);

  return (
    <ExpenseProvider>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <Header onMenuClick={() => setSidebarOpen(true)} onLeadsClick={() => setLeadsOpen(true)} />
          <main className="flex-1 overflow-hidden">
            <ClientDashboard />
          </main>
        </div>
      </div>
      {leadsOpen && <LeadsAdmin onClose={() => setLeadsOpen(false)} />}
    </ExpenseProvider>
  );
}

export default App;
