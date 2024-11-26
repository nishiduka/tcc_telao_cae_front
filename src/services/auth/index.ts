import GenericResponse from '../../domain/dto/request/genericResponse';
import UserEntity from '../../domain/entity/userEntity';
import { RequestGeneric } from '../api';

const PATH = '/auth';
const request = new RequestGeneric();

export const login = async (
  email: string,
  password: string
): Promise<string> => {
  const response = await request.post<string>(PATH + '/login', {
    login: email,
    password,
  });

  return response.content;
};

export const getCurrentUser = async (): Promise<UserEntity> => {
  const response = await request.get<UserEntity>(PATH + '/');
  return response.content;
};

export const getUsers = async (): Promise<GenericResponse<UserEntity[]>> => {
  const response = await request.get<UserEntity[]>(PATH + '/listagem');
  return response;
};

export const getUser = async (
  id: number
): Promise<GenericResponse<UserEntity>> => {
  const response = await request.get<UserEntity>(PATH + '/user/' + id);
  return response;
};

export const createUser = async (
  data: UserEntity
): Promise<GenericResponse<UserEntity>> => {
  return await request.post<UserEntity>(PATH + '/register', data);
};

export const updateUser = async (
  data: UserEntity
): Promise<GenericResponse<UserEntity>> => {
  return await request.put<UserEntity>(PATH + '/update/' + data.id, {
    nome: data.nome,
    login: data.login,
    password: data?.password || null,
    role: data.role,
  });
};

export const removeUser = async (id: number): Promise<void> => {
  await request.delete<UserEntity>(PATH + '/delete/' + id);
};
