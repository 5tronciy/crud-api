import { IncomingMessage, ServerResponse } from 'node:http';
import { getUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/userController';

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
  if (userIdMatch) {
    const userId = userIdMatch[1];
    
    if (method === 'GET') {
      await getUserById(req, res, userId);
      return true;
    }
    
    if (method === 'PUT') {
      await updateUser(req, res, userId);
      return true;
    }
    
    if (method === 'DELETE') {
      await deleteUser(req, res, userId);
      return true;
    }
  }
  
  return false;
};