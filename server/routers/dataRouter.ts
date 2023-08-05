import express, { Request, Response, NextFunction } from 'express';
const dataRouter = express.Router();


dataRouter.get('/group/:id', async (req: Request, res: Response, next: NextFunction) => {
    // make some data fetch
    console.log(req.body);
    res.locals.data = { data: 'Placeholder' };
    next();
  }
);


export default dataRouter;
