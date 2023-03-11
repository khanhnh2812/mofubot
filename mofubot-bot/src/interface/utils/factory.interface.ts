export interface IFactory<T> {
  instance: T;
  create(): void;
}
