import { IAppSetup } from '@/interface/utils/app-setup.interface';
import { MofuController } from '@/controllers/mofu.controller';
import { Service } from 'typedi';

@Service()
export class MofuRoutes implements IAppSetup {
  constructor(private controller: MofuController) {}

  public setup(app) {
    app.get(
      `/${this.controller.service.name}/id/:id`,
      this.controller.getDataByIdHandler.bind(this.controller)
    );

    app.get(
      `/${this.controller.service.name}/alias/:alias`,
      this.controller.getDataByAliasHandler.bind(this.controller)
    );
  }
}
