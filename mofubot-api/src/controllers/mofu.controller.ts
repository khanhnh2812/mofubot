import { Request, Response } from 'express';
import { commonErrorLog, generalHandler } from '@/utils';

import { AliasService } from '@/services/alias.service';
import { MofuNotFoundError } from '@/utils/error';
import { MofuService } from '@/services/mofu.service';
import { Service } from 'typedi';

@Service()
export class MofuController {
  constructor(
    public service: MofuService,
    private aliasService: AliasService
  ) {}

  /**
   * A handler for getDataById
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<Response>}
   */
  public async getDataByIdHandler(
    req: Request,
    res: Response
  ): Promise<Response> {
    return this.getDataById(req.params.id, res);
  }

  /**
   * A handler for getDataByAlias
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<Response>}
   */
  public async getDataByAliasHandler(
    req: Request,
    res: Response
  ): Promise<Response> {
    return generalHandler(req, res, async () => {
      const alias = req.params.alias;
      const prc_id = (await this.aliasService.getAliasByAlias(alias))?.prc_id;

      if (!prc_id)
        return res.status(500).send({
          message: `Cannot find alias ${alias}`,
        });

      return this.getDataById(prc_id, res);
    });
  }

  public async getDataById(id, res) {
    try {
      const data = await this.service.getDataById(id);
      return res.status(200).send(data);
    } catch (e) {
      if (e instanceof MofuNotFoundError)
        return res.status(500).send({
          message: 'Cannot find prc user with provided id',
        });
      commonErrorLog(res, e);
    }
  }
}
