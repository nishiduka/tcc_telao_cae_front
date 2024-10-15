import Template from '../../components/template';
import { Label, Input, Button, FormGroup, Form } from 'reactstrap';

const Criar = () => {
  return (
    <Template>
      <div className="mt-5 mb-3">
        <h2>Criar sala</h2>
        <hr />
      </div>
      <Form>
        <FormGroup>
          <Label for="nome">Nome da sala</Label>
          <Input id="nome" name="nome" placeholder="Nome da Sala" type="text" />
        </FormGroup>

        <Button color="success">Salvar</Button>
      </Form>
    </Template>
  );
};

export default Criar;
