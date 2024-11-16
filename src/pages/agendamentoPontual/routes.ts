import Atualizar from './atualizar';
import Criar from './criar';

export const agendamentoPontualRoutes = [
  {
    route: '/agendamento-pontual/criar',
    component: Criar,
    isPublic: false,
  },
  {
    route: '/agendamento-pontual/:id',
    component: Atualizar,
    isPublic: false,
  },
];
