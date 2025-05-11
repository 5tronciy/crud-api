import dotenv from 'dotenv';
import { createServer } from 'http';

dotenv.config();

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;

const server = createServer((req, res) => {
  res.statusCode = 501;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ message: 'Not implemented yet' }));
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});