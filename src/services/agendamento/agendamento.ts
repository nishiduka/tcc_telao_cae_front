import GenericResponse from '../../domain/dto/request/genericResponse';
import AgendamentoDTO from '../../domain/entity/AgendamentoDTO';
import { RequestGeneric } from '../api';

const PATH = '/agendamentos';
const request = new RequestGeneric();

export const listByWeek = async (
  week: number
): Promise<GenericResponse<AgendamentoDTO[]>> => {
  return request.get<AgendamentoDTO[]>(PATH + '/semana/' + week);
};

export const listByWeekAndRoom = async (
  room: number,
  week: number
): Promise<GenericResponse<AgendamentoDTO[]>> => {
  return request.get<AgendamentoDTO[]>(PATH + '/' + room + '/' + week);
};

export const listByDay = async (
  day: Date
): Promise<GenericResponse<AgendamentoDTO[]>> => {
  return request.get<AgendamentoDTO[]>(
    PATH +
      `/dia?data=${day.getFullYear()}-${day.getMonth() + 1}-${day.getDate()}`
  );
};
