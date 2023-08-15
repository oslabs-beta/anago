import { Request, Response, NextFunction } from 'express';
import { readUserData } from './helperFunctions.js';
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
