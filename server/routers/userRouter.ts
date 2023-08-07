import express, { Response } from 'express';
import userDataController from '../controllers/userDataController.js';

const userRouter = express.Router();

userRouter.get('/', userDataController.sendUserData, (_, res: Response) => {
  return res.status(200).json(res.locals.userData);
});




export default userRouter;
