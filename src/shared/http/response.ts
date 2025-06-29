import { AxiosResponse } from "axios";
import { ResponseInterface } from "./response-interface";
import { RequestException } from "./request-exception";

export class Response<T = any> implements ResponseInterface {
  private response: AxiosResponse;

  constructor(response: AxiosResponse) {
    this.response = response;
  }

  public body(): string {
    return JSON.stringify(this.response.data);
  }

  public json(): T {
    return this.response.data as T;
  }

  public status(): number {
    return this.response.status;
  }

  public ok(): boolean {
    return this.response.status >= 200 && this.response.status < 300;
  }

  public successful(): boolean {
    return this.ok();
  }

  public failed(): boolean {
    return !this.ok();
  }

  public serverError(): boolean {
    return this.response.status >= 500 && this.response.status < 600;
  }

  public clientError(): boolean {
    return this.response.status >= 400 && this.response.status < 500;
  }

  public header(header: string): string {
    return this.response.headers[header] as string;
  }

  public headers(): object {
    return this.response.headers;
  }

  public throw(): this {
    if (this.serverError() || this.clientError()) {
      throw new RequestException(this);
    }

    return this;
  }
}
