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

export const createUser = async (
  data: UserEntity
): Promise<GenericResponse<UserEntity>> => {
  return await request.post<UserEntity>(PATH + '/create', data);
};
