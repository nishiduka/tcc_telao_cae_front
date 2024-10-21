import Table from '../../components/table';
import Template from '../../components/template';
import CursoEntity from '../../domain/entity/cursoEntity';
import { list, remove } from '../../services/cursos';
import useRequest from '../../hooks/useRequest';
import { useAlert } from '../../hooks/useAlert';

const Listagem = () => {
  const { data, loading, error, fetchData } = useRequest<CursoEntity[]>(
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
        message: 'Curso removida com sucesso',
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
        <h2>Listagem de cursos</h2>
        <hr />
      </div>

      <Table<CursoEntity>
        headers={[
          { label: 'Nome', key: 'nome' },
          {
            label: 'Operações',
            key: (data: CursoEntity) => (
              <div className="d-flex gap-2 justify-content-center">
                <a
                  href={`/cursos/atualizar/${data.id}`}
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
