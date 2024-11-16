// import Table from '../../components/table';
import Template from '../../components/template';
import SalaEntity from '../../domain/entity/salaEntity';
import { list } from '../../services/salas';
import useRequest from '../../hooks/useRequest';
import { FormGroup, Input, Label } from 'reactstrap';
import { useForm } from '../../hooks/useForm';
import Select from 'react-select';
import AgendamentoDTO from '../../domain/entity/AgendamentoDTO';
import { listByWeekAndRoom } from '../../services/agendamento/agendamento';
import { useCallback, useEffect, useState } from 'react';
import GenericResponse from '../../domain/dto/request/genericResponse';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core/index.js';

const Listagem = () => {
  const { data, loading, error } = useRequest<SalaEntity[]>(list, []);
  const [events, setEvents] = useState<any[]>([]);

  // const dataAgendamento = useRequest<AgendamentoDTO[]>(
  //   listByWeekAndRoom,
  //   []
  // );

  // const { setAlert } = useAlert();
  const { values, handleChange, validate } = useForm(
    {
      sala: '',
      data: '',
    },
    ['sala', 'data']
  );
  const requestAgendamentos = useCallback((): Promise<
    GenericResponse<AgendamentoDTO[]>
  > => {
    if (!values.data || !values.sala) {
      return Promise.reject(new Error('Data or Sala is missing'));
    }

    const date = getWeekNumber(new Date(values.data));

    return listByWeekAndRoom(parseInt(values.sala), date);
  }, [values]);

  const getWeekNumber = (date: Date) => {
    const currentDate = new Date(date.getTime());

    currentDate.setHours(0, 0, 0, 0);
    currentDate.setDate(
      currentDate.getDate() + 3 - ((currentDate.getDay() + 6) % 7)
    );

    const firstThursday = new Date(currentDate.getFullYear(), 0, 4);
    firstThursday.setDate(
      firstThursday.getDate() + 3 - ((firstThursday.getDay() + 6) % 7)
    );

    const weekNumber =
      1 +
      Math.round(
        (currentDate.getTime() - firstThursday.getTime()) /
          (7 * 24 * 60 * 60 * 1000)
      );

    return weekNumber;
  };

  const agendamentos = useRequest<AgendamentoDTO[]>(requestAgendamentos, []);

  const getDayOfWeek = (diaSemana: string) => {
    const dias = [
      'DOMINGO',
      'SEGUNDA',
      'TERCA',
      'QUARTA',
      'QUINTA',
      'SEXTA',
      'SABADO',
    ];
    return dias.indexOf(diaSemana);
  };

  // Função para transformar o payload em eventos para o FullCalendar
  const transformPayloadToEvents = useCallback(
    (content: AgendamentoDTO[]) => {
      return content.map((item) => {
        const startTime = item.horarioInicio;
        const endTime = item.horarioFim;

        const today = new Date(values.data);
        const targetDay = getDayOfWeek(item.diaSemana);

        const eventDate = new Date(today);
        eventDate.setDate(today.getDate() + targetDay);

        // Define a data e horário de início e fim
        const startDateTime = new Date(eventDate);
        startDateTime.setHours(
          parseInt(startTime.split(':')[0]),
          parseInt(startTime.split(':')[1])
        );

        const endDateTime = new Date(eventDate);
        endDateTime.setHours(
          parseInt(endTime.split(':')[0]),
          parseInt(endTime.split(':')[1])
        );

        return {
          id: item.id,
          title: `${item.materia.nome} - ${item.professor.nome}`,
          start: startDateTime,
          end: endDateTime,
          extendedProps: {
            sala: item.sala.nome,
            tipo: item.tipo,
            professor: item.professor.nome,
            curso: item.materia.curso.sigla,
          },
        };
      });
    },
    [values.data]
  );

  const renderEventContent = (eventInfo: any) => {
    const { professor, tipo } = eventInfo.event.extendedProps;

    return (
      <div className={`custom-event`}>
        <strong>{eventInfo.timeText}</strong> <br />
        <span>Prof: {professor}</span> <br />
        <p>{tipo}</p>
      </div>
    );
  };

  const handleDatesSet = (dateInfo: any) => {
    handleChange({
      target: {
        name: 'data',
        value: dateInfo?.start?.toString() || '',
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>);
  };

  useEffect(() => {
    if (agendamentos.data) {
      const events = transformPayloadToEvents(agendamentos.data);
      setEvents(events);
    }
  }, [agendamentos.data, transformPayloadToEvents]);

  const handleEventClick = (clickInfo: EventClickArg) => {
    if (clickInfo.event.extendedProps.tipo === 'PONTUAL') {
      window.location.href = `/agendamento-pontual/${clickInfo.event.id}`;
      return;
    }

    window.location.href = `/agendamento-recorrente/${clickInfo.event.id}`;
  };

  return (
    <Template isLoading={loading} error={error}>
      <div className="mt-5 mb-3">
        <h2>Agendamentos</h2>
        <hr />
      </div>

      <div>
        <h5>Filtros</h5>
        <div className="d-flex align-items-end gap-2 z-3 position-relative">
          <FormGroup>
            <Label for="sala">Sala</Label>
            <Select
              options={data.map((sala) => ({
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
        </div>

        <div>
          {!agendamentos.loading ? (
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              events={events}
              locale="pt-br"
              headerToolbar={{
                left: 'prev,next',
                center: 'title',
                right: '',
                // right: 'dayGridMonth,timeGridWeek,timeGridDay',
              }}
              slotMinTime="05:00:00"
              slotMaxTime="24:00:00"
              datesSet={handleDatesSet}
              eventContent={renderEventContent}
              eventClick={handleEventClick}
            />
          ) : (
            <></>
          )}
        </div>
      </div>
    </Template>
  );
};

export default Listagem;
