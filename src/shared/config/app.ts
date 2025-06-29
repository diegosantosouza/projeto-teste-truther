import express, { json } from 'express';
import { mainRouter } from '@/router';
import { errorHandlerMiddleware } from '../adapters';

class App {
  public express = express();
  constructor() {
    this.middlewares();
    this.routes();
    this.errorHandlers();
  }

  private middlewares(): void {
    this.express.use(json());
  }

  private routes(): void {
    this.express.use(mainRouter);
  }

  private errorHandlers(): void {
    this.express.use(errorHandlerMiddleware);
  }
}
export default new App().express;
