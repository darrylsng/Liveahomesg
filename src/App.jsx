import { ExpenseProvider } from './context/ExpenseContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ClientDashboard from './components/ClientDashboard';

function App() {
  return (
    <ExpenseProvider>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-hidden">
            <ClientDashboard />
          </main>
        </div>
      </div>
    </ExpenseProvider>
  );
}

export default App;
