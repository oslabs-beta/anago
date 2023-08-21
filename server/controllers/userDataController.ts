import { Request, Response, NextFunction } from 'express';
import { readUserData } from './helperFuncs.js';
import { Metric } from '../models/userDataClass.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const userDataController: any = {};

userDataController.sendUserData = (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userData = readUserData();
    if (!userData) {
      next({
        log: `Reading User Data failed in userDataController.sendUserData.`,
        status: 500,
        message: { err: 'Error retreiving user data.' },
      });
    }
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

userDataController.saveUserData = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('Saving updated user data.');
  const updatedUserData = req.body;
  try {
    fs.writeFileSync(
      path.resolve(__dirname, '../models/userData.json'),
      JSON.stringify(updatedUserData)
    );
    next();
  } catch (err) {
    return next({
      log: `Writing updated User Data failed in userDataController.saveUserData.`,
      status: 500,
      message: { err: 'Error saving user data.' },
    });
  }
};

userDataController.addMetric = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('Received a new Metric to configure:', req.body);
  const newMetricInfo = req.body;
  const updatedUserData = res.locals.userData;

  const newMetric = new Metric(
    newMetricInfo.name,
    newMetricInfo.lookupType,
    newMetricInfo.scopeType,
    res.locals.queryOptions
  );
  updatedUserData.dashboards[0].metrics.push(newMetric);
  updatedUserData.metrics[newMetric.metricId] = newMetric;

  console.log('Updated Data:', updatedUserData);
  console.log('Dashboard Size: ', updatedUserData.dashboards[0].metrics.length);

  fs.writeFileSync(
    path.resolve(__dirname, '../models/userData.json'),
    JSON.stringify(updatedUserData)
  );
  res.locals.userData = updatedUserData;
  next();
};

export default userDataController;
