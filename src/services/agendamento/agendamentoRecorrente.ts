import GenericResponse from '../../domain/dto/request/genericResponse';
import AgendamentoRecorrenteEntity from '../../domain/entity/agendamentoRecorrenteEntity';
import { RequestGeneric } from '../api';

const PATH = '/agendamentos-recorrentes';
const request = new RequestGeneric();

export const list = async (): Promise<
  GenericResponse<AgendamentoRecorrenteEntity[]>
> => {
  return request.get<AgendamentoRecorrenteEntity[]>(PATH);
};

export const search = async (
  id: number
): Promise<GenericResponse<AgendamentoRecorrenteEntity>> => {
  return request.get<AgendamentoRecorrenteEntity>(PATH + '/' + id);
};

export const create = async (
  data: AgendamentoRecorrenteEntity
): Promise<GenericResponse<AgendamentoRecorrenteEntity>> => {
  return request.post<AgendamentoRecorrenteEntity>(PATH, data);
};

export const update = async (
  data: AgendamentoRecorrenteEntity
): Promise<GenericResponse<AgendamentoRecorrenteEntity>> => {
  return request.put<AgendamentoRecorrenteEntity>(PATH + '/' + data.id, data);
};

export const remove = async (id: number) => {
  return request.delete<AgendamentoRecorrenteEntity>(PATH + '/' + id);
};
