import express, { Request, Response } from 'express';
import promApiController from '../controllers/promApiController.ts';
const dataRouter = express.Router();

dataRouter.get(
  '/metrics/:id',
  // read the query from the saved queries using the metric id from params ->
  promApiController.metricQueryLookup,
  promApiController.queryBuilder,
  promApiController.getMetrics,
  (_req: Request, res: Response) => {
    return res.status(200).json(res.locals.promMetrics);
  },
);

dataRouter.post(
  '/metrics/:id',
  promApiController.metricQueryLookup,
  promApiController.queryBuilder,
  promApiController.getMetrics,
  async (_req: Request, res: Response) => {
    return res.status(200).json(res.locals.promMetrics);
  },
);

dataRouter.post(
  '/metric',
  promApiController.queryBaseBuilder,
  promApiController.queryBuilder,
  promApiController.getMetrics,
  (_req: Request, res: Response) => {
    return res.status(200).json({
      metricData: res.locals.promMetrics,
      searchQuery: res.locals.searchQuery,
    });
  },
);


export default dataRouter;

