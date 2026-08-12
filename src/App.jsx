import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ListingsPage from './pages/ListingsPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import AgentDashboard from './pages/AgentDashboard';
import ListPropertyPage from './pages/ListPropertyPage';
import MortgagePage from './pages/MortgagePage';
import SavedPage from './pages/SavedPage';

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/listings" element={<ListingsPage />} />
              <Route path="/property/:id" element={<PropertyDetailPage />} />
              <Route path="/dashboard" element={<AgentDashboard />} />
              <Route path="/list-property" element={<ListPropertyPage />} />
              <Route path="/mortgage" element={<MortgagePage />} />
              <Route path="/saved" element={<SavedPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AppProvider>
    </BrowserRouter>
  );
}
