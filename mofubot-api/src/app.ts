import 'reflect-metadata';

import * as dotenv from 'dotenv';

import Container from 'typedi';
import { ExpressFactory } from './factory/express.factory';

// Setup dotenv
dotenv.config();

Container.get(ExpressFactory).create();
