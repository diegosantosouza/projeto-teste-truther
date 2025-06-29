export interface ResponseInterface<T = any> {
  items?: any;
  hasNextPage?: any;
  body(): string;
  json(): T;
  status(): number;
  ok(): boolean;
  successful(): boolean;
  failed(): boolean;
  serverError(): boolean;
  clientError(): boolean;
  throw(): this;
  header(header: string): string;
  headers(): object;
}
