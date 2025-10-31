import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../src/authentication/auth.controller';
import { AuthService } from '../src/authentication/auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should register user and return token', async () => {
    mockAuthService.register.mockResolvedValue({ token: 'abc123' });
    const res = await controller.register({ email: 'test@x.com', password: '123456' });
    expect(res.token).toBe('abc123');
  });

  it('should login user and return token', async () => {
    mockAuthService.login.mockResolvedValue({ token: 'xyz789' });
    const res = await controller.login({ email: 'test@x.com', password: '123456' });
    expect(res.token).toBe('xyz789');
  });
});
