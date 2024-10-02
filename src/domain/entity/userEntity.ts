import ERole from '../dto/enum/eRole';

type UserEntity = {
  id?: number;
  nome: string;
  login: string;
  password?: string;
  role: ERole;
};

export default UserEntity;
