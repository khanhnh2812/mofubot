import { Document } from 'mongoose';
import { IAppSetup } from '@/interface/utils/app-setup.interface';
import { ID_PAYLOAD_PARAMS } from '@/schema/general.schema';
import { IGeneralController } from '@/interface/utils/general-controller.interface';
import { Inject } from 'typedi';
import { RequestValidatorMiddleware } from '@/middlewares/request-validator.middleware';

export class GeneralRoutes<T extends Document> implements IAppSetup {
  @Inject() private requestValidator: RequestValidatorMiddleware;
  public getSchema;
  public postSchema;

  constructor(private controller: IGeneralController<T>) {}

  public setup(app) {
    app
      .route(`/${this.controller.service.name}`)
      .get(
        this.requestValidator.next(this.getSchema),
        this.controller.findAllHandler.bind(this.controller)
      )
      .post(
        this.requestValidator.next(this.postSchema),
        this.controller.createHandler.bind(this.controller)
      );

    app
      .route(`/${this.controller.service.name}/:id`)
      .get(
        this.requestValidator.next(ID_PAYLOAD_PARAMS),
        this.controller.findByIdHandler.bind(this.controller)
      )
      .delete(
        this.requestValidator.next(ID_PAYLOAD_PARAMS),
        this.controller.deleteByIdHandler.bind(this.controller)
      )
      .put(
        this.requestValidator.next(this.postSchema),
        this.requestValidator.next(ID_PAYLOAD_PARAMS),
        this.controller.updateByIdHandler.bind(this.controller)
      );
  }
}
