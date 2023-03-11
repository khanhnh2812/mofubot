import { Request, Response } from 'express';

import { AliasService } from '@/services/alias.service';
import { FilterQuery } from 'mongoose';
import { GeneralController } from './general.controller';
import { IAliasDocument } from '@/interface/document/alias.document';
import { Service } from 'typedi';
import { generalPaginateRegex } from '@/utils/paginate';

@Service()
export class AliasController extends GeneralController<IAliasDocument> {
  constructor(public service: AliasService) {
    super(service);
  }

  /**
   * A handler for create
   * Override for validation
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<Response>}
   */
  public async createHandler(req: Request, res: Response): Promise<Response> {
    const isExisted = await this.service.isExistedByAlias(req.body.alias);

    if (isExisted)
      return res.status(500).send({
        message: `${this.service.name} has been taken`,
      });

    return super.createHandler(req, res);
  }

  /**
   * A handler for findAll
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<Response>}
   */
  public async findAllHandler(req: Request, res: Response): Promise<Response> {
    const query: FilterQuery<IAliasDocument> = {
      alias: generalPaginateRegex(req.query.alias),
      prc_id: generalPaginateRegex(req.query.prc_id),
    };

    return this.findAllHandlerWithQuery(req, res, query);
  }

  /**
   * A handler for updateById
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<Response>}
   */
  public async updateByIdHandler(
    req: Request,
    res: Response
  ): Promise<Response> {
    const isExisted = await this.service.isExistedByAlias(req.body.alias);

    if (isExisted)
      return res.status(500).send({
        message: `${this.service.name} has been taken`,
      });

    return super.updateByIdHandler(req, res);
  }
}
