import express, { Request, Response } from 'express';

import k8sController from '../controllers/k8sApiController.ts';

const k8sRouter = express.Router();

k8sRouter.get('/nodes', k8sController.getNodes, async (_, res: Response) => {
  //console.log('in k8s router get nodes after fetch', res.locals.nodes);
  return res.status(200).json(res.locals.nodes);
});

k8sRouter.get('/pods', k8sController.getPods, async (_, res: Response) => {
  //console.log('in k8s router get pods after fetch', res.locals.pods);
  return res.status(200).json(res.locals.pods);
});

k8sRouter.get(
  '/namespaces',
  k8sController.getNamespaces,
  async (_, res: Response) => {
    // console.log('in k8s router get namespaces after fetch', res.locals.namespaces);
    return res.status(200).json(res.locals.namespaces);
  },
);

k8sRouter.get(
  '/services',
  k8sController.getServices,
  async (_, res: Response) => {
    // console.log('in k8s router get services after fetch', res.locals.services);
    return res.status(200).json(res.locals.services);
  },
);

k8sRouter.get(
  '/deployments',
  k8sController.getDeployments,
  async (_, res: Response) => {
    // console.log(
    //   'in k8s router get deployments after fetch',
    //   res.locals.deployments,
    // );
    return res.status(200).json(res.locals.deployments);
  },
);

k8sRouter.get(
  '/cluster',
  k8sController.getNodes, k8sController.getPods, k8sController.getNamespaces, k8sController.getServices, k8sController.getDeployments, k8sController.getCluster,
  async (_, res: Response) => {

    return res.status(200).json(res.locals.cluster);
  },
);


//k8sRouter.get('/portforward', k8sController.portForward);




export default k8sRouter;
