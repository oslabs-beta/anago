import { Request, Response, NextFunction } from 'express';
import { readUserData } from './helperFuncs.js';
import { Metric, UserData } from '../models/userDataClass.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
console.log('in userDataController');
const userDataController: any = {};

userDataController.sendUserData = (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('in sendUserData')
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

userDataController.saveHiddenAlert = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  console.log('inside saveHiddenAlert');
  try {
    const newHiddenAlert = req.body;
    //grab the current userData
    const updatedUserData = readUserData();
    updatedUserData.hiddenAlerts.push(newHiddenAlert);

    fs.writeFileSync(
      path.resolve(__dirname, '../models/userData.json'),
      JSON.stringify(updatedUserData)
    );
    console.log('new hidden alert added to userData');
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
  console.log('inside deleteHiddenAlert');
  try {
    const unhideAlert = req.body;
    const updatedUserData = readUserData();
    //remove the alert
    updatedUserData.hiddenAlerts.filter((el) => el !== unhideAlert);

    fs.writeFileSync(
      path.resolve(__dirname, '../models/userData.json'),
      JSON.stringify(updatedUserData)
    );
    console.log('hidden alert removed from userData');
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
  const updatedUserData = readUserData();
  console.log('Read Data:', updatedUserData);
  console.log('Dashboard Size: ', updatedUserData.dashboards[0].metrics.length);

  const newMetric = new Metric(newMetricInfo.name, newMetricInfo.type, {
    duration: newMetricInfo.duration,
    stepSize: newMetricInfo.stepSize,
  });
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
