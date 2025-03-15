import Ajv from 'ajv';

const ajv = new Ajv();

export const schemaValidator = (schema: object) => {
  const validate = ajv.compile(schema);
  return (data: any) => {
    const valid = validate(data);
    if (!valid) {
      return validate.errors;
    }
    return null;
  };
};
