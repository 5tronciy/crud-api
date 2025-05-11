import { createServer, IncomingMessage, ServerResponse } from 'http';
import { handleUserRoutes } from './routes/userRoutes';
import { handleServerError } from './middleware/errorHandler';

export const createApp = (port: number) => {
  const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    try {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      
      if (req.method === 'OPTIONS') {
        res.statusCode = 204;
        res.end();
        return;
      }

      const handled = await handleUserRoutes(req, res);
      
      if (!handled) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Endpoint not found' }));
      }
    } catch (error) {
      handleServerError(error as Error, res);
    }
  });

  server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
  });

  return server;
};