import { Request, Response, NextFunction } from 'express';
import userData from '../models/defaultUserData.js';

const userDataController: any = {};

userDataController.sendUserData = (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //userData = userId, clusters[], dashboards[], metrics{}
    res.locals.userData = userData;
    next();
  } catch (err) {
    next({
      log: `error in userDataController.sendUserData: ${err}`,
      status: 500,
      message: { err: 'Error retreiving user data' },
    });
  }
};

userDataController.saveHiddenAlert = (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // add hidden alert!
    next();
  } catch (err) {
    next({
      log: `error in userDataController.saveHiddenAlert: ${err}`,
      status: 500,
      message: { err: 'Error sending hidden alert' },
    });
  }
};

userDataController.deleteHiddenAlert = (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // delete hidden alert!
    next();
  } catch (err) {
    next({
      log: `error in userDataController.deleteHiddenAlert: ${err}`,
      status: 500,
      message: { err: 'Error deleting hidden alert' },
    });
  }
};

export default userDataController;
