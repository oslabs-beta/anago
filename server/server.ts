import express, { Express, Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app: Express = express();
const PORT: number = 3000;

import dataRouter from './routers/dataRouter.js';
// import userRouter from './routers/userRouter';

// json + form processing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route handlers
app.use('/api/data', dataRouter);
// app.use('/api/user', userRouter);

//Static handling for FULL BUILD ONLY (dev uses vite proxy);
if (process.env.NODE_ENV !== 'dev') {
  app.use(express.static(path.join(__dirname, '../dist')));
}

// Test front-end / back-end code
app.get('/api/message', (_req: Request, res: Response) => {
  console.log('Message sent');
  res.json('Message received!');
});

// Server index.html explicilty if grabbed
app.get('/', (_req: Request, res: Response) => {
  console.log('Front page contact');
  res.sendFile(path.join(__dirname, '../index.html'));
});

app.use((req: Request, res: Response) => {
  console.log('Bad incoming request from ' + req.originalUrl);
  res.status(400).send('The page does not exist.');
});

app.listen(PORT, () => {
  console.log(`Now listening on port ${PORT}`);
});

export const viteNodeServer = app;
