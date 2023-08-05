import express, { Request, Response, NextFunction } from 'express';
const userRouter = express.Router();


userRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    // make some user info fetch
    console.log(req.body);
    res.locals.data = { data: 'Placeholder' };
    next();
  }
);


export default userRouter;
