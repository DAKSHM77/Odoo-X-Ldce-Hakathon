import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ItineraryProvider } from './context/ItineraryContext';
import Navbar from './components/common/Navbar';
import AppRoutes from './routes/AppRoutes';
import './styles/global.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ItineraryProvider>
          <div className="app-container">
            <Navbar />
            <main className="main-content">
              <AppRoutes />
            </main>
          </div>
        </ItineraryProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
