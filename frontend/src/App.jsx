import { BrowserRouter } from 'react-router-dom';
import { TripProvider } from './context/TripContext';
import AppRoutes from './routes/AppRoutes';
import './styles/global.css';

function App() {
  return (
    <BrowserRouter>
      <TripProvider>
        <AppRoutes />
      </TripProvider>
    </BrowserRouter>
  );
}

export default App;
