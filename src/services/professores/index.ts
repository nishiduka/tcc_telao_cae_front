import GenericResponse from '../../domain/dto/request/genericResponse';
import ProfessorEntity from '../../domain/entity/professorEntity';
import { RequestGeneric } from '../api';

const PATH = '/professores';
const request = new RequestGeneric();

export const list = async (): Promise<GenericResponse<ProfessorEntity[]>> => {
  return request.get<ProfessorEntity[]>(PATH);
};

export const search = async (
  id: number
): Promise<GenericResponse<ProfessorEntity>> => {
  return request.get<ProfessorEntity>(PATH + '/' + id);
};

export const create = async (
  data: ProfessorEntity
): Promise<GenericResponse<ProfessorEntity>> => {
  return request.post<ProfessorEntity>(PATH, data);
};

export const update = async (
  data: ProfessorEntity
): Promise<GenericResponse<ProfessorEntity>> => {
  return request.put<ProfessorEntity>(PATH + '/' + data.id, data);
};

export const remove = async (id: number) => {
  return request.delete<ProfessorEntity>(PATH + '/' + id);
};
