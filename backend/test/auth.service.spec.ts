import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../src/authentication/auth.service';
import { UsersService } from '../src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  const usersService = {
    create: jest.fn(),
    findByEmail: jest.fn(),
  };
  const jwtService = { signAsync: jest.fn().mockResolvedValue('fake-jwt') };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should register new user and return token', async () => {
    usersService.create.mockResolvedValue({ id: 1, email: 'x@y.com' });
    const result = await service.register('x@y.com', 'pass');
    expect(result.token).toBe('fake-jwt');
  });

  it('should login with valid credentials', async () => {
    const password = await bcrypt.hash('123456', 10);
    usersService.findByEmail.mockResolvedValue({
      id: 1,
      email: 'x@y.com',
      password_hash: password,
    });
    const result = await service.login('x@y.com', '123456');
    expect(result.token).toBe('fake-jwt');
  });

  it('should reject invalid password', async () => {
    const hash = await bcrypt.hash('correct', 10);
    usersService.findByEmail.mockResolvedValue({ password_hash: hash });
    await expect(service.login('x@y.com', 'wrong'))
      .rejects.toThrow('Invalid email or password');
  });

  it('should reject nonexistent user', async () => {
    usersService.findByEmail.mockResolvedValue(null);
    await expect(service.login('no@user.com', '123'))
      .rejects.toThrow('Invalid email or password');
  });
});
