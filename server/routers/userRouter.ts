import express, { Response } from 'express';
import userDataController from '../controllers/userDataController.js';

const userRouter = express.Router();

console.log('in userRouter')
userRouter.get('/', userDataController.sendUserData, (_, res: Response) => {
  return res.status(200).json(res.locals.userData);
});

userRouter.post(
  '/hiddenAlert',
  userDataController.saveHiddenAlert,
  (_, res: Response) => {
    return res.sendStatus(200);
  }
);

userRouter.delete(
  '/hiddenAlert',
  userDataController.deleteHiddenAlert,
  (_, res: Response) => {
    return res.sendStatus(200);
  }
);

userRouter.post(
  '/add-metric',
  userDataController.addMetric,
  (_, res: Response) => {
    //send updated user data
    return res.status(200).json(res.locals.userData);
  }
);

userRouter.post(
  '/',
  userDataController.saveUserData,
  userDataController.sendUserData,
  (_, res: Response) => {
    return res.status(200).json(res.locals.userData);
  }
);

export default userRouter;
