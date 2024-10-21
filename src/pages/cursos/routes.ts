import Atualizar from './atualizar';
import Criar from './criar';
import Listagem from './listagem';

export const cursosRoutes = [
  {
    route: '/cursos/listagem',
    component: Listagem,
    isPublic: false,
  },
  {
    route: '/cursos/criar',
    component: Criar,
    isPublic: false,
  },
  {
    route: '/cursos/atualizar/:id',
    component: Atualizar,
    isPublic: false,
  },
];
