import Table from '../../components/table';
import Template from '../../components/template';
import { list, remove } from '../../services/professores';
import useRequest from '../../hooks/useRequest';
import { useAlert } from '../../hooks/useAlert';
import ProfessorEntity from '../../domain/entity/professorEntity';

const Listagem = () => {
  const { data, loading, error, fetchData } = useRequest<ProfessorEntity[]>(
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
        message: 'Professor removida com sucesso',
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
        <h2>Listagem de Professor</h2>
        <hr />
      </div>

      <Table<ProfessorEntity>
        headers={[
          { label: 'Nome', key: 'nome' },
          {
            label: 'Operações',
            key: (data: ProfessorEntity) => (
              <div className="d-flex gap-2 justify-content-center">
                <a
                  href={`/professores/atualizar/${data.id}`}
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
