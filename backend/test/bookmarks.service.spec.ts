import { Test, TestingModule } from '@nestjs/testing';
import { BookmarksService } from '../src/bookmarks/bookmarks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Bookmark } from '../src/bookmarks/bookmark.entity';
import { mockRepository } from './utils/typeorm-mock';
import { BadRequestException } from '@nestjs/common';

describe('BookmarksService', () => {
  let service: BookmarksService;
  const repo = mockRepository();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookmarksService,
        { provide: getRepositoryToken(Bookmark), useValue: repo },
      ],
    }).compile();

    service = module.get<BookmarksService>(BookmarksService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should create valid bookmark', async () => {
    repo.save.mockResolvedValue({ id: 1, title: 'NestJS', url: 'https://nestjs.com' });
    const result = await service.create('NestJS', 'https://nestjs.com', { id: 1 });
    expect(repo.save).toHaveBeenCalled();
    expect(result.id).toBe(1);
  });

  it('should throw error for invalid URL', async () => {
    await expect(service.create('Invalid', 'ftp://link.com', { id: 1 }))
      .rejects.toThrow(BadRequestException);
  });

  it('should query bookmarks with votes', async () => {
    repo.query.mockResolvedValue([{ id: 1, title: 'Test', vote_count: 2 }]);
    const result = await service.findAllWithVotes(1);
    expect(result[0].vote_count).toBe(2);
  });
});
