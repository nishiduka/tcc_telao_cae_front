import { useState } from 'react';
import { Label, Input, Button, FormGroup, Form } from 'reactstrap';

import Template from '../../components/template';

import { useForm } from '../../hooks/useForm';
import { useAlert } from '../../hooks/useAlert';
import { create } from '../../services/cursos';

const Criar = () => {
  const { setAlert } = useAlert();
  const [disable, setDisable] = useState(false);

  const { values, handleChange, validate } = useForm(
    {
      nome: '',
      sigla: '',
    },
    ['nome', 'sigla']
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
      const response = await create(values);

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
        message: 'curso criado com sucesso',
      });

      setTimeout(() => {
        window.location.href = '/cursos/listagem';
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
    <Template>
      <div className="mt-5 mb-3">
        <h2>Criar Curso</h2>
        <hr />
      </div>
      <Form onSubmit={onsubmit}>
        <FormGroup>
          <Label for="nome">Nome do curso</Label>
          <Input
            id="nome"
            name="nome"
            placeholder="Nome da curso"
            type="text"
            required
            onChange={handleChange}
            value={values.nome}
          />
        </FormGroup>

        <FormGroup>
          <Label for="nome">Sigla do curso</Label>
          <Input
            id="sigla"
            name="sigla"
            placeholder="Sigla do curso"
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
