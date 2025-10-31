import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vote } from './vote.entity';
import { Bookmark } from '../bookmarks/bookmark.entity';
import { User } from '../users/user.entity';

@Injectable()
export class VotesService {
  private readonly logger = new Logger(VotesService.name);

  constructor(@InjectRepository(Vote) private repo: Repository<Vote>,
  @InjectRepository(Bookmark) private readonly bookmarkRepo: Repository<Bookmark>,
  @InjectRepository(User) private readonly userRepo: Repository<User>,) {}

  async vote(userId: number, bookmarkId: number, value: number) {
    this.logger.log(`Processing vote for userId=${userId} on bookmarkId=${bookmarkId}`);

    if (![1, -1].includes(value)) {
      this.logger.warn(`Invalid vote value: ${value}`);
      throw new BadRequestException('Vote value must be either 1 or -1');
    }

    const bookmark = await this.bookmarkRepo.findOne({ where: { id: bookmarkId } });
    if (!bookmark) {
      this.logger.warn(`Bookmark with id=${bookmarkId} not found`);
      throw new NotFoundException('Bookmark not found');
    }

    const existing = await this.repo.findOne({
      where: { user: { id: userId }, bookmark: { id: bookmarkId } },
      relations: ['user', 'bookmark'],
    });

    if (existing && existing.value === value) {
      await this.repo.remove(existing);
      const msg = value === 1 ? 'Upvote removed' : 'Downvote removed';
      this.logger.log(`${msg} by userId=${userId}`);
      return { message: msg };
    }

    if (existing) {
      existing.value = value;
      await this.repo.save(existing);
      const msg = value === 1 ? 'Changed to upvote' : 'Changed to downvote';
      this.logger.log(`${msg} for bookmarkId=${bookmarkId}`);
      return { message: msg };
    }

    await this.repo.save({ user: { id: userId }, bookmark: { id: bookmarkId }, value });
    const msg = value === 1 ? 'Upvote added' : 'Downvote added';
    this.logger.log(`${msg} for bookmarkId=${bookmarkId} by userId=${userId}`);

    return { message: msg };
  }
}
