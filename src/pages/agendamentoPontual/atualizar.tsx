import { useCallback, useEffect, useState } from 'react';
import Select from 'react-select';

import Template from '../../components/template';
import { Label, Input, Button, FormGroup, Form } from 'reactstrap';
import useRequest from '../../hooks/useRequest';
import { list as listarProfessor } from '../../services/professores';
import { list as listarMateria } from '../../services/materias';
import { list as listarSala } from '../../services/salas';
import {
  update,
  search,
  remove,
} from '../../services/agendamento/agendamentoPontual';
import { useForm } from '../../hooks/useForm';
import { useAlert } from '../../hooks/useAlert';
import ProfessorEntity from '../../domain/entity/professorEntity';
import MateriaEntity from '../../domain/entity/materiaEntity';
import SalaEntity from '../../domain/entity/salaEntity';
import { generateTime } from '../../utils/generateTime';
import { useParams } from 'react-router-dom';
import AgendamentoPontualEntity from '../../domain/entity/agendamentoPontualEntity';
import { END_TIME, START_TIME } from '../../mocks/hours';

const defaultRequest = Object.freeze({
  data: new Date(),
  horarioInicio: '08:00',
  horarioFim: '10:00',
  professor: {
    id: 0,
    nome: '',
  },
  materia: {
    id: 0,
    nome: '',
    sigla: '',
    curso: {
      id: 0,
      nome: '',
      sigla: '',
      created_at: undefined,
      updated_at: undefined,
    },
  },
  sala: {
    id: 0,
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
});

const Atualizar = () => {
  const params = useParams();
  const id = parseInt(params.id || '');

  const getInfo = useCallback(async () => {
    const response = await search(id);
    return response;
  }, [id]);

  const agendametoRequest = useRequest<AgendamentoPontualEntity>(
    getInfo,
    defaultRequest
  );

  const professorRequest = useRequest<ProfessorEntity[]>(listarProfessor, []);
  const materiaRequest = useRequest<MateriaEntity[]>(listarMateria, []);
  const salaRequest = useRequest<SalaEntity[]>(listarSala, []);

  const isLoading =
    professorRequest.loading ||
    materiaRequest.loading ||
    salaRequest.loading ||
    agendametoRequest.loading;

  const errors =
    professorRequest.error ||
    materiaRequest.error ||
    salaRequest.error ||
    agendametoRequest.error;

  const { setAlert } = useAlert();
  const [disable, setDisable] = useState(false);

  const { values, handleChange, validate, updateField } = useForm(
    {
      sala: agendametoRequest.data.sala.id.toString(),
      professor: agendametoRequest.data.professor.id.toString(),
      materia: agendametoRequest.data.materia.id.toString(),
      data: new Date(agendametoRequest.data.data)?.toISOString().split('T')[0],
      horarioInicio: agendametoRequest?.data?.horarioInicio?.toString(),
      horarioFim: agendametoRequest?.data?.horarioFim?.toString(),
    },
    ['sala', 'professor', 'materia', 'diaSemana', 'horarioInicio', 'horarioFim']
  );

  useEffect(() => {
    updateField({
      sala: agendametoRequest.data.sala.id.toString(),
      professor: agendametoRequest.data.professor.id.toString(),
      materia: agendametoRequest.data.materia.id.toString(),
      data: new Date(agendametoRequest.data.data)?.toISOString().split('T')[0],
      horarioInicio: agendametoRequest?.data?.horarioInicio?.toString(),
      horarioFim: agendametoRequest?.data?.horarioFim?.toString(),
    });
  }, [agendametoRequest.data]);

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
      const response = await update({
        ...values,
        id,
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
        window.location.href = '/agendamentos';
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

  const salaSelect = () => {
    if (salaRequest.data) {
      const value = salaRequest.data.find(
        (sala) => sala.id === agendametoRequest.data.sala.id
      );
      return {
        value: value?.id,
        label: value?.nome,
      };
    }
    return null;
  };

  const materiaSelect = () => {
    if (materiaRequest.data) {
      const value = materiaRequest.data.find(
        (materia) => materia.id === agendametoRequest.data.materia.id
      );
      return {
        value: value?.id,
        label: value?.nome,
      };
    }
    return null;
  };

  const professorSelect = () => {
    if (professorRequest.data) {
      const value = professorRequest.data.find(
        (professor) => professor.id === agendametoRequest.data.professor.id
      );
      return {
        value: value?.id,
        label: value?.nome,
      };
    }
    return null;
  };

  return (
    <Template isLoading={isLoading} error={errors}>
      <div className="mt-5 mb-3">
        <h2>Atualizar Agendamento Recorrente</h2>
        <hr />
      </div>
      <Form onSubmit={onsubmit}>
        <FormGroup>
          <Label for="sala">Sala</Label>
          <Select
            defaultValue={salaSelect()}
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
            defaultValue={materiaSelect()}
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
            defaultValue={professorSelect()}
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
            defaultValue={values.data}
          ></Input>
        </FormGroup>
        <FormGroup>
          <Label for="horarioInicio">Horário início</Label>
          <Select
            defaultValue={{
              value: agendametoRequest.data.horarioInicio,
              label: agendametoRequest.data.horarioInicio,
            }}
            options={generateTime(START_TIME, END_TIME).map(
              (horarioInicio) => ({
                value: horarioInicio,
                label: horarioInicio,
              })
            )}
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
            defaultValue={{
              value: agendametoRequest.data.horarioFim,
              label: agendametoRequest.data.horarioFim,
            }}
            options={generateTime(START_TIME, END_TIME).map((horarioFim) => ({
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

        <Button
          type="button"
          color="danger"
          onClick={async () => {
            await remove(id);
            window.location.href = '/agendamentos';
          }}
        >
          Apagar
        </Button>
      </Form>
    </Template>
  );
};

export default Atualizar;
