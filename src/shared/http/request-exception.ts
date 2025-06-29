import { ResponseInterface } from "./response-interface";

export class RequestException extends Error {
  public response: ResponseInterface;

  constructor(response: ResponseInterface) {
    super(`HTTP request returned status code ${response.status()}.`);
    this.response = response;
  }
}
