import { EDiaSemana } from './eDiaSemana';
import MateriaEntity from './materiaEntity';
import ProfessorEntity from './professorEntity';
import SalaEntity from './salaEntity';

type AgendamentoDTO = {
  id: number;
  sala: SalaEntity;
  professor: ProfessorEntity;
  materia: MateriaEntity;
  diaSemana: EDiaSemana;
  horarioInicio: string;
  horarioFim: string;
  tipo: string;
};

export default AgendamentoDTO;
