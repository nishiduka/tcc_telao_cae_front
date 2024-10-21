import Atualizar from './atualizar';
import Criar from './criar';
import Listagem from './listagem';

export const materiasRoutes = [
  {
    route: '/materias/listagem',
    component: Listagem,
    isPublic: false,
  },
  {
    route: '/materias/criar',
    component: Criar,
    isPublic: false,
  },
  {
    route: '/materias/atualizar/:id',
    component: Atualizar,
    isPublic: false,
  },
];
