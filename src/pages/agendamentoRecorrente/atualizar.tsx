import { useCallback, useEffect, useState } from 'react';
import Select from 'react-select';

import Template from '../../components/template';
import { Label, Button, FormGroup, Form } from 'reactstrap';
import useRequest from '../../hooks/useRequest';
import { list as listarProfessor } from '../../services/professores';
import { list as listarMateria } from '../../services/materias';
import { list as listarSala } from '../../services/salas';
import {
  update,
  search,
  remove,
} from '../../services/agendamento/agendamentoRecorrente';
import { useForm } from '../../hooks/useForm';
import { useAlert } from '../../hooks/useAlert';
import ProfessorEntity from '../../domain/entity/professorEntity';
import MateriaEntity from '../../domain/entity/materiaEntity';
import SalaEntity from '../../domain/entity/salaEntity';
import { EDiaSemana } from '../../domain/entity/eDiaSemana';
import { generateTime } from '../../utils/generateTime';
import { useParams } from 'react-router-dom';
import AgendamentoRecorrenteEntity from '../../domain/entity/agendamentoRecorrenteEntity';

const Atualizar = () => {
  const params = useParams();
  const id = parseInt(params.id || '');

  const getInfo = useCallback(async () => {
    const response = await search(id);
    return response;
  }, [id]);

  const agendametoRequest = useRequest<AgendamentoRecorrenteEntity>(getInfo, {
    diaSemana: EDiaSemana.DOMINGO,
    horaInicio: '08:00',
    horaFim: '10:00',
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
      sala: agendametoRequest?.data?.sala?.id?.toString(),
      professor: agendametoRequest?.data?.professor?.id?.toString(),
      materia: agendametoRequest?.data?.materia?.id?.toString(),
      diaSemana: agendametoRequest?.data?.diaSemana?.toString(),
      horaInicio: agendametoRequest?.data?.horaInicio?.toString(),
      horaFim: agendametoRequest?.data?.horaFim?.toString(),
    },
    ['sala', 'professor', 'materia', 'diaSemana', 'horaInicio', 'horaFim']
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
      const response = await update({
        ...values,
        id,
        diaSemana: values.diaSemana as EDiaSemana,
        sala: {
          id: parseInt(values.sala || '0'),
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
          id: parseInt(values.materia || '0'),
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

  useEffect(() => {
    updateField({
      sala: agendametoRequest.data.sala.id.toString(),
      professor: agendametoRequest.data.professor.id.toString(),
      materia: agendametoRequest.data.materia.id.toString(),
      diaSemana: agendametoRequest.data.diaSemana,
      horaInicio: agendametoRequest?.data?.horaInicio?.toString(),
      horaFim: agendametoRequest?.data?.horaFim?.toString(),
    });
  }, [agendametoRequest.data]);

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

  const diaSemanaSelect = () => {
    if (agendametoRequest.data.diaSemana) {
      return Object.entries(EDiaSemana)
        .filter(([key]) => key === agendametoRequest.data.diaSemana)
        .map(([key, value]) => ({
          value: key,
          label: value,
        }))[0];
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
          <Label for="diaSemana">Dia da Semana</Label>
          <Select
            defaultValue={diaSemanaSelect()}
            options={Object.entries(EDiaSemana).map(([key, value]) => ({
              value: key,
              label: value,
            }))}
            onChange={(e) =>
              handleChange({
                target: {
                  name: 'diaSemana',
                  value: e?.value?.toString() || '',
                },
              } as unknown as React.ChangeEvent<HTMLInputElement>)
            }
          />
        </FormGroup>

        <FormGroup>
          <Label for="horaInicio">Horário início</Label>
          <Select
            value={{
              value: agendametoRequest.data.horaInicio,
              label: agendametoRequest.data.horaInicio,
            }}
            options={generateTime('08:00', '22:00').map((horaInicio) => ({
              value: horaInicio,
              label: horaInicio,
            }))}
            onChange={(e) =>
              handleChange({
                target: {
                  name: 'horaInicio',
                  value: e?.value?.toString() || '',
                },
              } as unknown as React.ChangeEvent<HTMLInputElement>)
            }
          />
        </FormGroup>

        <FormGroup>
          <Label for="horaFim">Horário fim</Label>
          <Select
            value={{
              value: agendametoRequest.data.horaFim,
              label: agendametoRequest.data.horaFim,
            }}
            options={generateTime('08:00', '22:00').map((horaFim) => ({
              value: horaFim,
              label: horaFim,
            }))}
            onChange={(e) =>
              handleChange({
                target: {
                  name: 'horaFim',
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
