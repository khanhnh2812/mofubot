import { object, string } from 'yup';

const ID_PARAMS = {
  params: object({
    id: string().required('Id is required'),
  }),
};

export const ID_PAYLOAD_PARAMS = object({ ...ID_PARAMS });
