import { Express } from 'express';

export interface IAppSetup {
  setup(app: Express): void;
}
