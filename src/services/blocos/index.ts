import GenericResponse from '../../domain/dto/request/genericResponse';
import BlocoEntity from '../../domain/entity/blocoEntity';
import { RequestGeneric } from '../api';

const PATH = '/blocos';
const request = new RequestGeneric();

export const list = async (): Promise<GenericResponse<BlocoEntity[]>> => {
  return request.get<BlocoEntity[]>(PATH);
};
