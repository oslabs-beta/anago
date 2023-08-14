import { Request, Response, NextFunction } from 'express';

const configController: any = {};

configController.applyPromChart = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const prom = await execSh.promise()


  } catch (error) {console.log(error)}
};

export default configController;
