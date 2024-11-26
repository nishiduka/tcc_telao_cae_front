import Table from '../../components/table';
import Template from '../../components/template';
import { getUsers, removeUser } from '../../services/auth';
import useRequest from '../../hooks/useRequest';
import { useAlert } from '../../hooks/useAlert';
import UserEntity from '../../domain/entity/userEntity';

const Listagem = () => {
  const { data, loading, error, fetchData } = useRequest<UserEntity[]>(
    getUsers,
    []
  );
  const { setAlert } = useAlert();

  const remover = async (id: number) => {
    try {
      await removeUser(id);
      fetchData();
      setAlert({
        isOpen: true,
        message: 'Usuario removido com sucesso',
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
        <h2>Listagem de usuários</h2>
        <hr />
      </div>

      <Table<UserEntity>
        headers={[
          { label: 'Nome', key: 'nome' },
          { label: 'Email', key: 'login' },
          { label: 'Nível', key: 'role' },
          {
            label: 'Operações',
            key: (data: UserEntity) => (
              <div className="d-flex gap-2 justify-content-center">
                <a
                  href={`/usuarios/atualizar/${data.id}`}
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
