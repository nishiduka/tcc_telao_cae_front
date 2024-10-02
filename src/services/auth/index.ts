import GenericResponse from '../../domain/dto/request/genericResponse';
import UserEntity from '../../domain/entity/userEntity';
import api from '../api';

const PATH = '/auth';

export const login = async (
  email: string,
  password: string
): Promise<string> => {
  try {
    const response = await api.post<GenericResponse<string>>(PATH + '/login', {
      email,
      password,
    });

    if (response.status === 200 && response.data.success) {
      return response.data.content;
    } else {
      throw new Error('Login ou senha incorretos');
    }
  } catch (error) {
    console.error('login erro:::', error);
    throw new Error('Erro ao fazer login. Tente novamente.');
  }
};

export const createUser = async (
  data: UserEntity
): Promise<GenericResponse<UserEntity>> => {
  try {
    const response = await api.post<GenericResponse<UserEntity>>(
      PATH + '/create',
      data
    );

    if (response.status === 200 && response.data.success) {
      return response.data;
    } else {
      throw new Error('Erro ao criar usuário');
    }
  } catch (error) {
    console.error('createUser erro:::', error);
    throw new Error('Erro ao fazer login. Tente novamente.');
  }
};
