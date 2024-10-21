import { ChangeEvent, useState } from 'react';

export const useForm = <T extends Record<string, unknown>>(
  initialValues: T,
  requiredFields: string[]
) => {
  const [values, setValues] = useState<T>(initialValues);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const rows = [];
    let hasError = false;

    for (const field of requiredFields) {
      if (values[field] == '') {
        rows.push(field);
        hasError = true;
      }
    }

    console.log('erro de validacao::::', rows);

    return { hasError, rows };
  };

  return { values, handleChange, validate, setValues };
};
