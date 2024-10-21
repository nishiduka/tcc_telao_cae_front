import Table from '../../components/table';
import Template from '../../components/template';
import useRequest from '../../hoooks/useRequest';
import { useAlert } from '../../hoooks/useAlert';
import MateriaEntity from '../../domain/entity/materiaEntity';
import { list, remove } from '../../services/materias';

const Listagem = () => {
  const { data, loading, error, fetchData } = useRequest<MateriaEntity[]>(
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
        <h2>Listagem de Materias</h2>
        <hr />
      </div>

      <Table<MateriaEntity>
        headers={[
          { label: 'Nome', key: 'nome' },
          { label: 'Sigla', key: 'sigla' },
          {
            label: 'curso',
            key: (materia: MateriaEntity) => materia.curso.nome,
          },
          {
            label: 'Operações',
            key: (data: Omit<MateriaEntity, 'curso'>) => (
              <div className="d-flex gap-2 justify-content-center">
                <a
                  href={`/materias/atualizar/${data.id}`}
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
