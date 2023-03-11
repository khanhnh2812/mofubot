import { ALIAS_POST_PAYLOAD } from '@/schema/alias.schema';
import { AliasController } from '@/controllers/alias.controller';
import { GeneralRoutes } from './general.routes';
import { IAliasDocument } from '@/interface/document/alias.document';
import { Service } from 'typedi';

@Service()
export class AliasRoutes extends GeneralRoutes<IAliasDocument> {
  constructor(aliasController: AliasController) {
    super(aliasController);
    this.postSchema = ALIAS_POST_PAYLOAD;
  }
}
