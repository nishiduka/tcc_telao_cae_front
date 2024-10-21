import Atualizar from './atualizar';
import Criar from './criar';
import Listagem from './listagem';

export const professoresRoutes = [
  {
    route: '/professores/listagem',
    component: Listagem,
    isPublic: false,
  },
  {
    route: '/professores/criar',
    component: Criar,
    isPublic: false,
  },
  {
    route: '/professores/atualizar/:id',
    component: Atualizar,
    isPublic: false,
  },
];
