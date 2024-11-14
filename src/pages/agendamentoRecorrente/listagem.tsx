// import Table from '../../components/table';
import Template from '../../components/template';
import SalaEntity from '../../domain/entity/salaEntity';
import { list } from '../../services/salas';
import useRequest from '../../hooks/useRequest';
// import { useAlert } from '../../hooks/useAlert';
import { FormGroup, Label } from 'reactstrap';
import { useForm } from '../../hooks/useForm';
import Select from 'react-select';
// import AgendamentoDTO from '../../domain/entity/AgendamentoDTO';
// import { listByWeekAndRoom } from '../../services/agendamento/agendamento';

const Listagem = () => {
  const { data, loading, error, fetchData } = useRequest<SalaEntity[]>(
    list,
    []
  );

  // const dataAgendamento = useRequest<AgendamentoDTO[]>(
  //   listByWeekAndRoom,
  //   []
  // );

  // const { setAlert } = useAlert();
  const { handleChange, validate } = useForm(
    {
      sala: '',
    },
    ['sala']
  );

  // const remover = async (id: number) => {
  //   try {
  //     await remove(id);
  //     fetchData();
  //     setAlert({
  //       isOpen: true,
  //       message: 'Sala removida com sucesso',
  //       type: 'success',
  //     });
  //   } catch (error: unknown) {
  //     console.error(error);
  //     setAlert({ isOpen: true, message: error.message, type: 'danger' });
  //   }
  // };

  return (
    <Template isLoading={loading} error={error}>
      <div className="mt-5 mb-3">
        <h2>Agendamentos</h2>
        <hr />
      </div>

      <div>
        <h5>Filtros</h5>
        <div className="d-flex align-items-end gap-2">
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
          <div className="mb-3">
            <button
              className="btn btn-primary"
              onClick={() => {
                validate();
                fetchData();
              }}
            >
              Filtrar
            </button>
          </div>
        </div>
      </div>
    </Template>
  );
};

export default Listagem;
