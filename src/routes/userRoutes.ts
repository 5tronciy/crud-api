import { IncomingMessage, ServerResponse } from 'http';
import { getUsers, getUserById } from '../controllers/userController';

export const handleUserRoutes = async (req: IncomingMessage, res: ServerResponse): Promise<boolean> => {
  const url = req.url || '';
  const method = req.method || '';
  
  if (url === '/api/users' && method === 'GET') {
    await getUsers(req, res);
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