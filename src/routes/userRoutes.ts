import { IncomingMessage, ServerResponse } from 'node:http';
import { getUsers, getUserById, createUser } from '../controllers/userController';

export const handleUserRoutes = async (req: IncomingMessage, res: ServerResponse): Promise<boolean> => {
  const url = req.url || '';
  const method = req.method || '';
  
  if (url === '/api/users' && method === 'GET') {
    await getUsers(req, res);
    return true;
  }
  
  if (url === '/api/users' && method === 'POST') {
    await createUser(req, res);
    return true;
  }
  
  const userIdMatch = url.match(/^\/api\/users\/([^\/]+)$/);
  if (userIdMatch && method === 'GET') {
    const userId = userIdMatch[1];
    await getUserById(req, res, userId);
    return true;
  }
  
  return false;
};