import Container, { Service, ServiceNotFoundError } from 'typedi';
import { getDirectories, getFiles } from '@/utils/path';

import { Express } from 'express';
import { ExpressFactory } from '@/factory/express.factory';
import { IAppSetup } from '@/interface/utils/app-setup.interface';
import { ISetup } from '@/interface/utils/setup.interface';
import { resolve } from 'path';

@Service()
export class RoutesSetup implements ISetup {
  private app: Express;

  public setup() {
    this.app = Container.get(ExpressFactory).instance;

    const helper = (app: Express) => {
      // Get directories
      const path = 'src';
      const directories = getDirectories(path);

      // Auto import
      directories.forEach((directory) => {
        /* Get all files */
        const directoryPath = resolve(path, directory);
        const files = getFiles(directoryPath).filter((fileName) =>
          fileName.endsWith('routes.ts')
        );
        /* Import file */
        if (files.length === 0) return;

        files.forEach((file) => {
          try {
            const filePath = resolve(directoryPath, file);
            const routeSetupExport = require(filePath);
            const routeSetupClass =
              routeSetupExport[Object.keys(routeSetupExport)[0]];
            const routeSetupInstance =
              Container.get<IAppSetup>(routeSetupClass);
            const fn = routeSetupInstance.setup.bind(routeSetupInstance);

            /* Sanitize and call to avoid wrong file */
            if (fn) fn(app);
          } catch (e) {
            // Not a service registered with container
            // Aka generic -> ignore
            if (e instanceof ServiceNotFoundError) return;

            console.error(e);
          }
        });
      });
    };

    helper(this.app);
  }
}
