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
      return;
    }

    try {
      const response = await update({
        id: id,
        ...values,
        curso: {
          id: values.curso,
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
        message: 'Sala atualizada com sucesso',
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

  return (
    <Template
      isLoading={loading || materiaInfo.loading}
      error={error || materiaInfo.error}
    >
      <div className="mt-5 mb-3">
        <h2>Atualizar sala</h2>
        <hr />
      </div>
      <Form onSubmit={onsubmit}>
        <FormGroup>
          <Label for="curso">Curso</Label>
          <Input id="curso" name="curso" type="select" onChange={handleChange}>
            {data.map((curso) => (
              <option
                key={curso.id}
                value={curso.id}
                selected={values.curso === curso.id}
              >
                {curso.nome}
              </option>
            ))}
          </Input>
        </FormGroup>

        <FormGroup>
          <Label for="nome">Nome do Curso</Label>
          <Input
            id="nome"
            name="nome"
            placeholder="Nome do curso"
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
            placeholder="sigla da Sala"
            type="text"
            required
            onChange={handleChange}
            value={values.sigla}
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
