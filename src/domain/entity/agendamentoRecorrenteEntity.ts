import { EDiaSemana } from './eDiaSemana';
import MateriaEntity from './materiaEntity';
import ProfessorEntity from './professorEntity';
import SalaEntity from './salaEntity';

type AgendamentoRecorrenteEntity = {
  id?: number;
  diaSemana: EDiaSemana;
  horaInicio: string;
  horaFim: string;
  professor: Required<Pick<ProfessorEntity, 'id'>> & ProfessorEntity;
  materia: Required<Pick<MateriaEntity, 'id'>> & MateriaEntity;
  sala: Required<Pick<SalaEntity, 'id'>> & SalaEntity;
  created_at?: Date;
  updated_at?: Date;
};

export default AgendamentoRecorrenteEntity;
