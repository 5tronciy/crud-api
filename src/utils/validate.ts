import { validate as uuidValidate } from 'uuid';

export const validateUuid = (id: string): boolean => {
  return uuidValidate(id);
};

export const validateCreateUserDto = (data: any): { isValid: boolean; message?: string } => {
  if (!data) {
    return { isValid: false, message: 'Request body is empty' };
  }

  if (typeof data.username !== 'string') {
    return { isValid: false, message: 'Username is required and must be a string' };
  }

  if (typeof data.age !== 'number') {
    return { isValid: false, message: 'Age is required and must be a number' };
  }

  if (!Array.isArray(data.hobbies)) {
    return { isValid: false, message: 'Hobbies is required and must be an array' };
  }

  if (data.hobbies.some((hobby: any) => typeof hobby !== 'string')) {
    return { isValid: false, message: 'All hobbies must be strings' };
  }

  return { isValid: true };
};

export const validateUpdateUserDto = (data: any): { isValid: boolean; message?: string } => {
  if (!data || Object.keys(data).length === 0) {
    return { isValid: false, message: 'Request body is empty' };
  }

  if (data.username !== undefined && typeof data.username !== 'string') {
    return { isValid: false, message: 'Username must be a string' };
  }

  if (data.age !== undefined && typeof data.age !== 'number') {
    return { isValid: false, message: 'Age must be a number' };
  }

  if (data.hobbies !== undefined) {
    if (!Array.isArray(data.hobbies)) {
      return { isValid: false, message: 'Hobbies must be an array' };
    }

    if (data.hobbies.some((hobby: any) => typeof hobby !== 'string')) {
      return { isValid: false, message: 'All hobbies must be strings' };
    }
  }

  return { isValid: true };
};