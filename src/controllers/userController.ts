import { IncomingMessage, ServerResponse } from 'http';
import { userRepository } from '../repositories/userRepository';

export const getUsers = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
  const users = userRepository.findAll();
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(users));
};