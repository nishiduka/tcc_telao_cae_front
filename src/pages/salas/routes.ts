import Atualizar from './atualizar';
import Criar from './criar';
import Listagem from './listagem';

export const salasRoutes = [
  {
    route: '/salas/listagem',
    component: Listagem,
    isPublic: false,
  },
  {
    route: '/salas/criar',
    component: Criar,
    isPublic: false,
  },
  {
    route: '/salas/atualizar/:id',
    component: Atualizar,
    isPublic: false,
  },
];
