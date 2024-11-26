import Atualizar from './atualizar';
import Criar from './criar';
import Listagem from './listagem';

export const usuariosRoutes = [
  {
    route: '/usuarios/listagem',
    component: Listagem,
    isPublic: false,
  },
  {
    route: '/usuarios/criar',
    component: Criar,
    isPublic: false,
  },
  {
    route: '/usuarios/atualizar/:id',
    component: Atualizar,
    isPublic: false,
  },
];
