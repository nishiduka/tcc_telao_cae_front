import Atualizar from './atualizar';
import Criar from './criar';
import Listagem from './listagem';

export const agendamentoRecorrenteRoutes = [
  {
    route: '/agendamento/listagem',
    component: Listagem,
    isPublic: false,
  },
  {
    route: '/agendamento/criar',
    component: Criar,
    isPublic: false,
  },
  {
    route: '/agendamento/atualizar/:id',
    component: Atualizar,
    isPublic: false,
  },
];
