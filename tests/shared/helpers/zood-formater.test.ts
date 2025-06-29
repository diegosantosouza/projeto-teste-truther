import { formatZodError } from '../../../src/shared/helpers/zood-formater';

describe('formatZodError', () => {
  it('should format flat Zod error', () => {
    const zodError = {
      format: () => ({
        _errors: ['Invalid root', 'rootValue'],
      }),
    };
    const result = formatZodError(zodError);
    expect(result).toEqual([
      { message: 'Invalid root', field: 'root', received: 'rootValue' },
    ]);
  });

  it('should format nested Zod error', () => {
    const zodError = {
      format: () => ({
        _errors: [],
        user: {
          _errors: ['Invalid user', 'userValue'],
          name: {
            _errors: ['Invalid name', 'nameValue'],
          },
        },
      }),
    };
    const result = formatZodError(zodError);
    expect(result).toEqual([
      { message: 'Invalid user', field: 'user', received: 'userValue' },
      { message: 'Invalid name', field: 'user.name', received: 'nameValue' },
    ]);
  });
}); 