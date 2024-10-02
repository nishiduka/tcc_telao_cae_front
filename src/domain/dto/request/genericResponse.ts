type GenericResponse<T> = {
  success: boolean;
  content: T;
  message: string;
};

export default GenericResponse;
