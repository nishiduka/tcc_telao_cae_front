import CursoEntity from './cursoEntity';

type MateriaEntity = {
  id?: number;
  nome: string;
  sigla: string;
  curso: CursoEntity;
  created_at: Date;
  updated_at: Date;
};

export default MateriaEntity;
