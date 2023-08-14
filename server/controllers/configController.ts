import { Request, Response, NextFunction } from 'express';
import { execa, $ } from 'execa';

const configController: any = {};


//unable to test due to prom chart already being applied
configController.applyPromChart = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const addHelm =
      await $`helm repo add prometheus-community https://prometheus-community.github.io/helm-charts`;
    const updateHelm = await $`helm repo update`;
    const installProm =
      await $`helm install prometheus prometheus-community/kube-prometheus-stack --namespace monitoring --create-namespace --set alertmanager.persistentVolume.storageClass="gp2",server.persistentVolume.storageClass="gp2"
    `;
    res.locals.applyPromChart = installProm;
    next();
  } catch (error) {
    console.log(error);
  }
};

export default configController;
