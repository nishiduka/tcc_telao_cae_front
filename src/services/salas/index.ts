import GenericResponse from '../../domain/dto/request/genericResponse';
import SalaEntity from '../../domain/entity/salaEntity';
import { RequestGeneric } from '../api';

const PATH = '/salas';
const request = new RequestGeneric();

export const list = async (): Promise<GenericResponse<SalaEntity[]>> => {
  return request.get<SalaEntity[]>(PATH);
};

export const search = async (
  id: number
): Promise<GenericResponse<SalaEntity>> => {
  return request.get<SalaEntity>(PATH + '/' + id);
};

export const create = async (
  data: SalaEntity
): Promise<GenericResponse<SalaEntity>> => {
  return request.post<SalaEntity>(PATH + '/', data);
};

export const update = async (
  data: SalaEntity
): Promise<GenericResponse<SalaEntity>> => {
  return request.put<SalaEntity>(PATH + '/' + data.id, data);
};

export const remove = async (id: number) => {
  return request.delete<SalaEntity>(PATH + '/' + id);
};
