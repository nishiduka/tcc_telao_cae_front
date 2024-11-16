import { useState } from 'react';
import Select from 'react-select';

import Template from '../../components/template';
import { Label, Input, Button, FormGroup, Form } from 'reactstrap';
import useRequest from '../../hooks/useRequest';
import { list as listarProfessor } from '../../services/professores';
import { list as listarMateria } from '../../services/materias';
import { list as listarSala } from '../../services/salas';
import { create } from '../../services/agendamento/agendamentoPontual';
import { useForm } from '../../hooks/useForm';
import { useAlert } from '../../hooks/useAlert';
import ProfessorEntity from '../../domain/entity/professorEntity';
import MateriaEntity from '../../domain/entity/materiaEntity';
import SalaEntity from '../../domain/entity/salaEntity';
import { generateTime } from '../../utils/generateTime';

const Criar = () => {
  const professorRequest = useRequest<ProfessorEntity[]>(listarProfessor, []);
  const materiaRequest = useRequest<MateriaEntity[]>(listarMateria, []);
  const salaRequest = useRequest<SalaEntity[]>(listarSala, []);

  const isLoading =
    professorRequest.loading || materiaRequest.loading || salaRequest.loading;
  const errors =
    professorRequest.error || materiaRequest.error || salaRequest.error;

  const { setAlert } = useAlert();
  const [disable, setDisable] = useState(false);

  const { values, handleChange, validate } = useForm(
    {
      sala: '',
      professor: '',
      materia: '',
      data: '',
      horarioInicio: '',
      horarioFim: '',
    },
    ['sala', 'professor', 'materia', 'data', 'horarioInicio', 'horarioFim']
  );

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
        data: new Date(values.data),
        sala: {
          id: parseInt(values.sala),
          nome: '',
          bloco: {
            id: 0,
            nome: '',
            created_at: undefined,
            updated_at: undefined,
          },
          descricao: '',
          qtdComputadores: 0,
          qtdAlunos: 0,
        },
        professor: {
          id: parseInt(values.professor),
          nome: '',
        },
        materia: {
          id: parseInt(values.materia),
          nome: '',
          sigla: '',
          curso: {
            id: undefined,
            nome: '',
            sigla: '',
            created_at: undefined,
            updated_at: undefined,
          },
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
        message: 'Agendamento criado com sucesso',
      });

      setTimeout(() => {
        window.location.href = '/agendamento-pontual/listagem';
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
    <Template isLoading={isLoading} error={errors}>
      <div className="mt-5 mb-3">
        <h2>Criar Agendamento Pontual</h2>
        <hr />
      </div>
      <Form onSubmit={onsubmit}>
        <FormGroup>
          <Label for="sala">Sala</Label>
          <Select
            options={salaRequest.data.map((sala) => ({
              value: sala.id,
              label: sala.nome,
            }))}
            onChange={(e) =>
              handleChange({
                target: {
                  name: 'sala',
                  value: e?.value?.toString() || '',
                },
              } as unknown as React.ChangeEvent<HTMLInputElement>)
            }
          />
        </FormGroup>

        <FormGroup>
          <Label for="materia">Materia</Label>
          <Select
            options={materiaRequest.data.map((materia) => ({
              value: materia.id,
              label: `${materia.curso.sigla} | ${materia.nome}`,
            }))}
            onChange={(e) =>
              handleChange({
                target: {
                  name: 'materia',
                  value: e?.value?.toString() || '',
                },
              } as unknown as React.ChangeEvent<HTMLInputElement>)
            }
          />
        </FormGroup>

        <FormGroup>
          <Label for="professor">Professor</Label>
          <Select
            options={professorRequest.data.map((professor) => ({
              value: professor.id,
              label: professor.nome,
            }))}
            onChange={(e) =>
              handleChange({
                target: {
                  name: 'professor',
                  value: e?.value?.toString() || '',
                },
              } as unknown as React.ChangeEvent<HTMLInputElement>)
            }
          />
        </FormGroup>

        <FormGroup>
          <Label for="data">Data</Label>
          <Input
            id="data"
            name="data"
            type="date"
            onChange={handleChange}
          ></Input>
        </FormGroup>

        <FormGroup>
          <Label for="horarioInicio">Horário início</Label>
          <Select
            options={generateTime('08:00', '22:00').map((horarioInicio) => ({
              value: horarioInicio,
              label: horarioInicio,
            }))}
            onChange={(e) =>
              handleChange({
                target: {
                  name: 'horarioInicio',
                  value: e?.value?.toString() || '',
                },
              } as unknown as React.ChangeEvent<HTMLInputElement>)
            }
          />
        </FormGroup>

        <FormGroup>
          <Label for="horarioFim">Horário fim</Label>
          <Select
            options={generateTime('08:00', '22:00').map((horarioFim) => ({
              value: horarioFim,
              label: horarioFim,
            }))}
            onChange={(e) =>
              handleChange({
                target: {
                  name: 'horarioFim',
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
