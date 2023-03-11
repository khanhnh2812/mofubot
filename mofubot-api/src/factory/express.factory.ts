import * as cors from 'cors';
import * as express from 'express';

import { Express, json, urlencoded } from 'express';

import { IFactory } from '@/interface/utils/factory.interface';
import { MongooseSetup } from '@/setup/mongoose.setup';
import { RoutesSetup } from '@/setup/routes.setup';
import { Service } from 'typedi';

@Service()
export class ExpressFactory implements IFactory<Express> {
  public instance: Express;

  constructor(
    private mongooseSetup: MongooseSetup,
    private routesSetup: RoutesSetup
  ) {}

  /**
   * Setup and save express instance
   * @returns {Express} app - Express instance
   */
  public create(): Express {
    // Create new express instance
    this.instance = express();

    // Use parser middleware
    this.initUrlEncoded(this.instance);
    this.initJson(this.instance);
    this.initCors(this.instance);

    // Get data from env
    const port: number = +process.env.PORT ?? 3000;
    const host: string = process.env.HOST ?? 'localhost';

    this.instance.listen(port, host, () => {
      console.log(
        'Server is running on port more than 2 and less than 4 x 1000'
      );

      // Setup database
      this.mongooseSetup.setup();

      // Setup routes
      this.routesSetup.setup();
    });

    // Return
    return this.instance;
  }

  /**
   * Initialized url encoded middleware for express
   * @param {Express} app
   */
  private initUrlEncoded(app: Express) {
    // Sanitizer
    if (!app) return;

    app.use(
      urlencoded({
        extended: true,
      })
    );
  }

  /**
   * Initialized json middleware for express
   * @param {Express} app
   */
  private initJson(app: Express) {
    // Sanitizer
    if (!app) return;
    app.use(json());
  }

  /**
   * Initialized cors middleware for express
   * @param {Express} app
   */
  private initCors(app: Express) {
    // Sanitizer
    if (!app) return;
    app.use(cors());
  }
}
