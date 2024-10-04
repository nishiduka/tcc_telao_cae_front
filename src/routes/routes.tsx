import { Route, Routes } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import { PrivateRoute } from './privateRoute';
import { salasRoutes } from '../pages/salas/routes';

const routes = [
  {
    route: '/',
    component: HomePage,
    isPublic: true,
  },
  {
    route: '/login',
    component: LoginPage,
    isPublic: true,
  },
  {
    route: '/Dashboard',
    component: Dashboard,
    isPublic: false,
  },
  ...salasRoutes,
];

const RoutesComponent = () => {
  return (
    <Routes>
      {routes.map((route) => {
        if (route.isPublic) {
          return (
            <Route
              key={route.route}
              path={route.route}
              element={<route.component />}
            />
          );
        }
        return (
          <Route
            key={route.route}
            path={route.route}
            element={
              <PrivateRoute>
                <route.component />
              </PrivateRoute>
            }
          />
        );
      })}
    </Routes>
  );
};
export default RoutesComponent;
