import express, { Request, Response, NextFunction } from 'express';
import metricsController from '../controllers/metricsController.js';
import promApiController from '../controllers/promApiController.js';
const dataRouter = express.Router();

//id = metric-id
dataRouter.get(
  // TODO: eventually reconfigure this because we will be sending metric id, along with other info, in the req body in the future
  '/metrics/:id',
  //metricsController.verifyMetric,
  promApiController.queryBuilder,
  promApiController.getMetrics,
  async (_req: Request, res: Response) => {
    // make some data fetch
    // console.log(_req.body);

    return res.status(200).json(res.locals.promMetrics);
  },
);

//does this metric exist? look at the searchQuery, make that request to promQL, parse the data, pass it to the front end

export default dataRouter;
