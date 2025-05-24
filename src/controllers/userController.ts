import { IncomingMessage, ServerResponse } from 'node:http';
import { userRepository } from '../repositories/userRepository';
import { validateUuid, validateCreateUserDto, validateUpdateUserDto } from '../utils/validate';

export const getUsers = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
  const users = userRepository.findAll();
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(users));
};

export const getUserById = async (req: IncomingMessage, res: ServerResponse, id: string): Promise<void> => {
  if (!validateUuid(id)) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'User ID is invalid' }));
    return;
  }

  const user = userRepository.findById(id);
  if (!user) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'User not found' }));
    return;
  }

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(user));
};

export const createUser = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
  const userData = (req as any).body;
  
  const validation = validateCreateUserDto(userData);
  if (!validation.isValid) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: validation.message }));
    return;
  }
  
  const newUser = userRepository.create(userData);
  res.statusCode = 201;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(newUser));
};

export const updateUser = async (req: IncomingMessage, res: ServerResponse, id: string): Promise<void> => {
  if (!validateUuid(id)) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'User ID is invalid' }));
    return;
  }

  const userData = (req as any).body;
  
  const validation = validateUpdateUserDto(userData);
  if (!validation.isValid) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: validation.message }));
    return;
  }
  
  const updatedUser = userRepository.update(id, userData);
  if (!updatedUser) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'User not found' }));
    return;
  }
  
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(updatedUser));
};

export const deleteUser = async (req: IncomingMessage, res: ServerResponse, id: string): Promise<void> => {
  if (!validateUuid(id)) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'User ID is invalid' }));
    return;
  }

  const deleted = userRepository.delete(id);
  if (!deleted) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'User not found' }));
    return;
  }

  res.statusCode = 204;
  res.end();
};
