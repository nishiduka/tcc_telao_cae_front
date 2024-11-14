import { useCallback, useEffect, useState } from 'react';
import { Label, Input, Button, FormGroup, Form } from 'reactstrap';
import { useParams } from 'react-router-dom';

import Template from '../../components/template';
import { useForm } from '../../hooks/useForm';
import { useAlert } from '../../hooks/useAlert';
import useRequest from '../../hooks/useRequest';
import BlocoEntity from '../../domain/entity/blocoEntity';
import SalaEntity from '../../domain/entity/salaEntity';
import { list } from '../../services/blocos';
import { update, search } from '../../services/salas';

const Atualizar = () => {
  const params = useParams();
  const id = parseInt(params.id || '');

  const { data, loading, error } = useRequest<BlocoEntity[]>(list, []);

  const getInfo = useCallback(async () => {
    const response = await search(id);
    return response;
  }, [id]);

  const salaInfo = useRequest<SalaEntity>(getInfo, {
    nome: '',
    bloco: {
      id: 0,
      nome: '',
    },
    descricao: '',
    qtdComputadores: 0,
    qtdAlunos: 0,
  });

  const { setAlert } = useAlert();
  const [disable, setDisable] = useState(false);
  const { values, handleChange, validate, setValues } = useForm(
    {
      nome: salaInfo.data.nome,
      bloco: salaInfo.data.bloco.id,
      descricao: salaInfo.data.descricao,
      qtdComputadores: salaInfo.data.qtdComputadores.toString(),
      qtdAlunos: salaInfo.data.qtdAlunos.toString(),
    },
    ['nome', 'bloco', 'descricao', 'qtdComputadores', 'qtdAlunos']
  );

  useEffect(() => {
    setValues({
      nome: salaInfo.data.nome,
      bloco: salaInfo.data.bloco.id,
      descricao: salaInfo.data.descricao,
      qtdComputadores: salaInfo.data.qtdComputadores.toString(),
      qtdAlunos: salaInfo.data.qtdAlunos.toString(),
    });
  }, [salaInfo.data, setValues]);

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
        bloco: { id: values.bloco, nome: '' },
        qtdAlunos: parseInt(values.qtdAlunos),
        qtdComputadores: parseInt(values.qtdComputadores),
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
        window.location.href = '/salas/listagem';
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
      isLoading={loading || salaInfo.loading}
      error={error || salaInfo.error}
    >
      <div className="mt-5 mb-3">
        <h2>Atualizar sala</h2>
        <hr />
      </div>
      <Form onSubmit={onsubmit}>
        <FormGroup>
          <Label for="bloco">Bloco</Label>
          <Input id="bloco" name="bloco" type="select" onChange={handleChange}>
            {data.map((bloco) => (
              <option
                key={bloco.id}
                value={bloco.id}
                selected={values.bloco === bloco.id}
              >
                {bloco.nome}
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
          <Label for="nome">Descrição</Label>
          <Input
            id="descricao"
            name="descricao"
            placeholder="Descricao da Sala"
            type="text"
            required
            onChange={handleChange}
            value={values.descricao}
          />
        </FormGroup>

        <FormGroup>
          <Label for="nome">Quantidade de alunos</Label>
          <Input
            id="qtdAlunos"
            name="qtdAlunos"
            placeholder="Quantidade de alunos"
            type="text"
            required
            onChange={handleChange}
            value={values.qtdAlunos}
          />
        </FormGroup>

        <FormGroup>
          <Label for="nome">Quantidade de computadores</Label>
          <Input
            id="qtdComputadores"
            name="qtdComputadores"
            placeholder="Quantidade de computadores"
            type="text"
            required
            onChange={handleChange}
            value={values.qtdComputadores}
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
