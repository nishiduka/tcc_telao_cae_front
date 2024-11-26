import { useEffect, useState } from 'react';

import Template from '../../components/template';
import { Label, Input, Button, FormGroup, Form } from 'reactstrap';
import useRequest from '../../hooks/useRequest';
import { list } from '../../services/cursos';
import { create } from '../../services/materias';
import { useForm } from '../../hooks/useForm';
import { useAlert } from '../../hooks/useAlert';
import CursoEntity from '../../domain/entity/cursoEntity';
import Select from 'react-select';

const Criar = () => {
  const { data, loading, error } = useRequest<CursoEntity[]>(list, []);
  const { setAlert } = useAlert();
  const [disable, setDisable] = useState(false);

  const { values, handleChange, validate, setValues } = useForm(
    {
      nome: '',
      curso: '',
      sigla: '',
    },
    ['nome', 'curso', 'sigla']
  );

  useEffect(() => {
    if (data.length > 0) {
      setValues({
        nome: '',
        sigla: '',
        curso: data[0]?.id?.toString() || '',
      });
    }
  }, [data, setValues]);

  const onsubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { hasError } = validate();
    setDisable(true);

    if (hasError) {
      alert('Preencha todos os campos');
      setDisable(false);
      return;
    }

    try {
      const response = await create({
        ...values,
        curso: {
          id: parseInt(values.curso),
          nome: '',
          sigla: '',
        },
      });

      if (!response.success) {
        setAlert({
          isOpen: true,
          type: 'danger',
          message: response.message,
        });
        return;
      }

      setAlert({
        isOpen: true,
        type: 'success',
        message: 'Materia criada com sucesso',
      });

      setTimeout(() => {
        window.location.href = '/materias/listagem';
      }, 2500);
    } catch (e: unknown) {
      setAlert({
        isOpen: true,
        type: 'danger',
        message: (e as Error)?.message || '',
      });
      setDisable(false);
    }
  };

  const currentValue = () => {
    const id = values?.curso;

    return {
      value: values?.curso,
      label: data.find((curso) => curso?.id?.toString() === id)?.nome,
    };
  };

  return (
    <Template isLoading={loading} error={error}>
      <div className="mt-5 mb-3">
        <h2>Criar Materias</h2>
        <hr />
      </div>
      <Form onSubmit={onsubmit}>
        <FormGroup>
          <Label for="nome">Nome da Materia</Label>
          <Input
            id="nome"
            name="nome"
            placeholder="Nome da Materia"
            type="text"
            required
            onChange={handleChange}
            value={values.nome}
          />
        </FormGroup>

        <FormGroup>
          <Label for="nome">Sigla</Label>
          <Input
            id="sigla"
            name="sigla"
            placeholder="Sigla da Materia"
            type="text"
            required
            onChange={handleChange}
            value={values.sigla}
          />
        </FormGroup>

        <FormGroup>
          <Label for="curso">Curso</Label>
          <Select
            options={data.map((curso) => ({
              value: curso.id?.toString() || '',
              label: curso.nome,
            }))}
            value={currentValue()}
            onChange={(e) =>
              handleChange({
                target: {
                  name: 'curso',
                  value: e?.value?.toString() || '',
                },
              } as unknown as React.ChangeEvent<HTMLInputElement>)
            }
          />
        </FormGroup>

        <Button disabled={disable} color="success">
          Salvar
        </Button>
      </Form>
    </Template>
  );
};

export default Criar;
