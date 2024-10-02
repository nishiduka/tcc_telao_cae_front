import GenericResponse from '../../domain/dto/request/genericResponse';
import MateriaEntity from '../../domain/entity/materiaEntity';
import { RequestGeneric } from '../api';

const PATH = '/materias';
const request = new RequestGeneric();

export const list = async (): Promise<GenericResponse<MateriaEntity[]>> => {
  return request.get<MateriaEntity[]>(PATH + '/');
};

export const search = async (
  id: number
): Promise<GenericResponse<MateriaEntity>> => {
  return request.get<MateriaEntity>(PATH + '/' + id);
};

export const create = async (
  data: MateriaEntity
): Promise<GenericResponse<MateriaEntity>> => {
  return request.post<MateriaEntity>(PATH + '/', data);
};

export const update = async (
  data: MateriaEntity
): Promise<GenericResponse<MateriaEntity>> => {
  return request.put<MateriaEntity>(PATH + '/' + data.id, data);
};

export const remove = async (id: number) => {
  return request.delete<MateriaEntity>(PATH + '/' + id);
};
