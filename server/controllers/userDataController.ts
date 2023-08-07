import { Request, Response, NextFunction } from 'express';
import userData from '../models/defaultUserData.js';

const userDataController: any = {};

userDataController.sendUserData = (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  //userData = userId, clusters[], dashboards[], metrics{}
  res.locals.userData = userData;
  next();
};

export default userDataController;
