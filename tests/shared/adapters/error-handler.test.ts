import { errorHandlerMiddleware } from '../../../src/shared/adapters/error-handler';
import { Request, Response, NextFunction } from 'express';
import { Log } from '../../../src/shared/logger/log';
import * as helpers from '../../../src/shared/helpers';

jest.mock('../../../src/shared/helpers', () => ({
  ...jest.requireActual('../../../src/shared/helpers'),
  formatZodError: jest.fn(),
}));

describe('errorHandlerMiddleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    req = {};
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    res = { status: statusMock };
    next = jest.fn();
    jest.spyOn(Log, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should handle generic error with default status and message', () => {
    const err = new Error('Some error');
    errorHandlerMiddleware(err, req as Request, res as Response, next);
    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({ message: 'Some error', paramsError: undefined, extraData: undefined });
    expect(Log.error).toHaveBeenCalledWith(expect.stringContaining('[500] - Some error'), expect.any(Object));
  });

  it('should handle error with custom status and message', () => {
    const err = { message: 'Custom error', status: 401 };
    errorHandlerMiddleware(err, req as Request, res as Response, next);
    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith({ message: 'Custom error', paramsError: undefined, extraData: undefined });
    expect(Log.error).toHaveBeenCalledWith(expect.stringContaining('[401] - Custom error'), expect.any(Object));
  });

  it('should handle error with extraData', () => {
    const err = { message: 'Error with extra', status: 400, extraData: { foo: 'bar' } };
    errorHandlerMiddleware(err, req as Request, res as Response, next);
    expect(jsonMock).toHaveBeenCalledWith({ message: 'Error with extra', paramsError: undefined, extraData: { foo: 'bar' } });
  });

  it('should handle error with props as extraData', () => {
    const err = { message: 'Error with props', status: 400, props: { bar: 'baz' } };
    errorHandlerMiddleware(err, req as Request, res as Response, next);
    expect(jsonMock).toHaveBeenCalledWith({ message: 'Error with props', paramsError: undefined, extraData: { bar: 'baz' } });
  });

  it('should handle ZodError and format paramsError', () => {
    (helpers.formatZodError as jest.Mock).mockReturnValue([
      { field: 'field', message: 'invalid', received: 'foo' }
    ]);
    const err = { name: 'ZodError', errors: [], message: 'zod', status: 422 };
    errorHandlerMiddleware(err, req as Request, res as Response, next);
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      message: 'Validation Error',
      paramsError: {
        errors: [
          { field: 'field', message: 'invalid', received: 'foo' }
        ]
      },
      extraData: undefined,
    });
    expect(helpers.formatZodError).toHaveBeenCalledWith(err);
  });
}); 