import MateriaEntity from './materiaEntity';
import ProfessorEntity from './professorEntity';
import SalaEntity from './salaEntity';

type AgendamentoRecorrenteEntity = {
  id?: number;
  dia_semana: string;
  horario_inicio: string;
  horario_fim: string;
  professor: ProfessorEntity;
  materia: MateriaEntity;
  sala: SalaEntity;
  created_at: Date;
  updated_at: Date;
};

export default AgendamentoRecorrenteEntity;
