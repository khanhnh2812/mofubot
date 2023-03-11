import { Document, FilterQuery } from 'mongoose';
import { Request, Response } from 'express';

import { IGeneralService } from './general-service.interface';

export interface IGeneralController<T extends Document> {
  service: IGeneralService<T>;
  createHandler(req: Request, res: Response): Promise<Response>;
  findByIdHandler(req: Request, res: Response): Promise<Response>;
  findAllHandler(
    req: Request,
    res: Response,
    query: FilterQuery<T>
  ): Promise<Response>;
  deleteByIdHandler(req: Request, res: Response): Promise<Response>;
  updateByIdHandler(req: Request, res: Response): Promise<Response>;
}
