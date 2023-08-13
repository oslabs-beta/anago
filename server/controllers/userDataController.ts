import { Request, Response, NextFunction } from 'express';
import { NEW_USER, ACTIVE_DEPLOYMENT } from '../../user-config.js';
import newUserData from '../models/defaultUserData.js';
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
  //userData = userId, clusters[], dashboards[], metrics{}
  if (NEW_USER) {
    // Create a new user from default data (for now?)
    res.locals.userData = newUserData;
    return next();
  }
  try {
    const readData = fs.readFileSync(
      path.resolve(__dirname, '../models/userData.json'),
      'utf-8'
    );
    const userData = JSON.parse(readData);
    if (
      !userData.hasOwnProperty('userId') ||
      !userData.hasOwnProperty('metrics')
    ) {
      console.log(
        'Read UserData is missing metrics. Using and saving default data.'
      );
      res.locals.userData = newUserData;
      fs.writeFileSync(
        path.resolve(__dirname, '../models/userData.json'),
        JSON.stringify(newUserData)
      );
      return next();
    }
    console.log('Successfully read user data, returning now.');
    res.locals.userData = userData;
    next();
  } catch (err) {
    return next({
      log: `Reading User Data failed in userDataController.sendUserData.`,
      status: 500,
      message: { err: 'Error retreiving user data.' },
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

export default userDataController;
