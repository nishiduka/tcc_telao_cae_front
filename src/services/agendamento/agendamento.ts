import GenericResponse from '../../domain/dto/request/genericResponse';
import AgendamentoRecorrenteEntity from '../../domain/entity/agendamentoRecorrenteEntity';
import { RequestGeneric } from '../api';

const PATH = '/agendamentos';
const request = new RequestGeneric();

export const listByWeek = async (
  week: number
): Promise<GenericResponse<AgendamentoRecorrenteEntity[]>> => {
  return request.get<AgendamentoRecorrenteEntity[]>(PATH + '/' + week);
};

export const listByWeekAndRoom = async (
  room: number,
  week: number
): Promise<GenericResponse<AgendamentoRecorrenteEntity[]>> => {
  return request.get<AgendamentoRecorrenteEntity[]>(
    PATH + '/' + room + '/' + week
  );
};
