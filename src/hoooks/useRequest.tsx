import { useCallback, useEffect, useState } from 'react';
import GenericResponse from '../domain/dto/request/genericResponse';
import { useAlert } from './useAlert';

const useRequest = <T,>(
  request: () => Promise<GenericResponse<T>>,
  defaultValue: T
) => {
  const [data, setData] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error>();

  const { setAlert } = useAlert();

  const fetchData = useCallback(async () => {
    try {
      const response = await request();
      setData(response.content);
    } catch (error: unknown) {
      setError(error as Error);
      setAlert({ isOpen: true, message: error.message, type: 'danger' });
    } finally {
      setLoading(false);
    }
  }, [request, setAlert]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, fetchData };
};

export default useRequest;
