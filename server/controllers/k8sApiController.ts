import * as k8s from '@kubernetes/client-node';
import { Request, Response, NextFunction } from 'express';
import {
  Node,
  Pod,
  Deployment,
  Service,
  Namespace,
  ClusterInfo,
} from '../../client/types';

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

const k8sController: any = {};

k8sController.getNodes = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await k8sApi.listNode();
    const nodes: Node[] = data.body; //map over data and push each node into array

    res.locals.nodes = nodes;
  } catch (error) {
    console.log(error);
  }
};

k8sController.getPods = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const response = await k8sApi.listPodForAllNamespaces();
    console.log(`default namespace pods:`, response.body);
    const pods: Pod[] = response.body; //map over response
    res.locals.pods = pods;
    next();
  } catch (error) {
    console.log(error);
  }
};

k8sController.getServices = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  const data = await k8sApi.listServiceForAllNamespaces();
  const services: Service[] = data.body;
};

k8sController.getDeployments = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  const data = await k8sApi.listDepl();
  const services: Service[] = data.body;
};

k8sController.getDeployments = k8sController.portForward = async () => {};

export default k8sController;
