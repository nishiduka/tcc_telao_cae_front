import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import RoutesComponent from './routes/routes';
import { AlertProvider } from './hooks/useAlert';

function App() {
  return (
    <AuthProvider>
      <AlertProvider>
        <Router>
          <RoutesComponent />
        </Router>
      </AlertProvider>
    </AuthProvider>
  );
}

export default App;
