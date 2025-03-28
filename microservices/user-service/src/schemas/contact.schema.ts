export const updateContactSchema = {
  type: 'object',
  properties: {
    type: {
      enum: ['linkedin', 'phone'],
    },
    value: { type: 'string' },
  },
  required: ['type', 'value'],
  additionalProperties: false,
};

export const createContactSchema = {
  type: 'object',
  properties: {
    type: {
      enum: ['linkedin', 'phone'],
    },
    value: { type: 'string' },
  },
  additionalProperties: false,
};
