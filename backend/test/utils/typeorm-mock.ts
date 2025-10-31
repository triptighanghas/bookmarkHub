export const mockRepository = () => ({
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    create: jest.fn(),
    query: jest.fn(),
  });
  