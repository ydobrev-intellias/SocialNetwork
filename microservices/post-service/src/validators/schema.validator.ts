import Ajv, { JSONSchemaType } from 'ajv';

const ajv = new Ajv();

export const schemaValidator = <T>(schema: JSONSchemaType<T>) => {
  const validate = ajv.compile(schema);
  return (data: T) => {
    const valid = validate(data);
    if (!valid) {
      return validate.errors;
    }
    return null;
  };
};
