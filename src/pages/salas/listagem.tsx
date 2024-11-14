import Table from '../../components/table';
import Template from '../../components/template';
import SalaEntity from '../../domain/entity/salaEntity';
import { list, remove } from '../../services/salas';
import useRequest from '../../hooks/useRequest';
import { useAlert } from '../../hooks/useAlert';

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
      setAlert({
        isOpen: true,
        message: (error as Error)?.message || '',
        type: 'danger',
      });
    }
  };

  return (
    <Template isLoading={loading} error={error}>
      <div className="mt-5 mb-3">
        <h2>Listagem de salas</h2>
        <hr />
      </div>

      <Table<Omit<SalaEntity, 'bloco'>>
        headers={[
          { label: 'Nome', key: 'nome' },
          { label: 'Capacidade', key: 'qtdAlunos' },
          {
            label: 'Operações',
            key: (data: Omit<SalaEntity, 'bloco'>) => (
              <div className="d-flex gap-2 justify-content-center">
                <a
                  href={`/salas/atualizar/${data.id}`}
                  className="btn btn-primary"
                >
                  Editar
                </a>
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
