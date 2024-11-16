import { Route, Routes } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import { PrivateRoute } from './privateRoute';
import { salasRoutes } from '../pages/salas/routes';
import { cursosRoutes } from '../pages/cursos/routes';
import { materiasRoutes } from '../pages/materias/routes';
import { professoresRoutes } from '../pages/professores/routes';
import { agendamentoRecorrenteRoutes } from '../pages/agendamentoRecorrente/routes';
import { agendamentoPontualRoutes } from '../pages/agendamentoPontual/routes';
import { listagemRoutes } from '../pages/agendamento/routes';

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
  ...cursosRoutes,
  ...materiasRoutes,
  ...professoresRoutes,
  ...agendamentoRecorrenteRoutes,
  ...agendamentoPontualRoutes,
  ...listagemRoutes,
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
