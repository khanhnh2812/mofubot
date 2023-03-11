import { GeneralService } from './general.service';
import { IAliasDocument } from '@/interface/document/alias.document';
import { Service } from 'typedi';
import model from '@/model/alias.model';

@Service()
export class AliasService extends GeneralService<IAliasDocument> {
  public name: string = 'Alias';

  constructor() {
    super(model);
  }

  /**
   * Check if an alias is existed for alias
   * @param {string} alias - Provided alias's alias
   * @returns {Promise<boolean>} True if existed, false if not
   */
  public async isExistedByAlias(alias: string): Promise<boolean> {
    return this.isExisted('alias', alias);
  }

  /**
   * Find an alias by alias
   * @param {string} alias - Provided alias's alias
   * @returns {Promise<IAliasDocument>} Found alias
   */
  public async getAliasByAlias(alias: string): Promise<IAliasDocument> {
    return this.findByQuery({ alias });
  }
}
