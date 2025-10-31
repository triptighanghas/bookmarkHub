import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../src/users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/users/user.entity';
import { mockRepository } from './utils/typeorm-mock';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
  const repo = mockRepository();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: repo },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should create user with hashed password', async () => {
    repo.findOne.mockResolvedValue(null);
    repo.save.mockResolvedValue({ id: 1, email: 'test@example.com' });

    const user = await service.create('test@example.com', 'password123');
    expect(repo.save).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'test@example.com',
        password_hash: expect.any(String),
      }),
    );
    expect(user.id).toBe(1);
  });

  it('should throw error if email exists', async () => {
    repo.findOne.mockResolvedValue({ id: 1 });
    await expect(service.create('exists@example.com', 'pass'))
      .rejects.toThrow('Email already exists');
  });

  it('should find user by email', async () => {
    repo.findOne.mockResolvedValue({ id: 2, email: 'me@example.com' });
    const user = await service.findByEmail('me@example.com');
    expect(user.email).toBe('me@example.com');
  });
});
