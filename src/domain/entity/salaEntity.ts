import BlocoEntity from './blocoEntity';

type SalaEntity = {
  id?: number;
  bloco: BlocoEntity;
  nome: string;
  descricao: string;
  qtdComputadores: number;
  qtdAlunos: number;
  created_at?: Date;
  updated_at?: Date;
};

export default SalaEntity;
