import express, { Response } from 'express';
import userDataController from '../controllers/userDataController.js';

const userRouter = express.Router();

userRouter.get('/', userDataController.sendUserData, (_, res: Response) => {
  return res.status(200).json(res.locals.userData);
});

userRouter.post('/hiddenAlert', userDataController.saveHiddenAlert, (_, res: Response) => {
  return res.sendStatus(200)
})

userRouter.delete('/hiddenAlert', userDataController.deleteHiddenAlert, (_, res: Response) => {
  return res.sendStatus(200)
})

export default userRouter;
