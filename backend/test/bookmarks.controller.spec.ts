import { Test, TestingModule } from '@nestjs/testing';
import { BookmarksController } from '../src/bookmarks/bookmarks.controller';
import { BookmarksService } from '../src/bookmarks/bookmarks.service';
import { JwtAuthGuard } from '../src/common/guards/jwt-auth.guard';

describe('BookmarksController', () => {
  let controller: BookmarksController;
  const mockService = {
    getAll: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookmarksController],
      providers: [{ provide: BookmarksService, useValue: mockService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<BookmarksController>(BookmarksController);
  });

  it('should fetch bookmarks', async () => {
    mockService.findAllWithVotes = jest.fn().mockResolvedValue([{ id: 1 }]);
    const result = await controller.getAll({ user: { sub: 1 } });
    expect(result[0].id).toBe(1);
  });

  it('should create bookmark', async () => {
    mockService.create = jest.fn().mockResolvedValue({ id: 5, title: 'NestJS' });
    const res = await controller.create({ title: 'NestJS', url: 'https://nestjs.com' }, { user: { sub: 1 } });
    expect(res.id).toBe(5);
  });
});
