import { adaptRoute } from '../../../src/shared/adapters/express-route-adapter';
import { Request, Response } from 'express';

describe('adaptRoute', () => {
  it('should call controller and respond with correct status and body', async () => {
    const req = {} as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any as Response;
    const controller = { handle: jest.fn().mockResolvedValue({ statusCode: 201, body: { foo: 'bar' } }) };

    const route = adaptRoute(controller);
    await route(req, res);

    expect(controller.handle).toHaveBeenCalledWith(req);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ foo: 'bar' });
  });

  it('should handle different statusCode and body', async () => {
    const req = {} as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any as Response;
    const controller = { handle: jest.fn().mockResolvedValue({ statusCode: 404, body: { error: 'not found' } }) };

    const route = adaptRoute(controller);
    await route(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'not found' });
  });
}); 