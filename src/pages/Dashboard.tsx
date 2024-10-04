import { useAuth } from '../context/AuthContext';
import Template from '../components/template';

const Dashboard = () => {
  const { user } = useAuth();
  return <Template></Template>;
};

export default Dashboard;
