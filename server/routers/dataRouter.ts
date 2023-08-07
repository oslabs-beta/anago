import express, { Request, Response, NextFunction } from 'express';
import metricsController from '../controllers/metricsController';
import promApiController from '../controllers/promApiController';
const dataRouter = express.Router();

//id = metric-id
dataRouter.get('/metrics/:id', metricsController.verifyMetric, promApiController.getRangeMetrics, async (req: Request, res: Response, next: NextFunction) => {
    // make some data fetch
    console.log(req.body);
    return res.status(200).json(res.locals)
  }
);
//does this metric exist? look at the searchQuery, make that request to promQL, parse the data, pass it to the front end


export default dataRouter;
