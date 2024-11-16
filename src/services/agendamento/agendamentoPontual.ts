import GenericResponse from '../../domain/dto/request/genericResponse';
import AgendamentoPontualEntity from '../../domain/entity/agendamentoPontualEntity';
import { RequestGeneric } from '../api';

const PATH = '/agendamentos-pontuais';
const request = new RequestGeneric();

export const list = async (): Promise<
  GenericResponse<AgendamentoPontualEntity[]>
> => {
  return request.get<AgendamentoPontualEntity[]>(PATH);
};

export const search = async (
  id: number
): Promise<GenericResponse<AgendamentoPontualEntity>> => {
  return request.get<AgendamentoPontualEntity>(PATH + '/' + id);
};

export const create = async (
  data: AgendamentoPontualEntity
): Promise<GenericResponse<AgendamentoPontualEntity>> => {
  return request.post<AgendamentoPontualEntity>(PATH, data);
};

export const update = async (
  data: AgendamentoPontualEntity
): Promise<GenericResponse<AgendamentoPontualEntity>> => {
  return request.put<AgendamentoPontualEntity>(PATH + '/' + data.id, data);
};

export const remove = async (id: number) => {
  return request.delete<AgendamentoPontualEntity>(PATH + '/' + id);
};
