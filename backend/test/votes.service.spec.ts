import { Test, TestingModule } from '@nestjs/testing';
import { VotesService } from '../src/votes/votes.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Vote } from '../src/votes/vote.entity';
import { mockRepository } from './utils/typeorm-mock';

describe('VotesService', () => {
  let service: VotesService;
  const repo = mockRepository();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VotesService,
        { provide: getRepositoryToken(Vote), useValue: repo },
      ],
    }).compile();

    service = module.get<VotesService>(VotesService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should add a new vote', async () => {
    repo.findOne.mockResolvedValue(null);
    repo.save.mockResolvedValue({ id: 1 });
    const result = await service.vote(1, 1, 1);
    expect(result.message).toBe('Vote added');
  });

  it('should remove vote if same value clicked again', async () => {
    repo.findOne.mockResolvedValue({ id: 1, value: 1 });
    const result = await service.vote(1, 2, 1);
    expect(repo.remove).toHaveBeenCalled();
    expect(result.message).toBe('Vote removed');
  });

  it('should switch vote from upvote to downvote', async () => {
    repo.findOne.mockResolvedValue({ id: 2, value: 1 });
    repo.save.mockResolvedValue({ id: 2, value: -1 });
    const result = await service.vote(1, 2, -1);
    expect(result.message).toBe('Vote updated');
  });
});
