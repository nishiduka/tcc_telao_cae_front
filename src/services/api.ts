import axios from 'axios';
import GenericResponse from '../domain/dto/request/genericResponse';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export class RequestGeneric {
  private genericError: string =
    'Erro ao realizar a operação. Tente novamente.';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private handleError(error: any): string {
    let message = this.genericError;

    if (typeof error === 'string') {
      message = error;
    }

    if (error?.response?.data?.message !== null) {
      message = error?.response?.data?.message;
    }

    return message;
  }

  async get<T>(path: string): Promise<GenericResponse<T>> {
    try {
      const response = await api.get<GenericResponse<T>>(path);

      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      const message = this.handleError(error);
      console.error(`get ${path} error::: ${error}`);
      throw new Error(message);
    }
  }

  async post<T>(path: string, data: unknown): Promise<GenericResponse<T>> {
    try {
      const response = await api.post<GenericResponse<T>>(path, data);

      if (response.status === 200 && response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: string | unknown) {
      const message = this.handleError(error);
      console.error(`post ${path} error::: ${error}`);
      throw new Error(message);
    }
  }

  async put<T>(path: string, data: unknown): Promise<GenericResponse<T>> {
    try {
      const response = await api.put<GenericResponse<T>>(path, data);

      if (response.status === 200 && response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: string | unknown) {
      const message = this.handleError(error);
      console.error(`put ${path} error::: ${error}`);
      throw new Error(message);
    }
  }

  async delete<T>(path: string): Promise<GenericResponse<T>> {
    try {
      const response = await api.delete<GenericResponse<T>>(path);

      if (response.status === 200 && response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      const message = this.handleError(error);
      console.error(`delete ${path} error::: ${error}`);
      throw new Error(message);
    }
  }
}

export default api;
