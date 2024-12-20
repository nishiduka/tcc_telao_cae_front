import { useCallback, useEffect, useState } from 'react';
import { Label, Input, Button, FormGroup, Form } from 'reactstrap';
import { useParams } from 'react-router-dom';

import Template from '../../components/template';
import { useForm } from '../../hooks/useForm';
import { useAlert } from '../../hooks/useAlert';
import useRequest from '../../hooks/useRequest';
import { list } from '../../services/cursos';
import { update, search } from '../../services/materias';
import CursoEntity from '../../domain/entity/cursoEntity';
import MateriaEntity from '../../domain/entity/materiaEntity';
import Select from 'react-select';

const Atualizar = () => {
  const params = useParams();
  const id = parseInt(params.id || '');

  const { data, loading, error } = useRequest<CursoEntity[]>(list, []);

  const getInfo = useCallback(async () => {
    const response = await search(id);
    return response;
  }, [id]);
  const materiaInfo = useRequest<MateriaEntity>(getInfo, {
    nome: '',
    sigla: '',
    curso: {
      id: 0,
      nome: '',
      sigla: '',
    },
  });

  const { setAlert } = useAlert();
  const [disable, setDisable] = useState(false);
  const { values, handleChange, validate, setValues } = useForm(
    {
      nome: materiaInfo.data.nome,
      curso: materiaInfo.data.curso.id,
      sigla: materiaInfo.data.sigla,
    },
    ['nome', 'curso', 'sigla']
  );

  useEffect(() => {
    setValues({
      nome: materiaInfo.data.nome,
      curso: materiaInfo.data.curso.id,
      sigla: materiaInfo.data.sigla,
    });
  }, [materiaInfo.data, setValues]);

  const onsubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { hasError } = validate();
    setDisable(true);

    if (hasError) {
      alert('Preencha todos os campos');
      setDisable(false);
      return;
    }

    console.log('values::::', values);

    try {
      const response = await update({
        id: id,
        ...values,
        curso: {
          id: values?.curso,
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
        message: 'Materia atualizada com sucesso',
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
    let id = values?.curso;

    if (typeof id === 'string') {
      id = parseInt(id);
    }

    return {
      value: values?.curso,
      label: data.find((curso) => curso.id === id)?.nome,
    };
  };

  return (
    <Template
      isLoading={loading || materiaInfo.loading}
      error={error || materiaInfo.error}
    >
      <div className="mt-5 mb-3">
        <h2>Atualizar Materia</h2>
        <hr />
      </div>
      <Form onSubmit={onsubmit}>
        <FormGroup>
          <Label for="nome">Nome da Matéria</Label>
          <Input
            id="nome"
            name="nome"
            placeholder="Nome da Matéria"
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
            placeholder="sigla da Materia"
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
              value: curso.id,
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

export default Atualizar;
