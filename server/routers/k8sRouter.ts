import express, { Request, Response } from 'express';

import k8sController from '../controllers/k8sApiController.js';

const k8sRouter = express.Router();

k8sRouter.get('/', k8sController.listDefaultPods, async (_, res: Response) => {
  return res.status(200).json(res.locals.defaultPods);
});

export default k8sRouter;
