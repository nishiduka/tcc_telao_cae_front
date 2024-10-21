import GenericResponse from '../../domain/dto/request/genericResponse';
import CursoEntity from '../../domain/entity/cursoEntity';
import { RequestGeneric } from '../api';

const PATH = '/cursos';
const request = new RequestGeneric();

export const list = async (): Promise<GenericResponse<CursoEntity[]>> => {
  return request.get<CursoEntity[]>(PATH);
};

export const search = async (
  id: number
): Promise<GenericResponse<CursoEntity>> => {
  return request.get<CursoEntity>(PATH + '/' + id);
};

export const create = async (
  data: CursoEntity
): Promise<GenericResponse<CursoEntity>> => {
  return request.post<CursoEntity>(PATH, data);
};

export const update = async (
  data: CursoEntity
): Promise<GenericResponse<CursoEntity>> => {
  return request.put<CursoEntity>(PATH + '/' + data.id, data);
};

export const remove = async (id: number) => {
  return request.delete<CursoEntity>(PATH + '/' + id);
};
