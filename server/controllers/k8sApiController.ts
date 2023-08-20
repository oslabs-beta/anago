import * as k8s from '@kubernetes/client-node';
import { Request, Response, NextFunction } from 'express';
import {
  Node,
  Pod,
  Deployment,
  Service,
  Namespace,
  Cluster,
} from '../../types';

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
const k8sApi2 = kc.makeApiClient(k8s.AppsV1Api);


const k8sController: any = {};

k8sController.getNodes = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data: any = await k8sApi.listNode();
    const nodes: Node[] = data.body.items.map(data => {
      const { name, namespace, creationTimestamp, labels, uid } = data.metadata;
      const { providerID } = data.spec;
      const { status } = data;
      const node: Node = {
        name,
        namespace,
        creationTimestamp,
        uid,
        labels,
        providerID,
        status,
      };
      return node;
    });
    res.locals.nodes = nodes;
    res.locals.cluster = { nodes: nodes };
    return next();
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
    const data: any = await k8sApi.listPodForAllNamespaces();
    const pods: Pod[] = data.body.items.map(data => {
      const { name, namespace, creationTimestamp, uid, labels } = data.metadata;
      console.log(data.spec.containers)
      const { nodeName, containers, serviceAccount } = data.spec;
      const { conditions, containerStatuses, phase, podIP } = data.status;
      const pod: Pod = {
        name,
        namespace,
        uid,
        creationTimestamp,
        labels,
        nodeName,
        containers,
        serviceAccount,
        conditions,
        containerStatuses,
        phase,
        podIP,
      };
      return pod;
    });
    res.locals.pods = pods;
    res.locals.cluster = { pods: pods };
    next();
  } catch (error) {
    console.log(error);
  }
};

k8sController.getNamespaces = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data: any = await k8sApi.listNamespace();
    const namespaces = data.body.items.map(data => {
      const { name, creationTimestamp, labels, uid } = data.metadata;
      const { phase } = data.status;
      const nodeName = '';
      const namespace: Namespace = {
        name,
        uid,
        creationTimestamp,
        labels,
        phase,
        nodeName,
      };
      return namespace;
    });
    res.locals.namespaces = namespaces;
    res.locals.cluster = { namespaces: namespaces };
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
  try {
    const data: any = await k8sApi.listServiceForAllNamespaces();
    const services: Service[] = data.body.items.map(data => {
      const { name, namespace, uid, creationTimestamp, labels } = data.metadata;
      const { ports, clusterIP } = data.spec;
      const { loadBalancer } = data.status;
      const service: Service = {
        name,
        namespace,
        uid,
        creationTimestamp,
        labels,
        ports,
        loadBalancer,
        clusterIP
      };
      return service;
    });
    res.locals.services = services;
    res.locals.cluster = { services: services };
    next();
  } catch (error) {
    console.log(error);
  }
};

k8sController.getDeployments = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data: any = await k8sApi2.listDeploymentForAllNamespaces();

    const deployments: Deployment[] = data.body.items.map(data => {
      const { name, creationTimestamp, labels, namespace, uid } = data.metadata;
      const { replicas } = data.spec;
      const { status } = data.status;
      const deployment: Deployment = {
        name,
        namespace,
        uid,
        creationTimestamp,
        labels,
        replicas,
        status,
      };
      return deployment;
    });
    res.locals.deployments = deployments;
    res.locals.cluster = { deployments: deployments };
    next();
  } catch (error) {
    console.log(error);
  }
};

k8sController.getCluster = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const nodes = res.locals.nodes;
    const pods = res.locals.pods;
    const namespaces = res.locals.namespaces;
    const services = res.locals.services;
    const deployments = res.locals.deployments;
    const cluster: Cluster = {
      nodes,
      pods,
      namespaces,
      services,
      deployments,
    };
    //currently does not accounting for multiple clusters, just one cluster for now
    res.locals.cluster = cluster;
    next();
  } catch (error) {
    console.log(error);
  }
};

// k8sController.portForward = () => {
//     const forward = new k8s.PortForward(kc);
//     const server = net.createServer((socket)=> {
//         forward.portForward('default', 'demo', [9090], socket, null, socket )
//     });
//     server.listen(9090, '127.0.0.1')
// }
// k8sController.getDeployments = k8sController.portForward = async () => {};

export default k8sController;
