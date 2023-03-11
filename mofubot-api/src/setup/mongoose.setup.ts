import * as mongoose from 'mongoose';

import { ISetup } from '@/interface/utils/setup.interface';
import { Service } from 'typedi';

@Service()
export class MongooseSetup implements ISetup {
  public setup() {
    // Get config
    // You may ask why require here
    // Cause require in typescript suck, so we polyfill node require here
    // And require to avoid no dotenv
    const url = require('@/config/database.config').default;

    mongoose
      .connect(url, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log('Successfully connected to the database');
      })
      .catch((err) => {
        console.log('Could not connect to the database. Exiting now...', err);
        process.exit(1);
      });
  }
}
