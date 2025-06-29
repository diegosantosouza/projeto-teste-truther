import {
  badRequest,
  forbidden,
  notFound,
  unauthorized,
  serverError,
  ok,
  noContent,
  response,
  created,
} from '../../../src/shared/helpers/http-helper';
import { ServerError, UnauthorizedError } from '../../../src/shared/errors';

describe('http-helper', () => {
  it('badRequest should return 400 and error', () => {
    const error = { foo: 'bar' };
    expect(badRequest(error)).toEqual({ statusCode: 400, body: error });
  });

  it('forbidden should return 403 and error', () => {
    const error = new Error('forbidden');
    expect(forbidden(error)).toEqual({ statusCode: 403, body: error });
  });

  it('notFound should return 404 and message', () => {
    expect(notFound()).toEqual({ statusCode: 404, body: 'Not Found' });
    expect(notFound('custom')).toEqual({ statusCode: 404, body: 'custom' });
  });

  it('unauthorized should return 401 and UnauthorizedError', () => {
    const result = unauthorized();
    expect(result.statusCode).toBe(401);
    expect(result.body).toBeInstanceOf(UnauthorizedError);
  });

  it('serverError should return 500 and ServerError', () => {
    const error = new Error('fail');
    const result = serverError(error);
    expect(result.statusCode).toBe(500);
    expect(result.body).toBeInstanceOf(ServerError);
    expect(result.body.stack).toBe(error.stack);
  });

  it('ok should return 200 and data', () => {
    expect(ok({ foo: 1 })).toEqual({ statusCode: 200, body: { foo: 1 } });
    expect(ok()).toEqual({ statusCode: 200, body: undefined });
  });

  it('noContent should return 204 and null', () => {
    expect(noContent()).toEqual({ statusCode: 204, body: null });
  });

  it('response should return custom status and body', () => {
    expect(response(418, { tea: true })).toEqual({ statusCode: 418, body: { tea: true } });
    expect(response(201)).toEqual({ statusCode: 201, body: undefined });
  });

  it('created should return 201 and data', () => {
    expect(created({ foo: 2 })).toEqual({ statusCode: 201, body: { foo: 2 } });
    expect(created()).toEqual({ statusCode: 201, body: undefined });
  });
}); 