import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { handleUserRoutes } from './routes/userRoutes';
import { handleServerError } from './middleware/errorHandler';

const parseRequestBody = async (req: IncomingMessage): Promise<any> => {
  if (req.method === 'GET' || req.method === 'DELETE') {
    return {};
  }
  
  if ((req as any).body) {
    return (req as any).body;
  }
  
  try {
    const bodyParts: Buffer[] = [];
    
    for await (const chunk of req) {
      bodyParts.push(Buffer.from(chunk));
    }
    
    const bodyBuffer = Buffer.concat(bodyParts);
    const bodyString = bodyBuffer.toString();
    
    if (!bodyString) {
      return {};
    }
    
    return JSON.parse(bodyString);
  } catch (error) {
    console.error('Error parsing request body:', error);
    throw new Error('Invalid JSON in request body');
  }
};

export const createApp = (port: number) => {
  const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    try {
      try {
        (req as any).body = await parseRequestBody(req);
      } catch (error) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: (error as Error).message }));
        return;
      }
      
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