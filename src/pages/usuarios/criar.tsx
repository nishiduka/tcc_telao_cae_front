import { useState } from 'react';
import { Label, Input, Button, FormGroup, Form } from 'reactstrap';

import Template from '../../components/template';
import { useForm } from '../../hooks/useForm';
import { useAlert } from '../../hooks/useAlert';
import { createUser } from '../../services/auth';
import ERole from '../../domain/dto/enum/eRole';

const Criar = () => {
  const { setAlert } = useAlert();
  const [disable, setDisable] = useState(false);
  const { values, handleChange, validate } = useForm(
    {
      nome: '',
      login: '',
      role: ERole.ADMIN,
      password: '',
    },
    ['nome', 'login', 'role', 'password']
  );

  const onsubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { hasError } = validate();

    if (hasError) {
      alert('Preencha todos os campos');
      return;
    }
    setDisable(true);

    try {
      const response = await createUser({
        ...values,
        role: values.role as ERole,
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
        message: 'Usuario criado com sucesso',
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
    <Template>
      <div className="mt-5 mb-3">
        <h2>Criar Usuário</h2>
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
            type="email"
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

export default Criar;
