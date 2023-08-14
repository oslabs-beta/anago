import { Request, Response, NextFunction } from 'express';
import { readUserData } from './helperfunctions.js';
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

export default userDataController;
