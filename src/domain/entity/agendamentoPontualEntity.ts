import MateriaEntity from './materiaEntity';
import ProfessorEntity from './professorEntity';
import SalaEntity from './salaEntity';

type AgendamentoPontualEntity = {
  id?: number;
  data: Date;
  horarioInicio: string;
  horarioFim: string;
  professor: Required<Pick<ProfessorEntity, 'id'>> & ProfessorEntity;
  materia: Required<Pick<MateriaEntity, 'id'>> & MateriaEntity;
  sala: Required<Pick<SalaEntity, 'id'>> & SalaEntity;
  created_at?: Date;
  updated_at?: Date;
};

export default AgendamentoPontualEntity;
