import { NextFunction, Request, Response } from 'express';

export interface IMiddleware {
  next: (
    pre: any
  ) => (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void | Response<any, Record<string, any>>>;
}
