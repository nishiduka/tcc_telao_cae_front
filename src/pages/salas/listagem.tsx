import Table from '../../components/table';
import Template from '../../components/template';
import SalaEntity from '../../domain/entity/salaEntity';
import { list, remove } from '../../services/salas';
import useRequest from '../../hoooks/useRequest';
import { useAlert } from '../../hoooks/useAlert';

const Listagem = () => {
  const { data, loading, error, fetchData } = useRequest<SalaEntity[]>(
    list,
    []
  );
  const { setAlert } = useAlert();

  const remover = async (id: number) => {
    try {
      await remove(id);
      fetchData();
      setAlert({
        isOpen: true,
        message: 'Sala removida com sucesso',
        type: 'success',
      });
    } catch (error: unknown) {
      console.error(error);
      setAlert({ isOpen: true, message: error.message, type: 'danger' });
    }
  };

  return (
    <Template isLoading={loading} error={error}>
      <div className="mt-5 mb-3">
        <h2>Listagem de salas</h2>
        <hr />
      </div>

      <Table<SalaEntity>
        headers={[
          { label: 'Nome', key: 'nome' },
          { label: 'Capacidade', key: 'qtdAlunos' },
          {
            label: 'Operações',
            key: (data: SalaEntity) => (
              <div className="d-flex gap-2 justify-content-center">
                <button className="btn btn-primary">Editar</button>
                <button
                  className="btn btn-danger"
                  onClick={() => data.id !== undefined && remover(data.id)}
                >
                  Excluir
                </button>
              </div>
            ),
          },
        ]}
        data={data}
      />
    </Template>
  );
};

export default Listagem;
