export class MofuNotFoundError extends Error {
  public name = 'MofuNotFoundError';

  constructor(message = '') {
    super(message);
    Object.setPrototypeOf(this, MofuNotFoundError.prototype);
  }
}

export class AliasNotFoundError extends Error {
  public name = 'AliasNotFoundError';

  constructor(message = '') {
    super(message);
    Object.setPrototypeOf(this, AliasNotFoundError.prototype);
  }
}
