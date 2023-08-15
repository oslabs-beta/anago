import express, { Response } from 'express';
import configController from '../controllers/configController.js';

const configRouter = express.Router();

configRouter.get('/', configController.applyPromChart, (_, res: Response) => {
  console.log('in config router apply prom chart', res.locals.applyPromChart);
  return res.status(200).json(res.locals.applyPromChart);
});

export default configRouter;
