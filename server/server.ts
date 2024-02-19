import express, { Express, NextFunction, Request, Response, Router } from 'express';
import path from 'path';
import { PITHY_URL } from '../user-config.js';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app: Express = express();
const PORT = 3000 as const;

import dataRouter from './routers/dataRouter.js';
import userRouter from './routers/userRouter.js';
import k8sRouter from './routers/k8sRouter.js';
//import configRouter from './routers/configRouter.js'; //In development
import { ServerError } from '../types'; // types
import { config } from 'dotenv';

// json + form processing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route handlers
// one visualization group array[0];
app.use('/api/data', dataRouter);
app.use('/api/user', userRouter);
app.use('/api/k8s', k8sRouter);
//app.use('/api/config', configRouter); //In development

//Static handling for FULL BUILD ONLY (dev uses vite proxy);
if (process.env.NODE_ENV !== 'dev') {
  app.use(express.static(path.join(__dirname, '../dist')));
}

// Server index.html explicilty if grabbed (production mode)
app.get('/', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

app.get('/api/pithy', async (_req: Request, res: Response) => {
  const pithyRes = await fetch(PITHY_URL);
  const pithyPrimes: JSON = await pithyRes.json();
  console.log('Sending Pithy data');
  res.json(pithyPrimes);
});

// Route error handler
app.use((req: Request, res: Response) => {
  console.log('Bad incoming request from ' + req.originalUrl);
  res.status(400).send('The page does not exist.');
});

// Global error handler
app.use(
  (err: ServerError, _req: Request, res: Response, _next: NextFunction) => {
    const defaultErr: ServerError = {
      log: 'Error caught in global handler',
      status: 400,
      message: { err: 'An error occured' },
    };
    const errorObj: ServerError = Object.assign({}, defaultErr, err);
    console.log(err);
    console.log(errorObj.message);
    return res.status(errorObj.status).json(errorObj.message);
  },
);

app.listen(PORT, () => {
  console.log(`Now listening on port ${PORT}`);
});

export const viteNodeServer = app;
