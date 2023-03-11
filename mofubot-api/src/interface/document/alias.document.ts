import { Document } from 'mongoose';

export interface IAliasDocument extends Document {
  name: string;
  prc_id: string;
}
