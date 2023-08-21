import express, { Request, Response, NextFunction } from 'express';
import metricsController from '../controllers/metricsController.ts';
import promApiController from '../controllers/promApiController.ts';
const dataRouter = express.Router();

//id = metric-id
dataRouter.get(
  // TODO: eventually reconfigure this because we will be sending metric id, along with other info, in the req body in the future
  '/metrics/:id',
  //metricsController.verifyMetric,
  // read the query from the saved queries using the metric id from params ->
  promApiController.metricQueryLookup,
  promApiController.queryBuilder,
  promApiController.getMetrics,
  (_req: Request, res: Response) => {
    // make some data fetch
    // console.log(_req.body);

    return res.status(200).json(res.locals.promMetrics);
  }
);

dataRouter.post(
  '/metric',
  promApiController.queryBaseBuilder,
  promApiController.queryBuilder,
  promApiController.getMetrics,
  (_req: Request, res: Response) => {
    // make some data fetch
    // console.log(_req.body);

    return res.status(200).json({
      metricData: res.locals.promMetrics,
      searchQuery: res.locals.searchQuery,
    });
  }
);

//does this metric exist? look at the searchQuery, make that request to promQL, parse the data, pass it to the front end

export default dataRouter;

// build the basic query string from the complicated FE object
// promApiController.queryBuilder,
// promApiController.getMetrics,
