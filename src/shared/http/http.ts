import * as querystring from "querystring";
import { HttpMethodEnum } from "./http-method-enum";
import { Request } from "./request";
import { ResponseInterface } from "./response-interface";

type ParamType = { [key: string]: string };

export class Http {
  private headers: { [key: string]: any } = {};

  private token?: string;

  private bearerToken?: string;

  private basicAuth?: string;

  private timeoutSeconds?: number;

  private retryTimes?: number;

  private params: ParamType[] = [];

  private _url?: string | undefined;

  public get url(): string | undefined {
    return this._url;
  }

  public set url(value: string) {
    this._url = value;
  }

  public withToken(token: string): this {
    this.token = token;
    return this;
  }

  public withHeaders(headers: { [key: string]: any }): this {
    this.headers = headers;
    return this;
  }

  public withBearerToken(token: string): this {
    this.bearerToken = `Bearer ${token}`;
    return this;
  }

  public withBasicAuth(token: string): this {
    this.basicAuth = `Basic ${token}`;
    return this;
  }

  public param(params: ParamType): this {
    this.params.push(params);
    return this;
  }

  private buildParams(): string {
    const params = this.params.map((param) => querystring.stringify(param));
    return params.join("&");
  }

  public timeout(seconds: number): this {
    this.timeoutSeconds = seconds;
    return this;
  }

  public retry(times: number): this {
    this.retryTimes = times;
    return this;
  }

  private makeHeaders() {
    const headers = this.headers;

    if (this.token) {
      headers.token = this.token;
    }

    if (this.bearerToken) {
      this.headers.Authorization = this.bearerToken;
    }

    if (this.basicAuth) {
      this.headers.Authorization = this.basicAuth;
    }

    return headers;
  }

  private makeRetry() {
    return this.retryTimes ?? 0;
  }

  private makeTimeOut() {
    return this.timeoutSeconds ?? 30000;
  }

  public async get<T = any>(path: string): Promise<ResponseInterface<T>> {
    const request = new Request();
    request.headers = this.makeHeaders();
    request.retry = this.makeRetry();
    request.timeout = this.makeTimeOut();

    return request.execute<T>(
      HttpMethodEnum.GET,
      this.params.length
        ? `${this._url}${path}?${this.buildParams()}`
        : `${this._url}${path}`,
    );
  }

  public async post<T = any>(
    path: string,
    data: any,
  ): Promise<ResponseInterface<T>> {
    const request = new Request();
    request.headers = this.makeHeaders();
    request.retry = this.makeRetry();
    request.timeout = this.makeTimeOut();

    return request.execute<T>(
      HttpMethodEnum.POST,
      this.params.length
        ? `${this._url}${path}?${this.buildParams()}`
        : `${this._url}${path}`,
      data,
    );
  }

  public async put<T = any>(
    path: string,
    data: any,
  ): Promise<ResponseInterface<T>> {
    const request = new Request();
    request.headers = this.makeHeaders();
    request.retry = this.makeRetry();
    request.timeout = this.makeTimeOut();
    return request.execute<T>(HttpMethodEnum.PUT, `${this._url}${path}`, data);
  }

  public async patch<T = any>(
    path: string,
    data: any,
  ): Promise<ResponseInterface<T>> {
    const request = new Request();
    request.headers = this.makeHeaders();
    request.retry = this.makeRetry();
    request.timeout = this.makeTimeOut();
    return request.execute<T>(
      HttpMethodEnum.PATCH,
      `${this._url}${path}`,
      data,
    );
  }

  public async delete<T = any>(path: string): Promise<ResponseInterface<T>> {
    const request = new Request();
    request.headers = this.makeHeaders();
    request.retry = this.makeRetry();
    request.timeout = this.makeTimeOut();
    return request.execute<T>(HttpMethodEnum.DELETE, `${this._url}${path}`);
  }
}
