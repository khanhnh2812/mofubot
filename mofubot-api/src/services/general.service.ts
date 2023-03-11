import {
  Document,
  DocumentDefinition,
  FilterQuery,
  PaginateModel,
  PaginateOptions,
  PaginateResult,
  UpdateQuery,
  isValidObjectId,
} from 'mongoose';

import { IGeneralService } from '@/interface/utils/general-service.interface';

export class GeneralService<T extends Document> implements IGeneralService<T> {
  public model: PaginateModel<T>;
  public name: string;

  constructor(model: PaginateModel<T>) {
    this.model = model;
  }

  /**
   * Create a new item in db
   * @param {DocumentDefinition<T>} body - body info
   * @returns {Promise<T>} Result of create new item
   */
  public async create(body: DocumentDefinition<T>): Promise<T> {
    try {
      const res = await this.model.create(body);
      return res as T;
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * Find an item with provided query
   * @param {FilterQuery<T>} query - Query to search
   * @returns {Promise<T>} Result of findOne(query)
   */
  public async findByQuery(query: FilterQuery<T>): Promise<T> {
    return this.model.findOne(query).lean<T>();
  }

  /**
   * Find an item with provided id
   * @param {string | ObjectId} id - MongoDB ObjectId
   * @returns {Promise<T>} result of findById
   */
  public async findById(id: string): Promise<T> {
    // Sanitizing
    if (!id || !isValidObjectId(id)) return;

    const res = await this.model.findById(id);
    return res as T;
  }

  /**
   * Check if a value of a key is unique of not
   * @param {string} key - Key to check for uniqueness
   * @param {any} value - Corresponding value to check
   * @returns {Promise<boolean>} True if existed, false if not
   */
  public async isExisted(key: string, value: any): Promise<boolean> {
    // Sanitizer
    if (!key) return false;

    const item = await this.findByQuery({
      [key]: value,
    } as FilterQuery<T>);

    return !!item;
  }

  /**
   * Delete a item with provided id
   * @param {string | ObjectId} id
   * @returns {Promise<T>} Result of findByIdAndDelete
   * @description Find an item with provided id and delete it
   */
  public async deleteById(id: string): Promise<T> {
    /* Sanitizing */
    if (!id || !isValidObjectId(id)) return;

    const res = await this.model.findByIdAndDelete(id);
    return res as T;
  }

  /**
   * Find an item with provided id and update with provided UpdateQuery
   * @param {string | ObjectId} id - MongoDB ObjectId
   * @param {UpdateQuery<T>} body - fields to update
   * @returns {Promise<T>} Result of findByIdAndUpdate
   */
  public async updateById(id: string, body: UpdateQuery<T>): Promise<T> {
    /* Sanitizing */
    if (!id || !isValidObjectId(id)) return;

    const res = await this.model.findByIdAndUpdate(id, body, { new: true });
    return res as T;
  }

  /**
   * @param {FilterQuery<T>} query - MongoDB query
   * @param {PaginateOptions} options - mongoose-paginate-v2 options
   * @returns {Promise<PaginateResult<T>>} result of paginate
   */
  public async findAll(
    query: FilterQuery<T>,
    options: PaginateOptions
  ): Promise<PaginateResult<T>> {
    return this.model.paginate(query, options);
  }
}
