import express from 'express';
jest.mock('express');

const useMock = jest.fn();
const jsonMock = jest.fn();
const routerMock = {
  get: jest.fn(),
  post: jest.fn(),
  patch: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  use: jest.fn(),
};
(express as unknown as jest.Mock).mockReturnValue({ use: useMock });
(express.json as unknown as jest.Mock) = jsonMock;
(express.Router as unknown as jest.Mock) = jest.fn(() => routerMock);

describe('App config', () => {
  beforeEach(() => {
    useMock.mockClear();
    jsonMock.mockClear();
    Object.values(routerMock).forEach(fn => (fn as jest.Mock).mockClear());
  });

  it('should create an express app and register middlewares, routes and error handler', () => {
    jest.isolateModules(() => {
      const app = require('../../../src/shared/config/app').default;
      expect(app).toBeDefined();
      expect(useMock).toHaveBeenCalledTimes(3);
      // 1st: json middleware, 2nd: mainRouter, 3rd: errorHandlerMiddleware
    });
  });
}); 