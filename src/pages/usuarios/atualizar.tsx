import { useCallback, useEffect, useState } from 'react';
import { Label, Input, Button, FormGroup, Form } from 'reactstrap';
import { useParams } from 'react-router-dom';

import Template from '../../components/template';
import { useForm } from '../../hooks/useForm';
import { useAlert } from '../../hooks/useAlert';
import useRequest from '../../hooks/useRequest';
import { getUser, updateUser } from '../../services/auth';
import UserEntity from '../../domain/entity/userEntity';
import ERole from '../../domain/dto/enum/eRole';

const Atualizar = () => {
  const params = useParams();
  const id = parseInt(params.id || '');

  const getInfo = useCallback(async () => {
    const response = await getUser(id);
    return response;
  }, [id]);

  const userInfo = useRequest<UserEntity>(getInfo, {
    nome: '',
    login: '',
    role: ERole.ADMIN,
    password: '',
  });

  const { setAlert } = useAlert();
  const [disable, setDisable] = useState(false);
  const { values, handleChange, validate, setValues } = useForm(
    {
      nome: userInfo.data.nome,
      login: userInfo.data.login,
      role: userInfo.data.role,
      password: userInfo.data.password,
    },
    ['nome', 'login', 'role']
  );

  useEffect(() => {
    setValues({
      nome: userInfo.data.nome,
      login: userInfo.data.login,
      role: userInfo.data.role,
      password: '',
    });
  }, [userInfo.data, setValues]);

  const onsubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { hasError } = validate();
    setDisable(true);

    if (hasError) {
      alert('Preencha todos os campos');
      setDisable(false);
      return;
    }
    console.log('values::::', values);

    try {
      const response = await updateUser({
        id: id,
        ...values,
      });

      if (!response.success) {
        setAlert({
          isOpen: true,
          type: 'danger',
          message: response.message,
        });
        return;
      }

      setAlert({
        isOpen: true,
        type: 'success',
        message: 'Usuario atualizado com sucesso',
      });

      setTimeout(() => {
        window.location.href = '/usuarios/listagem';
      }, 2500);
    } catch (e: unknown) {
      setAlert({
        isOpen: true,
        type: 'danger',
        message: (e as Error)?.message || '',
      });
      setDisable(false);
    }
  };

  return (
    <Template isLoading={userInfo.loading} error={userInfo.error}>
      <div className="mt-5 mb-3">
        <h2>Atualizar Usuário</h2>
        <hr />
      </div>
      <Form onSubmit={onsubmit}>
        <FormGroup>
          <Label for="nome">Nome do Usuário</Label>
          <Input
            id="nome"
            name="nome"
            placeholder="Nome do usuário"
            type="text"
            required
            onChange={handleChange}
            value={values.nome}
          />
        </FormGroup>

        <FormGroup>
          <Label for="login">Email</Label>
          <Input
            id="login"
            name="login"
            placeholder="email"
            type="text"
            required
            onChange={handleChange}
            value={values.login}
          />
        </FormGroup>

        <FormGroup>
          <Label for="role">Nível de usuário</Label>
          <Input id="role" name="role" type="select" onChange={handleChange}>
            {Object.values(ERole).map((role) => (
              <option key={role} value={role} selected={values.role === role}>
                {role}
              </option>
            ))}
          </Input>
        </FormGroup>

        <FormGroup>
          <Label for="password">Senha</Label>
          <Input
            id="password"
            name="password"
            placeholder="senha"
            type="password"
            onChange={handleChange}
            value={values.password}
          />
        </FormGroup>

        <Button disabled={disable} color="success">
          Salvar
        </Button>
      </Form>
    </Template>
  );
};

export default Atualizar;
