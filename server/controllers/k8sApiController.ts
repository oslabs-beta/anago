import * as k8s from '@kubernetes/client-node';
import { Request, Response, NextFunction } from 'express';

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

const k8sController :any= {};

k8sController.listDefaultPods = async (_req:Request, res:Response, next:NextFunction) => {
  try {
    const response = await k8sApi.listNamespacedPod('default');
    console.log(`default namespace pods:`, response.body);
    res.locals.defaultPods = response.body;
    next();
} catch (error) {console.log(error)}

};

k8sController.portForward =async () => {
    
}

console.log(kc.makeApiClient)




export default k8sController