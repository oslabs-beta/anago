import { Request, Response, NextFunction } from 'express';
import userData from '../models/defaultUserData';

//    userData = {
//      userId = randomUUID();
//      clusters = [];
//      dashboards = [];
//      metrics = {key/userId: info};
//      const firstDash = new Dashboard('Kubernetes Dashboard');
//      this.dashboards.push(firstDash);
//}

const metricsController: any = {};

metricsController.verifyMetric = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const { metricId } = req.params;
  try {
    //does this metricId exist as a key in the metric object on the userData?
    if (userData.metrics.hasOwnProperty[metricId]) {
      console.log('metricId exists on this user!');
      //if so, return next to API controller
      return next();
    } else {
      throw new Error('metricId does not exist on this user');
    }
  } catch (err) {
    return next({
      log: `metricsController.verifyMetric ERROR: trouble verifying metric id`,
      message: {
        err: `metricsController.verifyMetric ERROR: ${err}`,
      },
    });
  }
};
export default metricsController;
