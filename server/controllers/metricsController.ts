import { Request, Response, NextFunction } from 'express';
import userData from '../models/defaultUserData.js';

// userData {
//  userId: string;
//  clusters: Cluster[];
//  constructor() {
//    this.userId = randomUUID();
//    this.clusters = [];
//    this.metrics = {};
//    this.dashboard = [];
//     }
//   }

const metricsController: any = {};

metricsController.verifyMetric = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const { metricId } = req.params;
  try {
    //does this metricId exist in the metric object on the userData?
    if (userData.metrics.hasOwnProperty[metricId]) {
      console.log('metricId exists on this user!');
      next();
    } else {
      throw new Error('metricId does not exist on this user');
    }
    //if so, pass to API controller
    //else, next(error)
  } catch (err) {
    return next(err);
  }
};
export default metricsController;
