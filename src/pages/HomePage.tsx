import { useCallback, useEffect, useMemo, useState } from 'react';
import { listByDay } from '../services/agendamento/agendamento';
import useRequest from '../hooks/useRequest';
import { list } from '../services/salas';
import SalaEntity from '../domain/entity/salaEntity';
import { Card } from 'reactstrap';
import AgendamentoDTO from '../domain/entity/AgendamentoDTO';
import DateTimeDisplay from '../components/DateTimeDisplay';

import './homePage.css';

const HomePage = () => {
  const [date, setDate] = useState<Date>(new Date());

  useEffect(() => {
    setInterval(() => {
      setDate(new Date());
    }, 600000);
  }, []);

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
      startTimeDate.getTime() < date.getTime() &&
      date.getTime() < convertStringToDate(endTime).getTime()
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
      <Card
        key={sala.id}
        className={`agendamento_card ${
          agendamentos ? 'bg-danger' : 'bg-success'
        }`}
      >
        <h5 className="mb-0 agendamento_titulo">{sala.nome}</h5>
        <hr className="my-2" />
        {renderAgendamento(agendamentos)}
      </Card>
    );
  };

  return (
    <div className="p-4">
      <DateTimeDisplay />

      <hr />
      <div className="home-list">
        {listSalas.map((sala) => renderSala(sala))}
      </div>
    </div>
  );
};

export default HomePage;
