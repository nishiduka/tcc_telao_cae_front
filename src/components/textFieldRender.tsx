import { rankWith, isStringControl } from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { Input, FormGroup, Label } from 'reactstrap';

const TextFieldRenderer = ({ data, handleChange, path, label }) => {
  return (
    <FormGroup>
      <Label for={path}>{label}</Label>
      <Input
        type="text"
        id={path}
        value={data || ''}
        onChange={(ev) => handleChange(path, ev.target.value)}
      />
    </FormGroup>
  );
};

export default withJsonFormsControlProps(TextFieldRenderer);

// Rank function for the Text Field Renderer
export const textFieldTester = rankWith(1, isStringControl);
