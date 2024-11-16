import Atualizar from './atualizar';
import Criar from './criar';

export const agendamentoRecorrenteRoutes = [
  {
    route: '/agendamento-recorrente/criar',
    component: Criar,
    isPublic: false,
  },
  {
    route: '/agendamento-recorrente/:id',
    component: Atualizar,
    isPublic: false,
  },
];
