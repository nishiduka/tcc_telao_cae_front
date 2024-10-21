import { useState } from 'react';

import Template from '../../components/template';
import { Label, Input, Button, FormGroup, Form } from 'reactstrap';
import useRequest from '../../hooks/useRequest';
import BlocoEntity from '../../domain/entity/blocoEntity';
import { list } from '../../services/blocos';
import { create } from '../../services/salas';
import { useForm } from '../../hooks/useForm';
import { useAlert } from '../../hooks/useAlert';

const Criar = () => {
  const { data, loading, error } = useRequest<BlocoEntity[]>(list, []);
  const { setAlert } = useAlert();
  const [disable, setDisable] = useState(false);

  const { values, handleChange, validate } = useForm(
    {
      nome: '',
      bloco: '1',
      descricao: '',
      qtdComputadores: '0',
      qtdAlunos: '0',
    },
    ['nome', 'bloco', 'descricao', 'qtdComputadores', 'qtdAlunos']
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
        bloco: {
          id: parseInt(values.bloco),
          nome: '',
        },
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
        message: 'Sala criada com sucesso',
      });

      setTimeout(() => {
        window.location.href = '/salas/listagem';
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
        <h2>Criar sala</h2>
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
                selected={values.bloco === bloco.id.toString()}
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

export default Criar;
