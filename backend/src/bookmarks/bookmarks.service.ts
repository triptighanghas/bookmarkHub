import { Injectable, BadRequestException, NotFoundException, Logger} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Bookmark } from './bookmark.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';

@Injectable()
export class BookmarksService {
  private readonly logger = new Logger(BookmarksService.name);

  constructor(
    @InjectRepository(Bookmark) private repo: Repository<Bookmark>,
    
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(title: string, url: string, userId: number) {
    this.logger.log(`Creating bookmark "${title}" for userId=${userId}`);

    if (!title || !url) {
      this.logger.warn(`Invalid bookmark data`);
      throw new BadRequestException('Title and URL are required');
    }
    
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      this.logger.warn(`User with id=${userId} not found`);
      throw new NotFoundException('User not found');
    }

    if (!/^https?:\/\//.test(url)) {
      this.logger.warn('Invalid URL for bookmark.')
      throw new BadRequestException('Invalid URL');
    }
    const bookmark = this.repo.create({ title, url, user });
    const saved = await this.repo.save(bookmark);
    this.logger.log(`Bookmark saved successfully with id=${saved.id}`);
    return saved;
  }

  async findAllWithVotes(userId?: number) {
    this.logger.log(`Fetching all bookmarks ${userId ? `(for user ${userId})` : '(public request)'}`);

    const results = await this.repo.query(`
      SELECT b.id, b.title, b.url, b.created_at, u.email AS posted_by,
             COALESCE(SUM(v.value), 0) AS vote_count,
             MAX(CASE WHEN v.user_id = $1 THEN v.value ELSE NULL END) AS user_vote
      FROM bookmarks b
      JOIN users u ON b.user_id = u.id
      LEFT JOIN votes v ON v.bookmark_id = b.id
      GROUP BY b.id, u.email
      ORDER BY b.created_at DESC;
    `, [userId || null]);

    if (!userId) {
      results.forEach((r: any) => delete r.user_vote);
    }
  
    return results.map((r: any) => ({
      ...r,
      vote_count: Number(r.vote_count),
      user_vote: r.user_vote !== null ? Number(r.user_vote) : r.user_vote,
    }));
  }
}
