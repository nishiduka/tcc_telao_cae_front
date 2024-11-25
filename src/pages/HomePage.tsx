import { useCallback, useMemo, useState } from 'react';
import { listByDay } from '../services/agendamento/agendamento';
import useRequest from '../hooks/useRequest';
import { list } from '../services/salas';
import SalaEntity from '../domain/entity/salaEntity';
import { Input } from 'reactstrap';
import AgendamentoDTO from '../domain/entity/AgendamentoDTO';
import DateTimeDisplay from '../components/DateTimeDisplay';

import './homePage.css';
import Modal from '../components/modal';
import { formatHour, getDayName } from '../utils/date';
import Select from 'react-select';
import { generateTime } from '../utils/generateTime';
import { END_TIME, START_TIME } from '../mocks/hours';

const HomePage = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [modal, setModal] = useState<boolean>(false);
  const [salaId, setSalaId] = useState<string>('');
  const [stopTimer, setStopTimer] = useState<boolean>(false);
  const [modalTimer, setModalTimer] = useState<boolean>(false);

  const [referDate, setReferDate] = useState<{
    date: string;
    hour: string;
  }>({
    date: date.toISOString().split('T')[0],
    hour: date.getHours() + ':' + date.getMinutes(),
  });

  const getDate = useCallback(async () => {
    return await listByDay(date);
  }, [date]);

  const handleAgendamentos = useRequest(getDate, []);
  const handleSalas = useRequest(list, []);

  const listSalas = useMemo(() => {
    if (!handleSalas.data) return [];

    return handleSalas.data.filter((sala) => sala.bloco.id === 1);
  }, [handleSalas.data]);

  const convertStringToDate = (time: string) => {
    const timeArray = time.split(':');
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      parseInt(timeArray[0]),
      parseInt(timeArray[1])
    );
  };

  const checkTimeAfter = (startTime: string, endTime: string, date: Date) => {
    const startTimeDate = convertStringToDate(startTime);

    return (
      startTimeDate.getTime() <= date.getTime() &&
      date.getTime() <= convertStringToDate(endTime).getTime()
    );
  };

  const sliceText = (text: string, length: number) => {
    return text.length > length ? text.slice(0, length) + '...' : text;
  };

  const renderAgendamento = (agendamento: AgendamentoDTO | undefined) => {
    if (!agendamento)
      return (
        <div className="agendamento_block">
          <span>Nenhum agendamento</span>
        </div>
      );

    return (
      <div className="agendamento_block">
        <span>Curso: {sliceText(agendamento?.materia.curso.sigla, 20)}</span>
        <span>Matéria: {sliceText(agendamento?.materia.sigla, 20)}</span>
        <span>Professor: {sliceText(agendamento?.professor.nome, 20)}</span>
        <span>Horário início: {sliceText(agendamento?.horarioInicio, 20)}</span>
        <span>Horário fim: {sliceText(agendamento?.horarioFim, 20)}</span>
      </div>
    );
  };

  const renderSala = (sala: SalaEntity) => {
    const agendamentos = handleAgendamentos.data?.find(
      (agendamento) =>
        agendamento.sala.id === sala.id &&
        checkTimeAfter(agendamento.horarioInicio, agendamento.horarioFim, date)
    );

    return (
      <div
        key={sala.id}
        className={`agendamento_card ${
          agendamentos ? 'bg-danger' : 'bg-success'
        }`}
        onClick={() => {
          if (agendamentos) {
            setSalaId(sala?.id?.toString() || '');
            setModal(true);
          }
        }}
      >
        <h5 className="mb-0 agendamento_titulo">{sala.nome}</h5>
        <hr className="my-2" />
        {renderAgendamento(agendamentos)}
      </div>
    );
  };

  const footerData = () => {
    return (
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => {
          setModalTimer(false);

          console.log(
            'referDate?.date +  + referDate?.hour::::',
            referDate?.date + 'T' + referDate?.hour
          );

          setDate(new Date(referDate?.date + 'T' + referDate?.hour));

          setStopTimer(true);
        }}
      >
        Alterar
      </button>
    );
  };

  return (
    <div className="content">
      <div className="d-flex align-items-center justify-content-between flex-column flex-md-row gap-2">
        <DateTimeDisplay
          date={date}
          stopTimer={stopTimer}
          updateDate={setDate}
        />

        <div className="d-flex gap-2">
          <button
            className="pl-4 btn btn-success"
            onClick={() => {
              setDate(new Date());
              setStopTimer(false);
            }}
          >
            Hoje
          </button>
          <button
            className="pl-4 btn btn-primary"
            onClick={() => setModalTimer(true)}
          >
            Alterar
          </button>
        </div>
      </div>

      <hr />
      <div className="home-list">
        {listSalas.map((sala) => renderSala(sala))}
      </div>

      <Modal
        titulo={
          'Agendamentos ' +
          listSalas.find((item) => item?.id === parseInt(salaId))?.nome
        }
        show={modal}
        setShow={setModal}
      >
        <div>
          <span>{getDayName(date)}</span>
          <hr />

          {handleAgendamentos.data
            ?.filter((item) => item.sala.id === parseInt(salaId))
            ?.sort((a, b) => {
              return a.horarioInicio > b.horarioInicio ? 1 : -1;
            })
            .map((agendamento) => (
              <div key={agendamento.id}>
                <span>
                  {agendamento.materia.curso.sigla} -{' '}
                  {agendamento.materia.sigla}
                </span>
                <span> - {agendamento.professor.nome}</span>
                <span> - {formatHour(agendamento.horarioInicio)}</span>
                <span> - {formatHour(agendamento.horarioFim)}</span>
              </div>
            ))}
        </div>
      </Modal>

      <Modal
        titulo={'Data'}
        show={modalTimer}
        setShow={setModalTimer}
        footer={footerData}
      >
        <div>
          <label htmlFor="">Data</label>
          <Input
            id="data"
            name="data"
            type="date"
            defaultValue={referDate?.date}
            onChange={(e) => {
              setReferDate({
                date: e.target.value,
                hour: referDate?.hour || '',
              });
            }}
          ></Input>
          <br />
          <label htmlFor="">Horário</label>
          <Select
            options={generateTime(START_TIME, END_TIME).map((horaInicio) => ({
              value: horaInicio,
              label: horaInicio,
            }))}
            onChange={(e) =>
              setReferDate({
                date: referDate?.date || '',
                hour: e?.value || '',
              })
            }
            defaultValue={{
              value: referDate?.hour || '',
              label: referDate?.hour || '',
            }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default HomePage;
