import axios, { AxiosError, AxiosInstance } from "axios";
import { HttpMethodEnum } from "./http-method-enum";
import { Response } from "./response";
import { ResponseInterface } from "./response-interface";
import axiosRetry from "axios-retry";

export class Request {
  private _headers: { [key: string]: any } = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  private _timeout = 30000;

  private _retry = 0;

  public set headers(value: { [p: string]: any }) {
    this._headers = Object.assign(this._headers, value);
  }

  public set timeout(value: number) {
    this._timeout = value;
  }

  public set retry(value: number) {
    this._retry = value;
  }

  public async execute<T>(
    method: HttpMethodEnum,
    url: string,
    data?: any,
  ): Promise<ResponseInterface> {
    try {
      const request = axios.create({
        headers: this._headers,
        timeout: this._timeout,
      });

      this.configRetry(request);

      const response = Request.isInputMethod(method)
        ? await request[method](url, data)
        : await request[method](url);

      return new Response<T>(response);
    } catch (e) {
      if ((e as any)?.isAxiosError && (e as any).response) {
        return new Response<T>((e as any).response);
      }

      process.stdout.write(`Request error: ${e}\n`);
      throw e;
    }
  }

  private configRetry(instance: AxiosInstance): void {
    if (this._retry) {
      axiosRetry(instance, {
        retries: this._retry,
        shouldResetTimeout: true,
        retryCondition: (error) => {
          process.stdout.write(
            `Retrying a request. Reason: ${error?.message}\n`,
          );
          return !error.response;
        },
      });
    }
  }

  private static isInputMethod(method: HttpMethodEnum): boolean {
    return [
      HttpMethodEnum.POST,
      HttpMethodEnum.PUT,
      HttpMethodEnum.PATCH,
      HttpMethodEnum.DELETE,
    ].includes(method);
  }
}
