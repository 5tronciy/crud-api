import { IncomingMessage, ServerResponse } from 'http';
import { getUsers } from '../controllers/userController';

export const handleUserRoutes = async (req: IncomingMessage, res: ServerResponse): Promise<boolean> => {
  const url = req.url || '';
  const method = req.method || '';
  
  if (url === '/api/users' && method === 'GET') {
    await getUsers(req, res);
    return true;
  }
  
  return false;
};