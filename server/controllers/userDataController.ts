import { Request, Response, NextFunction } from 'express';
import { readUserData } from './helperFuncs.ts';
import { Metric, UserData } from '../models/userDataClass.ts';
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
  console.log('in sendUserData');
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
    return next();
  } catch (err) {
    next({
      log: `error in userDataController.sendUserData: ${err}`,
      status: 500,
      message: { err: 'Error retreiving user data' },
    });
  }
};

userDataController.getHiddenAlerts = (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userData = readUserData();
    if (!userData) {
      next({
        log: `Reading User Data failed in userDataController.getHiddenAlerts.`,
        status: 500,
        message: { err: 'Error retreiving user data.' },
      });
    }
    res.locals.hiddenAlerts = userData.hiddenAlerts;
    next();
  } catch (err) {
    next({
      log: `error in userDataController.getHiddenAlerts: ${err}`,
      status: 500,
      message: { err: 'Error retreiving hidden alerts' },
    });
  }
};

userDataController.saveHiddenAlert = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    // grab just the string from the {hidden: string} param
    const newHiddenAlert = req.body.hidden;
    //grab the current userData
    const updatedUserData = readUserData();
    // if the current user does not have this saved error, add it
    if (!updatedUserData.hiddenAlerts.includes(newHiddenAlert)) {
      updatedUserData.hiddenAlerts.push(newHiddenAlert);
    }
    fs.writeFileSync(
      path.resolve(__dirname, '../models/userData.json'),
      JSON.stringify(updatedUserData)
    );
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
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const unhideAlert = req.body.hidden;
    const updatedUserData = readUserData();
    //filter the current hiddenAlerts array
    updatedUserData.hiddenAlerts = updatedUserData.hiddenAlerts.filter(
      (value) => value !== unhideAlert
    );

    fs.writeFileSync(
      path.resolve(__dirname, '../models/userData.json'),
      JSON.stringify(updatedUserData)
    );
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
