import Ajv, { SchemaObject } from 'ajv';

const ajv = new Ajv();

export const schemaValidator = <T>(schema: SchemaObject) => {
  const validate = ajv.compile(schema);
  return (data: T) => {
    const valid = validate(data);
    if (!valid) {
      return validate.errors;
    }
    return null;
  };
};
