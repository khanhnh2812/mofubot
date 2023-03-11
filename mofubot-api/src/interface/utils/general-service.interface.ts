import {
  Document,
  DocumentDefinition,
  FilterQuery,
  PaginateModel,
  PaginateOptions,
  PaginateResult,
  UpdateQuery,
} from 'mongoose';

export interface IGeneralService<T extends Document> {
  name: string;
  model: PaginateModel<T>;
  create(body: DocumentDefinition<T>): Promise<T>;
  findByQuery(query: FilterQuery<T>): Promise<T>;
  findById(id: string): Promise<T>;
  isExisted(key: string, value: any): Promise<boolean>;
  deleteById(id: string): Promise<T>;
  updateById(id: string, body: UpdateQuery<T>): Promise<T>;
  findAll(
    query: FilterQuery<T>,
    options: PaginateOptions
  ): Promise<PaginateResult<T>>;
}
