import dotenv from 'dotenv';
import cluster from 'node:cluster';
import { IncomingMessage, request, ServerResponse } from 'node:http';
import { availableParallelism } from 'node:os';
import { createApp } from './app';

dotenv.config();

const numWorkers = availableParallelism() - 1;
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;

interface WorkerData {
  pid: number;
  port: number;
}

if (process.env.MULTI === 'true' && cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);
  console.log(`Starting ${numWorkers} workers...`);

  const server = createApp(PORT);

  let currentWorker = 0;
  const workers: WorkerData[] = [];

  for (let i = 0; i < numWorkers; i++) {
    const workerPort = PORT + i + 1;
    const worker = cluster.fork({ WORKER_PORT: workerPort.toString() });

    if (worker.process.pid) {
      workers.push({
        pid: worker.process.pid,
        port: workerPort
      });
    }
  }

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);

    const index = workers.findIndex(w => w.pid === worker.process.pid);
    if (index !== -1) {
      const workerPort = workers[index].port;

      const newWorker = cluster.fork({ WORKER_PORT: workerPort.toString() });

      if (newWorker.process.pid) {
        workers[index] = {
          pid: newWorker.process.pid,
          port: workerPort
        };
      }
    } else {
      console.error(`Could not find port for worker ${worker.process.pid}`);
    }
  });

  server.on('request', (req: IncomingMessage, res: ServerResponse) => {
    if (!req.url?.startsWith('/api')) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ message: 'Endpoint not found' }));
      return;
    }

    const workerData = workers[currentWorker % workers.length];
    currentWorker = (currentWorker + 1) % workers.length;

    const options = {
      hostname: 'localhost',
      port: workerData.port,
      path: req.url,
      method: req.method,
      headers: req.headers
    };

    const proxyReq = request(options, (proxyRes: IncomingMessage) => {
      if (!res.headersSent) {
        res.statusCode = proxyRes.statusCode || 500;

        if (proxyRes.headers) {
          for (const [key, value] of Object.entries(proxyRes.headers)) {
            if (value !== undefined) {
              try {
                res.setHeader(key, value);
              } catch (err: any) {
                console.warn(`Failed to set header ${key}: ${err.message}`);
              }
            }
          }
        }
      }

      proxyRes.pipe(res);
    });

    proxyReq.on('error', (error: Error) => {
      console.error(`Error forwarding request to worker: ${error.message}`);
      if (!res.headersSent) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Internal server error' }));
      } else {
        res.end();
      }
    });
  });
} else {
  const workerPort = process.env.WORKER_PORT ? parseInt(process.env.WORKER_PORT, 10) : PORT;
  createApp(workerPort);
}