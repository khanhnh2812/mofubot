import { object, string } from 'yup';

export const ALIAS_POST_PAYLOAD = object({
  body: object({
    prc_id: string().required('prc_id is required'),
    alias: string().required('alias is required'),
  }),
});
