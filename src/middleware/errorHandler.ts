import { ServerResponse } from 'http';

export const handleServerError = (error: Error, res: ServerResponse): void => {
  console.error(`Server error: ${error.message}`);
  
  res.statusCode = 500;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ message: 'Internal server error' }));
};