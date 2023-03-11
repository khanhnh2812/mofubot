import { Document, FilterQuery, PaginateOptions } from 'mongoose';
import { Request, Response } from 'express';
import { checkBooleanFromString, generalHandler } from '@/utils';

import { IGeneralController } from '@/interface/utils/general-controller.interface';
import { IGeneralService } from '@/interface/utils/general-service.interface';

export class GeneralController<T extends Document>
  implements IGeneralController<T>
{
  constructor(public service: IGeneralService<T>) {}

  /**
   * A handler for create
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<Response>}
   */
  public async createHandler(req: Request, res: Response): Promise<Response> {
    return generalHandler(req, res, async () => {
      const item = await this.service.create(req.body);

      return res.status(200).send({
        data: item.toJSON(),
      });
    });
  }

  /**
   * A handler for findById
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<Response>}
   */
  public async findByIdHandler(req: Request, res: Response): Promise<Response> {
    return generalHandler(req, res, async () => {
      const id = req.params.id;
      const item = await this.service.findById(id);

      // Not found case
      if (!item)
        return res.status(404).send({
          message: `${this.service.name} not found - id: ${id}`,
        });

      return res.status(200).send({
        data: item.toJSON(),
      });
    });
  }

  /**
   * A handler for findAll without query
   * As default, need override to use specific query
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<Response>}
   */
  public async findAllHandler(req: Request, res: Response): Promise<Response> {
    return this.findAllHandlerWithQuery(req, res, {});
  }

  /**
   * A handler for findAll
   * @param {Request} req
   * @param {Response} res
   * @param {FilterQuery<T>} query
   * @returns {Promise<Response>}
   */
  public async findAllHandlerWithQuery(
    req: Request,
    res: Response,
    query: FilterQuery<T>
  ): Promise<Response> {
    const options: PaginateOptions = {
      sort: req.query.sortBy ? req.query.sortBy : {},
      page: req.query.page ? +req.query.page : 1,
      limit: req.query.limit ? +req.query.limit : 10,
      pagination: req.query.pagination
        ? checkBooleanFromString(req.query.pagination)
        : true,
    };

    return generalHandler(req, res, async () => {
      const result = await this.service.findAll(query, options);

      return res.status(200).send({
        data: result,
        query,
        options,
      });
    });
  }

  /**
   * A handler for deleteById
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<Response>}
   */
  public async deleteByIdHandler(
    req: Request,
    res: Response
  ): Promise<Response> {
    return generalHandler(req, res, async () => {
      /* Exec query, pop item into const */
      const id = req.params.id;
      const item = await this.service.deleteById(id);

      /* Item not existed */
      if (!item) {
        return res.status(404).send({
          message: `${this.service.name} not found`,
        });
      }

      /* If existed */
      return res.status(200).send({
        data: item,
        message: `${this.service.name} deleted successfully`,
      });
    });
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
    return generalHandler(req, res, async () => {
      /* Exec query, pop item into const */
      const id = req.params.id;
      const item = await this.service.updateById(id, req.body);

      /* Item not existed */
      if (!item) {
        return res.status(404).send({
          message: `${this.service.name} not found`,
        });
      }

      /* If existed */
      return res.status(200).send({
        data: item,
        message: `${this.service.name} updated successfully`,
      });
    });
  }
}
