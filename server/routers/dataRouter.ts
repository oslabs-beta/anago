import express, { Request, Response, NextFunction } from 'express';
const dataRouter = express.Router();


dataRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    // make some data fetch for metric params.id
    console.log(req.body);
    res.locals.data = { data: 'Placeholder' };
    next();
  }
);


export default dataRouter;
