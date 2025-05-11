import { validate as uuidValidate } from 'uuid';

export const validateUuid = (id: string): boolean => {
  return uuidValidate(id);
};