import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vote } from './vote.entity';

@Injectable()
export class VotesService {
  constructor(@InjectRepository(Vote) private repo: Repository<Vote>) {}

  async vote(userId: number, bookmarkId: number, value: number) {
    const existing = await this.repo.findOne({
      where: { user: { id: userId }, bookmark: { id: bookmarkId } },
      relations: ['user', 'bookmark'],
    });

    if (existing && existing.value === value) {
      await this.repo.remove(existing);
      return { message: value === 1 ? 'Upvote removed' : 'Downvote removed', };
    }

    if (existing) {
      existing.value = value;
      await this.repo.save(existing);
      return { message: value === 1 ? 'Changed to upvote' : 'Changed to downvote', };
    }

    await this.repo.save({ user: { id: userId }, bookmark: { id: bookmarkId }, value });
    return { message: value === 1 ? 'Upvote added' : 'Downvote added', };
  }
}
