import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import RoutesComponent from './routes/routes';

function App() {
  return (
    <AuthProvider>
      <Router>
        <RoutesComponent />
      </Router>
    </AuthProvider>
  );
}

export default App;
