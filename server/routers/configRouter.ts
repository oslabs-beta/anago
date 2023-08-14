import express, { Response } from 'express';
import configController from '../controllers/configController.js';

const configRouter = express.Router();

configRouter.get('/', configController.applyPromChart, (_, res: Response) => {
    return res.status(200).json(res.locals.userData);
  })



export default configRouter;
