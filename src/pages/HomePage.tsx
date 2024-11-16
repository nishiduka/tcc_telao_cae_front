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
    }, 1800000);
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

  const checkTimeAfter = (time: string, date: Date) => {
    const timeArray = time.split(':');
    const timeDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      parseInt(timeArray[0]),
      parseInt(timeArray[1])
    );

    return timeDate.getTime() > date.getTime();
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
        <span>Curso: {agendamento?.materia.curso.sigla}</span>
        <span>Matéria: {agendamento?.materia.sigla}</span>
        <span>Professor: {agendamento?.professor.nome}</span>
        <span>Horário início: {agendamento?.horarioInicio}</span>
        <span>Horário fim: {agendamento?.horarioFim}</span>
      </div>
    );
  };

  const renderSala = (sala: SalaEntity) => {
    const agendamentos = handleAgendamentos.data?.find(
      (agendamento) =>
        agendamento.sala.id === sala.id &&
        checkTimeAfter(agendamento.horarioFim, date)
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
      <div className="d-flex gap-2 flex-wrap">
        {listSalas.map((sala) => renderSala(sala))}
      </div>
    </div>
  );
};

export default HomePage;
