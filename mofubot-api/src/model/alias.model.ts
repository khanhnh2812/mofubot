import * as mongoosePaginate from 'mongoose-paginate-v2';

import { PaginateModel, Schema, model } from 'mongoose';

import { IAliasDocument } from '@/interface/document/alias.document';

const schema = new Schema(
  {
    alias: {
      type: String,
      required: true,
    },
    prc_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Apply plugin
schema.plugin(mongoosePaginate);

export default model('Alias', schema) as PaginateModel<IAliasDocument>;
