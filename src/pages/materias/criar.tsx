import { useState } from 'react';

import Template from '../../components/template';
import { Label, Input, Button, FormGroup, Form } from 'reactstrap';
import useRequest from '../../hoooks/useRequest';
import { list } from '../../services/cursos';
import { create } from '../../services/materias';
import { useForm } from '../../hoooks/useForm';
import { useAlert } from '../../hoooks/useAlert';
import CursoEntity from '../../domain/entity/cursoEntity';

const Criar = () => {
  const { data, loading, error } = useRequest<CursoEntity[]>(list, []);
  const { setAlert } = useAlert();
  const [disable, setDisable] = useState(false);

  const { values, handleChange, validate } = useForm(
    {
      nome: '',
      curso: '',
      sigla: '',
    },
    ['nome', 'curso', 'sigla']
  );

  const onsubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { hasError } = validate();
    setDisable(true);

    if (hasError) {
      alert('Preencha todos os campos');
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
        message: 'Sala criada com sucesso',
      });

      setTimeout(() => {
        window.location.href = '/materias/listagem';
      }, 2500);
    } catch (e: unknown) {
      setAlert({
        isOpen: true,
        type: 'danger',
        message: e?.message || '',
      });
      setDisable(false);
    }
  };

  return (
    <Template isLoading={loading} error={error}>
      <div className="mt-5 mb-3">
        <h2>Criar Materias</h2>
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
                selected={values.curso === curso?.id?.toString()}
              >
                {curso.nome}
              </option>
            ))}
          </Input>
        </FormGroup>

        <FormGroup>
          <Label for="nome">Nome da sala</Label>
          <Input
            id="nome"
            name="nome"
            placeholder="Nome da Sala"
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

        <Button disabled={disable} color="success">
          Salvar
        </Button>
      </Form>
    </Template>
  );
};

export default Criar;
