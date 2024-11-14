import { useCallback, useEffect, useState } from 'react';
import { Label, Input, Button, FormGroup, Form } from 'reactstrap';
import { useParams } from 'react-router-dom';

import Template from '../../components/template';
import { useForm } from '../../hooks/useForm';
import { useAlert } from '../../hooks/useAlert';
import useRequest from '../../hooks/useRequest';
import { update, search } from '../../services/professores';
import ProfessorEntity from '../../domain/entity/professorEntity';

const Atualizar = () => {
  const params = useParams();
  const id = parseInt(params.id || '');

  const getInfo = useCallback(async () => {
    const response = await search(id);
    return response;
  }, [id]);

  const infos = useRequest<ProfessorEntity>(getInfo, {
    nome: '',
  });

  const { setAlert } = useAlert();
  const [disable, setDisable] = useState(false);
  const { values, handleChange, validate, setValues } = useForm(
    {
      nome: infos.data.nome,
    },
    ['nome']
  );

  useEffect(() => {
    setValues({
      nome: infos.data.nome,
    });
  }, [infos.data, setValues]);

  const onsubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { hasError } = validate();
    setDisable(true);

    if (hasError) {
      alert('Preencha todos os campos');
      return;
    }
    console.log('values::::', values);

    try {
      const response = await update({
        id: id,
        ...values,
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
        message: 'Professor atualizada com sucesso',
      });

      setTimeout(() => {
        window.location.href = '/professores/listagem';
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
    <Template isLoading={infos.loading} error={infos.error}>
      <div className="mt-5 mb-3">
        <h2>Atualizar sala</h2>
        <hr />
      </div>
      <Form onSubmit={onsubmit}>
        <FormGroup>
          <Label for="nome">Professor</Label>
          <Input
            id="nome"
            name="nome"
            placeholder="Professor"
            type="text"
            required
            onChange={handleChange}
            value={values.nome}
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
